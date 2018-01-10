/**
* Author:LuckyHu
*/
Ext.namespace("Lucky");
Lucky.CNeedLogin = function () {

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
            emptyText: '输入路径名称'
        });

        return searchTextBox;
    }

    //构造url
    this.FormatUrl = function () {

        //两个条件
        var strkeyWord = '';
        //var url = '/NeedLoginPushTask/GetGridData?strUserId=' + strDomainId;
        var url = '/NeedLoginPushTask/GetGridData';

        //关键字
        /*if (Ext.getCmp('keyWord') != undefined && Ext.getCmp('keyWord').getValue() != '') {

        strkeyWord = Ext.getCmp('keyWord').getValue();
        url += "&strKeyWord=" + escape(strkeyWord);
        }*/

        //过滤时间段
        /*var strStartTime = '';
        if (Ext.getCmp('beginTime') != undefined && Ext.getCmp('beginTime').getValue() != '') {
        strStartTime = Ext.util.Format.date(Ext.getCmp('beginTime').getValue(), 'Y-m-d');
        url += '&strStartTime=' + strStartTime;
        }
        var strEndTime = '';
        if (Ext.getCmp('endTime') != undefined && Ext.getCmp('endTime').getValue() != '') {
        strEndTime = Ext.util.Format.date(Ext.getCmp('endTime').getValue(), 'Y-m-d');
        url += '&strEndTime=' + strEndTime;
        }*/

        return url;
    }

    //2015.12.02 新增pnWest
    this.getPnWest = function (oTreePanel) {
        var pnWest = new Ext.Panel({
            title: '文件过滤器',
            id: "pnWest",
            plain: true,
            layout: 'column',
            width: 425,
            //height: 'auto',
            height: 400,
            //autoWidth: true,
            autoScroll: true,
            //split: true, //显示分隔条
            region: 'west',
            /*tbar: new Ext.Toolbar({
                items: [{
                    text: "刷新",
                    tooltip: '刷新',
                    icon: '../../../Scripts/ExtJs/ext-3.4.0/resources/images/user/arrow_refresh_small.png',
                    handler: function () {
                        Ext.Msg.alert('提示', '开发中...!');
                    }
                }, {
                    xtype: 'button',
                    anchor: '60%',
                    height: "50px",
                    text: '测试',
                    hiddden: true,
                    icon: '../../../Scripts/ExtJs/ext-3.4.0/resources/images/user/search.png',
                    handler: function () {
                        var strUrl = "/PushTask/Test";

                        function AjaxSuccess(response, options) {


                        }

                        Helper.Ajax(strUrl, null, AjaxSuccess, Helper.oDelegateFailure);
                    }
                }]
            }),*/
            collapsible: true,
            items: [oTreePanel]
        });

        return pnWest;
    }



    //构造GridPanel 
    this.GetGridPanel = function (strTitle, strGridPanelId) {

        //定义checkbox列模型
        //1.一般模式
        var sm = new Ext.grid.CheckboxSelectionModel();

        Ext.state.Manager.setProvider(new Ext.state.CookieProvider({
            expires: new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 10)) //remember state for 10 days
        }));

        this.oDynamicGrid = new Ext.grid.DynamicGrid({
            id: ID_DY_GRID_PANEL,
            height: 400,
            autoWidth: true,
            region: 'center',
            layout: 'fit',
            storeUrl: this.FormatUrl(),
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
            })
            //clickstoEdit: 2,
            //stateId: "codereview_grid_state"
            // make the grid stateful
            //stateful: true
        });

        var oContextmenu = new Ext.menu.Menu({
            id: 'theContextMenu',
            items: [{
                text: '代码送审',
                iconCls: 'icon-sign-out',
                handler: function () {
                    var selections = Ext.getCmp(ID_DY_GRID_PANEL).getSelectionModel().getSelections();
                    if (selections.length == 0) {
                        Ext.Msg.alert('提示', '请至少选择一项!');
                        return;
                    }

                    var _list = new Array();
                    for (var i = 0; i < selections.length; i++) {
                        _list.push(selections[i].get('Id'));
                    }
                    //2015.11.25 修改成批量推送
                    NeedLogin.winPushCodeFile(_list);
                }
            }, {
                text: '是否审核',
                iconCls: 'icon-sign-out',
                handler: function () {
                    var selections = Ext.getCmp(ID_DY_GRID_PANEL).getSelectionModel().getSelections();
                    if (selections.length == 0) {
                        Ext.Msg.alert('提示', '请选择!');
                        return;
                    }

                    if (selections.length > 1) {
                        Ext.Msg.alert('提示', '只能单选!');
                        return;
                    }

                    var id = selections[0].get('Id');

                    NeedLogin.winNeedReview(id);
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

            var strDetail = '<div style="position:absolute;top: 20%;font-size:15px">';
            strDetail += '<p>【DDL库】:<b style="color:green">'
            strDetail += record.get('DllRepositoryName');
            strDetail += '</b></p>';
            strDetail += '<p>【DDL路径】:<b style="color:green">'
            strDetail += record.get('DllFilePath');
            strDetail += '</b></p>';
            strDetail += '<p>【检测描述】:<b style="color:green">'
            strDetail += record.get('Description');
            strDetail += '</b></p>';
            strDetail += '</div>';

            Ext.getCmp("detailPanel").body.update(strDetail);
        });

        //测试
        this.oDynamicGrid.on('beforeload', function (store, options) {
            store.baseParams = {
                'test': 'test'
            };
        });

        //添加自定义参数
        //Ext.apply(this.oDynamicGrid.store.baseParams, { strCodeRepositoryName: strCodeRepositoryName });
        return this.oDynamicGrid;
    }

    /**
    * 用户详细
    */
    this.GetDetailPanel = function () {
        var detailPanel = new Ext.Panel({
            id: 'detailPanel',
            collapsible: true,
            title: '任务详情',
            region: 'south',
            width: '100%',
            height: 150,
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
                tooltip: '刷新',
                icon: '../../../Scripts/ExtJs/ext-3.4.0/resources/images/user/arrow_refresh_small.png',
                handler: function () {
                    NeedLogin.refreshStore();
                }
            },
            /*{
            xtype: 'datefield',
            format: 'Y-m-d',
            id: 'beginTime',
            name: 'beginTime',
            emptyText: '请选择起始日期',
            allowBlank: false,
            blankText: '请选择起始日期'
            },
            {
            xtype: 'datefield',
            format: 'Y-m-d',
            id: 'endTime',
            name: 'endTime',
            emptyText: '请选择结束日期',
            allowBlank: false,
            blankText: '请选择结束日期'
            }, '->', this.GetKeyWord(), {
            xtype: 'button',
            anchor: '60%',
            height: "50px",
            text: '搜索',
            icon: '../../../Scripts/ExtJs/ext-3.4.0/resources/images/user/search.png',
            handler: function () {
            var strUrl = PushTask.FormatUrl();
            var oGrid = Ext.getCmp(ID_DY_GRID_PANEL);
            oGrid.reload(strUrl);
            }
            }*/]
        });

        return tbar;
    }

    /**
    *在pnNorthPanel中添加子页面2014.03.21
    */
    this.AddSonPageInPnCenter = function (strSrc, strTitle, strFrameId) {
        var pnCenter = Ext.getCmp('pnCenter');
        var tab = pnCenter.getComponent(strFrameId);
        if (!tab) {
            pnCenter.add({
                title: strTitle,
                id: strFrameId,
                layout: 'fit',
                closable: true, //是否可关闭
                autoScroll: false,
                frame: true,
                border: false,
                html: '<iframe id="' + strFrameId + '" src="' + strSrc + '" width="100%" height="100%" frameborder="0" scrolling="auto"></iframe>'//改变iframe,解决跨域问题
            });

            pnCenter.setActiveTab(strFrameId);
        } else {

            //刷新
            var currentTab = Ext.getCmp(strFrameId);

            //1.从队列中移除当前tab
            pnCenter.remove(currentTab);

            //2.添加新tab
            pnCenter.add({
                title: strTitle,
                id: strFrameId,
                layout: 'fit',
                closable: true, //是否可关闭
                autoScroll: false,
                frame: true,
                html: '<iframe  id="' + strFrameId + '" src="' + strSrc + '" width="100%" height="100%" frameborder="0" scrolling="auto"></iframe>'//改变iframe,解决跨域问题
            });

            pnCenter.setActiveTab(strFrameId);
        }
    }

    /**
    * 删除
    */
    this.Delete = function (strId) {

        $.ajax({
            type: 'GET',
            url: '/Field/Delete',
            data: { strId: strId },
            success: function (data) {

                Ext.Msg.alert("提示", data.Notice);
                NeedLogin.refreshStore();
            }
        });
    }

    /**
    * 刷新
    */
    this.refreshStore = function (dir) {

        //根据id找到相应的grid
        var store = Ext.getCmp(ID_DY_GRID_PANEL).store;

        //store.reload();
        //var strCodeRepositoryName = Ext.getCmp('Svn').getRawValue();

        //2015.11.02 新增日期时间段
        //var startTime = Ext.util.Format.date(Ext.getCmp('beginTime').getValue(), 'Y-m-d H:i:s');
        //var endTime = Ext.util.Format.date(Ext.getCmp('endTime').getValue(), 'Y-m-d H:i:s');

        //同时更新Formaturl
        var url = NeedLogin.FormatUrl();

        store.load({
            params: {
                start: 0,
                limit: 20,
                //strStartTime: startTime,
                //strEndTime: endTime
                dir: dir
            }
        })
    }

    /**
    *代码推送
    */
    this.winPushCodeFile = function (_list) {

        function UpdateRocord(strReceiverId, strQuestionnaire) {

            //2015.11.25 暂时用土办法处理 将Ids处理字符串
            var strSelectedIDs = Helper.GetUrlParameters(_list);
            if (strSelectedIDs == undefined || strSelectedIDs == '' || strSelectedIDs == null) {
                Ext.Msg.alert("提示", "您没有选择任务!");
                return;
            }

            $.ajax({
                url: '/ReviewDllTask/SubmitCodeFiles',
                data: { strSelectedIDs: strSelectedIDs, receiverId: strReceiverId, domainId: strDomainId, questionnaire: strQuestionnaire },
                traditional: true,
                type: "POST",
                success: function (response) {
                    Ext.Msg.alert("提示", response.Notice);
                    NeedLogin.refreshStore();
                }
            });
        }

        function GetForm() {

            var strUrl = '/AdminUser/GetUserComboData';

            var store = new Ext.data.Store({

                //设定读取的地址
                proxy: new Ext.data.HttpProxy({ url: strUrl }),

                //设定读取的格式    
                reader: new Ext.data.JsonReader({ root: 'data' },
              [{ name: 'id' }, { name: 'name'}])
            });

            var form = new Ext.form.FormPanel({
                width: 400,
                height: 320,
                frame: true,
                maxinizable: false,
                items: [{
                    name: "Receiver",
                    id: "Receiver",
                    fieldLabel: "<font color=red>*</font> 任务接收者",
                    xtype: "combo",
                    anchor: "96%",
                    allowBlank: false,
                    store: store,
                    displayField: 'name',
                    valueField: 'id',
                    hiddenName: 'name',
                    triggerAction: 'all',
                    emptyText: '请选择接收人',
                    allowBlank: false,
                    blankText: '请选择接收人',
                    editable: false,
                    selectOnFocus: true,
                    width: 360,
                    height: 150,
                    mode: 'local',
                    listeners: {
                        'render': function () {
                            store.load();
                        }
                    }
                }, {
                    name: "Questionnaire",
                    id: "Questionnaire",
                    fieldLabel: "<font color=red>*</font> 说明",
                    xtype: "textfield",
                    allowBlank: false,
                    //readOnly: true,
                    //style: "background:none;border:0px;",
                    width: 360,
                    height: 150
                }]
            });

            return form;
        }

        var win = new Ext.Window({
            title: '分发任务',
            width: 400,
            height: 320,
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
                    var strReceiverId = Ext.getCmp('Receiver').getValue();
                    if (Helper.IsNullOrEmpty(Helper.Trim(strReceiverId))) {
                        Ext.Msg.alert('提示', '未指定任务接收者!');
                        return;
                    }

                    var strQuestionnaire = Ext.getCmp('Questionnaire').getValue();
                    if (Helper.IsNullOrEmpty(Helper.Trim(strQuestionnaire))) {
                        Ext.Msg.alert('提示', '请添加说明!');
                        return;
                    }

                    UpdateRocord(strReceiverId, strQuestionnaire);
                    win.close();
                }
            }, {
                text: '关闭',
                handler: function () {
                    win.close();
                }
            }]
        });
        win.show();
    }


    /**
    *设置是否推送
    */
    this.winNeedReview = function (id) {

        function NeedReview(id, needReview) {

            $.ajax({
                url: '/ReviewDllTask/NeedReview',
                data: { id: id, needReview: needReview },
                traditional: true,
                type: "POST",
                success: function (response) {
                    Ext.Msg.alert("提示", response.Notice);
                    NeedLogin.refreshStore();
                }
            });
        }

        function GetForm() {

            var data = [['0', '否'], ['1', '是']];

            var combo = new Ext.form.ComboBox({
                store: new Ext.data.SimpleStore({
                    fields: ['id', 'name'],
                    data:data
                }),
                id: 'NeedReview',
                fieldLabel: "<font color=red>*</font> 是否检查",
                typeAhead: true,
                mode: 'local',
                editable: false,
                triggerAction: 'all',
                emptyText: 'select',
                displayField: 'name',
                valueField: 'id',
                listeners: {
                    "select": function () {
                        /*alert(combo.value);
                        alert(Ext.get('co').dom.value);
                        alert(Ext.getCmp('co').getValue());*/
                    }
                }
            }); 

            var form = new Ext.form.FormPanel({
                width: 400,
                height: 150,
                frame: true,
                maxinizable: false,
                items: [combo]
            });

            return form;
        }

        var win = new Ext.Window({
            title: '审核设置',
            width: 400,
            height: 150,
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

                    var needReview = Ext.getCmp('NeedReview').getValue()==0?false:true;
                    NeedReview(id,needReview);
                    win.close();
                }
            }, {
                text: '关闭',
                handler: function () {
                    win.close();
                }
            }]
        });
        win.show();
    }


    /**
    * 检测输入提交人符号半角
    */


    //在这里继续写方法...

}

/**
* CNeedLogin 单例对象
*/
var NeedLogin = new Lucky.CNeedLogin();