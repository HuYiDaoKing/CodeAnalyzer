/**
* Author:LuckyHu
*/
Ext.namespace("Lucky");
Lucky.CNeedLoginReviewTask = function () {

    //搜索框工具条
    this.GetKeyWord = function () {

        //搜索框
        var searchTextBox = new Ext.form.TextField({
            id: 'keyWord',
            xtype: 'textfield',
            fieldLabel: '关键词',
            name: 'keyWord',
            anchor: '60%',
            height: "50px",
            emptyText: '输入路径或名称'
        });

        return searchTextBox;
    }

    //构造url
    this.FormatUrl = function (flag) {

        //两个条件
        var strkeyWord = '';
        var url = '/ReviewDllTask/GetGridData?strUserId=' + strDomainId;

        //关键字
        if (Ext.getCmp('keyWord') != undefined && Ext.getCmp('keyWord').getValue() != '') {

            strkeyWord = Ext.getCmp('keyWord').getValue();
            url += "&strKeyWord=" + escape(strkeyWord);
        }

        //状态
        switch (flag) {
            case 'all':
                url += '&status=-2'
                break;
            case 'undeal':
                url += '&status=-1'
                break;
            case 'finished':
                url += '&status=2'
                break;
        }
        return url;
    }

    //构造GridPanel 
    this.GetGridPanel = function (strTitle, strGridPanelId) {

        //定义checkbox列模型
        //1.一般模式
        var sm = new Ext.grid.CheckboxSelectionModel();

        this.oDynamicGrid = new Ext.grid.DynamicGrid({
            id: ID_DY_GRID_PANEL,
            height: 400,
            autoWidth: true,
            region: 'center',
            layout: 'fit',
            storeUrl: this.FormatUrl('all'),
            checkboxSelModel: true,
            sm: sm,
            use_ActionColumn: false,
            tbar: this.GetTbar(),
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                displayInfo: true,
                displayMsg: '显示第{0}到{1}条数据,共{2}条',
                emptyMsg: "没有数据",
                beforePageText: "第",
                afterPageText: '页 共{0}页'
            }),
            frame: true,
            clickstoEdit: 2
        });

        var oContextmenu = new Ext.menu.Menu({
            id: 'theContextMenu',
            items: [{
                text: '接受任务',
                //iconCls: 'icon-tick',
                icon: '../../../Scripts/ExtJs/ext-3.4.0/resources/images/user/confirm_receive.png',
                handler: function () {

                    if (!Helper.CheckValidation()) {
                        return;
                    }

                    var _list = {};
                    var selections = Ext.getCmp(ID_DY_GRID_PANEL).getSelectionModel().getSelections();
                    //这里要排除已经处理过接受的任务
                    //仅针对待审状态的任务
                    var _count = 0;
                    for (var i = 0; i < selections.length; i++) {
                        var statusId = selections[i].get('StatusId')
                        if (statusId == '-1') {
                            _list["selectedIDs[" + i + "]"] = selections[i].get('Id');
                            ++_count;
                        }
                    }
                    if (_count < 1) {
                        Ext.Msg.alert("提示", '当前选中任务已经是接受状态!');
                        return;
                    }
                    $.ajax({
                        url: '/ReviewDllTask/ReceiveTasks',
                        data: _list,
                        dataType: "json",
                        type: "POST",
                        success: function (response) {
                            Ext.Msg.alert("提示", response.Notice);
                            NeedLoginReviewTask.refreshStore();
                        }
                    });
                }
            }, {
                text: '暂停任务',
                icon: '../../../Scripts/ExtJs/ext-3.4.0/resources/images/user/pause.png',
                handler: function () {

                    if (!Helper.CheckValidation()) {
                        return;
                    }

                    var oRecord = Ext.getCmp(ID_DY_GRID_PANEL).getSelectionModel().getSelected();
                    var strId = oRecord.get('Id');
                    var strPendingReason = oRecord.get('PendingReason');
                    var statusId = oRecord.get('StatusId');

                    //必须是已经接受的任务才可手动修改状态
                    if (statusId < 0) {
                        Ext.Msg.alert("提示", "您还没有接受当前任务,亲!");
                        return;
                    }
                    //ReviewTask.winUpdateQuestionaire(strId, strQuestionaire);
                    NeedLoginReviewTask.winPendingStatus(strId, strPendingReason);
                }
            }, {
                text: '完成任务',
                iconCls: 'icon-tick',
                handler: function () {

                    if (!Helper.CheckValidation()) {
                        return;
                    }

                    var oRecord = Ext.getCmp(ID_DY_GRID_PANEL).getSelectionModel().getSelected();
                    var statusId = oRecord.get('StatusId');

                    //必须是已经接受的任务才可手动修改状态
                    if (statusId < 0) {
                        Ext.Msg.alert("提示", "您还没有接受当前任务,亲!");
                        return;
                    }

                    var strId = oRecord.get('Id');
                    var strOldQuestionaire = oRecord.get('Questionnaire');
                    var strIsBug = oRecord.get('IsBug');
                    NeedLoginReviewTask.winFinishedQuestionaire(strId, strOldQuestionaire, strIsBug);
                }
            }]
        });

        this.oDynamicGrid.on("rowcontextmenu", function (grid, rowIndex, e) {
            e.preventDefault();
            //grid.getSelectionModel().selectRow(rowIndex);
            oContextmenu.showAt(e.getXY());
        });

        //20140925 增加查看明细功能
        this.oDynamicGrid.on("rowclick", function (grid, rowIndex) {
            var selectionModel = grid.getSelectionModel();
            var record = selectionModel.getSelected();

            //问题描述
            var questionnaire = record.get('Questionnaire') + "<br/>";
            var regRN = /\n/g;
            questionnaire = questionnaire.replace(regRN, "&nbsp;<br />");

            var strDetail = '<div style="position:absolute;top: 20%;font-size:15px">';
            strDetail += '<p>【Dll库】:<b style="color:green">'
            strDetail += record.get('DllRepositoryName');
            strDetail += '</b></p>';
            strDetail += '<p>【Dll路径】:<b style="color:green">'
            strDetail += record.get('DllFilePath');
            strDetail += '</b></p>';
            strDetail += '<p>【类名】:<b style="color:green">'
            strDetail += record.get('ClassName');
            strDetail += '</b></p>';
            strDetail += '<p>【是否有Bug】:<b style="color:green">'
            strDetail += record.get('IsBug');
            strDetail += '</b></p>';
            strDetail += '<p>【问题单】:<b style="color:green">'
            strDetail += questionnaire;
            strDetail += '</b></p>';
            strDetail += '</div>';

            Ext.getCmp("detailPanel").body.update(strDetail);
        });

        return this.oDynamicGrid;
    }

    /**
    * 用户详细
    */
    this.GetDetailPanel = function () {
        var detailPanel = new Ext.Panel({
            id: 'detailPanel',
            autoScroll: true,
            collapsible: true,
            title: '任务详情',
            region: 'south',
            width: '100%',
            height: 200,
            items: []
        });

        return detailPanel;
    }

    //获取tbar
    this.GetTbar = function () {

        //下拉列表数据
        var store = new Ext.data.Store({

            proxy: new Ext.data.HttpProxy({ url: '/PushTask/GetSvnComboStore' }),

            reader: new Ext.data.JsonReader({ root: 'data' },
              [{ name: 'id' }, { name: 'name'}])
        });
        var tbar = new Ext.Toolbar({
            items: [{
                text: "刷新",
                icon: '../../../Scripts/ExtJs/ext-3.4.0/resources/images/user/arrow_refresh_small.png',
                handler: function () {

                    NeedLoginReviewTask.refreshStore();
                    
                }
            }, {
                text: "所有",
                hidden: false,
                icon: '../../Scripts/ExtJs/ext-3.4.0/resources/images/user/all-files.png',
                handler: function () {
                    var strUrl = NeedLoginReviewTask.FormatUrl('all');
                    var oGrid = Ext.getCmp(ID_DY_GRID_PANEL);
                    oGrid.reload(strUrl);
                }
            }, {
                text: "待审查",
                hidden: false,
                icon: '../../Scripts/ExtJs/ext-3.4.0/resources/images/user/wait.png',
                handler: function () {
                    var strUrl = NeedLoginReviewTask.FormatUrl('undeal');
                    var oGrid = Ext.getCmp(ID_DY_GRID_PANEL);
                    oGrid.reload(strUrl);
                }
            }, {
                text: "已审查",
                hidden: false,
                icon: '../../Scripts/ExtJs/ext-3.4.0/resources/images/user/task-completed.png',
                handler: function () {
                    //Ext.Msg.alert("提示", "建设中...");
                    var strUrl = NeedLoginReviewTask.FormatUrl('finished');
                    var oGrid = Ext.getCmp(ID_DY_GRID_PANEL);
                    oGrid.reload(strUrl);
                }
            }, {
                text: "审查有问题的",
                hidden: true,
                icon: '../../Scripts/ExtJs/ext-3.4.0/resources/images/user/bug_error.png',
                handler: function () {
                    Ext.Msg.alert("提示", "建设中...");
                }
            }, '->', this.GetKeyWord(), {
                xtype: 'button',
                anchor: '60%',
                height: "50px",
                text: '搜索',
                icon: '../../../Scripts/ExtJs/ext-3.4.0/resources/images/user/search.png',
                handler: function () {
                    var strUrl = NeedLoginReviewTask.FormatUrl('all');
                    var oGrid = Ext.getCmp(ID_DY_GRID_PANEL);
                    oGrid.reload(strUrl);
                }
            }]
        });

        return tbar;
    }

    /**
    * 刷新
    */
    this.refreshStore = function () {

        //根据id找到相应的grid
        var store = Ext.getCmp(ID_DY_GRID_PANEL).store;

        store.reload();
    }

    /**
    *修改状态
    */
    this.winUpdateStatus = function (strOldReviewStatusId, _list) {

        function UpdateRocord(strReviewStatusId) {

            //需要在data参数里，加一个traditional：true的参数，这样就能正常发送数组参数了。原因时从1.4以后，jQuery改变了参数的序列化方法。
            $.ajax({
                url: '/ReviewTask/UpdateStatuses',
                data: { selectedIDs: _list, status: strOldReviewStatusId },
                traditional: true,
                type: "POST",
                success: function (response) {
                    //var oRes = Ext.util.JSON.decode(response.responseText);
                    Ext.Msg.alert("提示", response.Notice);
                    ReviewTask.refreshStore();
                }
            });
        }

        function GetForm(strReviewStatusId) {

            var strUrl = '/ReviewTask/GetReviewComboData?strReviewStatusId=' + strReviewStatusId;

            var store = new Ext.data.Store({

                //设定读取的地址
                proxy: new Ext.data.HttpProxy({ url: strUrl }),

                //设定读取的格式    
                reader: new Ext.data.JsonReader({ root: 'data' },
              [{ name: 'id' }, { name: 'name'}])
            });

            var form = new Ext.form.FormPanel({
                width: 400,
                height: 150,
                frame: true,
                maxinizable: false,
                items: [{
                    name: "Status",
                    id: "Status",
                    fieldLabel: "<font color=red>*</font> 状态",
                    xtype: "combo",
                    anchor: "96%",
                    allowBlank: false,
                    store: store,
                    displayField: 'name',
                    valueField: 'id',
                    hiddenName: 'name',
                    triggerAction: 'all',
                    emptyText: '请选择状态...',
                    allowBlank: false,
                    blankText: '请选择状态',
                    editable: false,
                    selectOnFocus: true,
                    width: 380,
                    height: 220,
                    mode: 'local',
                    listeners: {
                        'render': function () {
                            store.load();
                        }
                    }
                }]
            });

            //监听load事件
            store.on('load', function (store, record, opts) {
                var combo = Ext.getCmp("Status");
                var firstValue = record[0].data.id;
                combo.setValue(firstValue); //选中  
            });

            return form;
        }

        var win = new Ext.Window({
            title: '修改状态',
            width: 400,
            height: 150,
            maximizable: false,
            maskDisabled: true,
            modal: true,
            bodyStyle: 'background-color:#fff',
            items: [GetForm(strOldReviewStatusId)],
            buttonAlign: 'center',
            buttons: [
            {
                text: '确定',
                handler: function () {
                    var strReviewStatusId = Ext.getCmp('Status').getValue();
                    if (Helper.IsNullOrEmpty(Helper.Trim(strReviewStatusId))) {
                        Ext.Msg.alert('提示', '不能为空!');
                        return;
                    }

                    if (strReviewStatusId == '0') {
                        Ext.Msg.alert("提示", "您已经是接受状态,亲!");
                        return;
                    }
                    win.close();
                    UpdateRocord(strReviewStatusId);
                }
            }, {
                text: '关闭',
                handler: function () {
                    win.close();
                }
            }]
        });

        //表单填充
        Ext.getCmp('Status').setValue(strOldReviewStatusId);
        win.show();
    }

    /**
    * 修改成挂起状态
    */
    this.winPendingStatus = function (strId, strOldPendingReason) {

        function UpdateRocord(strPendingReason) {

            //需要在data参数里，加一个traditional:true的参数，这样就能正常发送数组参数了。原因时从1.4以后，jQuery改变了参数的序列化方法。
            $.ajax({
                url: '/ReviewDllTask/PendingStatus',
                data: { id: strId, pendingReason: strPendingReason },
                //traditional: true,
                type: "POST",
                success: function (response) {
                    Ext.Msg.alert("提示", response.Notice);
                    NeedLoginReviewTask.refreshStore();
                }
            });
        }

        function GetForm(strReviewStatusId) {

            var form = new Ext.form.FormPanel({
                width: 500,
                height: 400,
                frame: true,
                maxinizable: false,
                items: [{
                    xtype: "textarea",
                    fieldLabel: "挂起原因",
                    emptyText: '多行,请换行填写.',
                    id: "PendingReason",
                    labelSepartor: "：",
                    allowBlank: false,
                    labelWidth: 60,
                    height: 300,
                    width: 350
                }]
            });

            return form;
        }
        var win = new Ext.Window({
            title: '修改原因',
            width: 500,
            height: 400,
            maximizable: false,
            maskDisabled: true,
            modal: true,
            bodyStyle: 'background-color:#fff',
            items: [GetForm()],
            buttonAlign: 'center',
            buttons: [
            {
                text: '确定',
                handler: function () {
                    var strPendingReason = Ext.getCmp('PendingReason').getValue();
                    if (Helper.IsNullOrEmpty(Helper.Trim(strPendingReason))) {
                        Ext.Msg.alert('提示', '不能为空!');
                        return;
                    }

                    win.close();
                    UpdateRocord(strPendingReason);
                }
            }, {
                text: '关闭',
                handler: function () {
                    win.close();
                }
            }]
        });

        //表单填充
        Ext.getCmp('PendingReason').setValue(strOldPendingReason);
        win.show();
    }

    /**
    * 修改成完成状态
    */
    this.winFinishedQuestionaire = function (strId, strOldQuestionaire, oldIsBug) {

        var radios = new Ext.form.RadioGroup({
            fieldLabel: "是否有Bug",
            columns: 6,
            items: [{
                boxLabel: "否",
                name: "IsBug",
                inputValue: "0"
            }, {
                boxLabel: "是",
                name: "IsBug",
                inputValue: "1"
            }]
        });

        function UpdateRocord(strQuestionaire) {

            //需要在data参数里，加一个traditional：true的参数，这样就能正常发送数组参数了。原因时从1.4以后，jQuery改变了参数的序列化方法。
            $.ajax({
                url: '/ReviewDllTask/FinishedStatus',
                data: { id: strId, questionaire: strQuestionaire, isBug: radios.getValue().inputValue },
                //traditional: true,
                type: "POST",
                success: function (response) {
                    Ext.Msg.alert("提示", response.Notice);
                    NeedLoginReviewTask.refreshStore();
                }
            });
        }

        function GetForm(strReviewStatusId) {
            var form = new Ext.form.FormPanel({
                width: 500,
                height: 400,
                frame: true,
                maxinizable: false,
                items: [radios, {
                    xtype: "textarea",
                    fieldLabel: "问题单",
                    emptyText: '多个问题,请换行填写.',
                    id: "Questionnaire",
                    labelSepartor: "：",
                    allowBlank: true,
                    labelWidth: 60,
                    height: 300,
                    width: 350
                }]
            });

            return form;
        }
        var win = new Ext.Window({
            title: '修改问题单',
            width: 500,
            height: 400,
            maximizable: false,
            maskDisabled: true,
            modal: true,
            bodyStyle: 'background-color:#fff',
            items: [GetForm()],
            buttonAlign: 'center',
            buttons: [
            {
                text: '确定',
                handler: function () {
                    var strQuestionnaire = Ext.getCmp('Questionnaire').getValue();
                    //20151207 修改成仅当有bug时强制填写问题单
                    if (radios.getValue().inputValue == true && Helper.IsNullOrEmpty(Helper.Trim(strQuestionnaire))) {
                        Ext.Msg.alert('提示', '有Bug的任务,问题单不能为空!');
                        return;
                    }

                    win.close();
                    UpdateRocord(strQuestionnaire);
                }
            }, {
                text: '关闭',
                handler: function () {
                    win.close();
                }
            }]
        });

        //表单填充
        Ext.getCmp('Questionnaire').setValue(strOldQuestionaire);
        if (oldIsBug == '否')
            radios.setValue(0);
        else
            radios.setValue(1);

        win.show();
    }

    /*
    ** 测试Add
    */
    this.AddEvent = function () {

        Ext.Msg.alert('提示', '我在其他页面测试添加!');

    }

    //在这里继续写方法...

}

/**
* CNeedLoginReviewTask. 单例对象
*/
var NeedLoginReviewTask = new Lucky.CNeedLoginReviewTask();