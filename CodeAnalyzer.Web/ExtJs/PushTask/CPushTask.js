/**
* Author:LuckyHu
*/
Ext.namespace("Lucky");
Lucky.CPushTask = function () {

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
        var url = '/PushTask/GetGridData?strUserId=' + strDomainId;

        //关键字
        if (Ext.getCmp('keyWord') != undefined && Ext.getCmp('keyWord').getValue() != '') {

            strkeyWord = Ext.getCmp('keyWord').getValue();
            url += "&strKeyWord=" + escape(strkeyWord);
        }

        //SVN库名
        var strCodeRepositoryName = '';
        if (Ext.getCmp('Svn') != undefined && Ext.getCmp('Svn').getValue() != '') {
            strCodeRepositoryName = Ext.getCmp('Svn').getRawValue();
            url += "&strCodeRepositoryName=" + escape(strCodeRepositoryName);
        }

        //过滤时间段
        var strStartTime = '';
        if (Ext.getCmp('beginTime') != undefined && Ext.getCmp('beginTime').getValue() != '') {
            strStartTime = Ext.util.Format.date(Ext.getCmp('beginTime').getValue(), 'Y-m-d');
            url += '&strStartTime=' + strStartTime;
        }
        var strEndTime = '';
        if (Ext.getCmp('endTime') != undefined && Ext.getCmp('endTime').getValue() != '') {
            strEndTime = Ext.util.Format.date(Ext.getCmp('endTime').getValue(), 'Y-m-d');
            url += '&strEndTime=' + strEndTime;
        }

        //过滤提交人
        var strSubmitAuthor = '';
        if (Ext.getCmp('submitAuthor') != undefined && Ext.getCmp('submitAuthor').getValue() != '') {
            strSubmitAuthor = Ext.getCmp('submitAuthor').getValue();
            url += '&strSubmitAuthor=' + strSubmitAuthor;
        }

        //路径
        //var strPath = $('#Path').val();
        var strPath = '';
        var selections = Ext.getCmp('dynamicView').getSelectedRecords();
        if (selections[0] != null)
            strPath = selections[0].data.Path;
        if (strPath != '')
            url += '&strPath=' + strPath;

        return url;
    }

    //2015.12.02 新增pnWest
    this.getPnWest = function () {

        function formatUrl() {
            var url = '/PushTask/ListView1Json?strUserId=' + strDomainId;
            //SVN库名
            var strCodeRepositoryName = '';
            if (Ext.getCmp('Svn') != undefined && Ext.getCmp('Svn').getValue() != '') {
                strCodeRepositoryName = Ext.getCmp('Svn').getRawValue();
                url += "&strCodeRepositoryName=" + escape(strCodeRepositoryName);
            }
            return url;
        }

        var store = new Ext.data.JsonStore({
            fields: [
        { name: 'Path', type: 'string'}],
            proxy: new Ext.data.HttpProxy({
                url: formatUrl()
            }),
            root: 'rows',
            sortInfo: { field: 'Path', direction: 'DESC' }
        });
        store.load();

        var listView = new Ext.list.ListView({
            id: 'dynamicView',
            store: store,
            multiSelect: true,
            emptyText: '无数据',
            reserveScrollOffset: true,
            hideHeaders: true, //是否隐藏标题
            //autoScroll: true,
            //height: 400,
            autoWidth: true,
            columns: [{
                header: "Path",
                dataIndex: 'Path',
                tpl: '<span><img ext:qtip="{Path}" src="../../../Scripts/ExtJs/ext-3.4.0/resources/images/user/folder.png"<span><span style="font-size:11pt;font-weight:border;" ext:qtip="{Path}">{Path}</span>'
            }]
        });

        //当选择行改变时,输出被选行
        // little bit of feedback
        listView.on('selectionchange', function (view, nodes) {
            if (nodes.length > 1) {
                Ext.Msg.alert('提示', '只能单选!');
                return;
            }
            /*var item = nodes[0];
            var msg = '您选中的是:' + item.textContent;
            //Ext.Msg.alert('提示', msg);
            $('#Path').val(item.textContent);

            //单击刷新Grid
            PushTask.refreshStore();*/
            var selections = Ext.getCmp('dynamicView').getSelectedRecords();
            //$('#Path').val(selections[0].data.Path);

            //单击刷新Grid
            PushTask.refreshStore();

        });

        var pnWest = new Ext.Panel({
            title: '文件目录过滤器',
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
            tbar: new Ext.Toolbar({
                items: [{
                    text: "刷新",
                    tooltip: '刷新',
                    hidden: true,
                    icon: '../../../Scripts/ExtJs/ext-3.4.0/resources/images/user/arrow_refresh_small.png',
                    handler: function () {

                        var strCodeRepositoryName = '';
                        if (Ext.getCmp('Svn') != undefined && Ext.getCmp('Svn').getValue() != '') {
                            strCodeRepositoryName = Ext.getCmp('Svn').getRawValue();
                        }

                        formatUrl();
                        var store = listView.store;
                        var oLoadMask = Helper.LoadMask('加载中...');
                        store.load({
                            params: {
                                //start: 0,
                                //limit: 20,
                                strCodeRepositoryName: strCodeRepositoryName,
                                strUserId: strDomainId
                                //strStartTime: startTime,
                                //strEndTime: endTime,
                                //strSubmitAuthor: strSubmitAuthor
                            }
                        })
                        store.reload();
                        oLoadMask.hide();
                    }
                }, {
                    text: "取消选中",
                    tooltip: '取消选中',
                    icon: '../../../Scripts/ExtJs/ext-3.4.0/resources/images/user/clear-filter.png',
                    handler: function () {

                        //路径
                        Ext.getCmp('dynamicView').refresh();

                        var strCodeRepositoryName = '';
                        if (Ext.getCmp('Svn') != undefined && Ext.getCmp('Svn').getValue() != '') {
                            strCodeRepositoryName = Ext.getCmp('Svn').getRawValue();
                        }

                        formatUrl();
                        var store = listView.store;
                        var oLoadMask = Helper.LoadMask('加载中...');
                        store.load({
                            params: {
                                //start: 0,
                                //limit: 20,
                                strCodeRepositoryName: strCodeRepositoryName,
                                strUserId: strDomainId
                                //strStartTime: startTime,
                                //strEndTime: endTime,
                                //strSubmitAuthor: strSubmitAuthor
                            }
                        })
                        //store.refresh();
                        Ext.getCmp('dynamicView').refresh();
                        oLoadMask.hide();
                    }
                }]
            }),
            collapsible: true,
            items: [listView]
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
                    PushTask.winPushCodeFile(_list);
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
            strDetail += '<p>【SVN库】:<b style="color:green">'
            strDetail += record.get('CodeRepositoryName');
            strDetail += '</b></p>';
            strDetail += '<p>【路径】:<b style="color:green">'
            strDetail += record.get('FilePath');
            strDetail += '</b></p>';
            strDetail += '<p>【提交人】:<b style="color:green">'
            strDetail += record.get('SubmitAuthor');
            strDetail += '</b></p>';
            strDetail += '<p>【提交描述】:<b style="color:green">'
            strDetail += record.get('SubmitMessage');
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

                    PushTask.refreshStore();

                }
            }, /*{ text: 'SVN库', style: 'font-size:13px' },*/{
            name: "Svn",
            id: "Svn",
            //fieldLabel: "<font color=red>*</font>svn库",
            xtype: "combo",
            anchor: "96%",
            allowBlank: false,
            store: store,
            displayField: 'name',
            valueField: 'id',
            hiddenName: 'name',
            triggerAction: 'all',
            emptyText: '请选择svn库...',
            allowBlank: false,
            blankText: '请选择svn库',
            editable: false,
            selectOnFocus: true,
            //triggerAction: 'query',
            mode: 'local',
            listeners: {
                'render': function () {
                    store.load();
                }, 'select': function (combo, rex, index) {
                    //alert(index);
                    //联动事件
                    $('#Path').val('');
                    var strCodeRepositoryName = '';
                    if (Ext.getCmp('Svn') != undefined && Ext.getCmp('Svn').getValue() != '') {
                        strCodeRepositoryName = Ext.getCmp('Svn').getRawValue();
                    }
                    var store = Ext.getCmp('dynamicView').store;
                    var oLoadMask = Helper.LoadMask('加载中...');
                    store.load({
                        params: {
                            //start: 0,
                            //limit: 20,
                            strCodeRepositoryName: strCodeRepositoryName,
                            strUserId: strDomainId
                            //strStartTime: startTime,
                            //strEndTime: endTime,
                            //strSubmitAuthor: strSubmitAuthor
                        }
                    })
                    Ext.getCmp('dynamicView').refresh();
                    oLoadMask.hide();
                }
            }
        }, /*{ text: '起始日期', style: 'font-size:13px' },*/
            {
            xtype: 'datefield',
            format: 'Y-m-d',
            id: 'beginTime',
            name: 'beginTime',
            emptyText: '请选择起始日期',
            allowBlank: false,
            blankText: '请选择起始日期'
        }, /*{ text: '结束日期', style: 'font-size:13px' },*/
            {
            xtype: 'datefield',
            format: 'Y-m-d',
            id: 'endTime',
            name: 'endTime',
            emptyText: '请选择结束日期',
            allowBlank: false,
            blankText: '请选择结束日期'
        }, { text: '提交人', tooltip: '<span style="color:red">多提交人请用逗号分隔</span>', style: 'font-size:13px' }, {
            xtype: 'textfield',
            width: 200,
            name: 'submitAuthor',
            id: 'submitAuthor',
            emptyText: '多提交人请用逗号分隔',
            blankText: '多提交人请用逗号分隔'
        }, {
            text: '获取svn代码文件',
            tooltip: '推荐策略:<br>1.<span style="color:red">推荐被审核文件数最少的开发提交的代码文件</span><br/>2.<span style="color:red">推荐被审核次数最少的代码文件</span>',
            iconCls: 'icon-filter',
            handler: function () {

                var strUrl = "/PushTask/GetAllCommitedFiles";
                var svnname = Ext.getCmp('Svn').getRawValue();
                var dtBegin = Ext.getCmp('beginTime').getValue();
                console.log(dtBegin);
                var starttime = Ext.util.Format.date(Ext.getCmp('beginTime').getValue(), 'Y-m-d');
                var endtime = Ext.util.Format.date(Ext.getCmp('endTime').getValue(), 'Y-m-d');
                if (svnname == undefined || svnname == '' || svnname == null) {
                    Ext.Msg.alert("提示", '请选择SVN库!');
                    return;
                }

                if (starttime >= endtime) {
                    Ext.Msg.alert("提示", '起始时间必须早于结束时间!');
                    return;
                }

                function AjaxSuccess(response, options) {

                    var oRes = Ext.util.JSON.decode(response.responseText);
                    if (!oRes.Bresult) {
                        Ext.MessageBox.show({
                            title: '警告',
                            msg: oRes.Notice,
                            buttons: Ext.MessageBox.YESNO,
                            fn: function (btn, text) {
                                if (btn == 'yes') {
                                    Ext.Ajax.request({
                                        url: 'some.htm'
                                    });

                                }
                                if (btn == 'no') {

                                }
                            },
                            icon: Ext.MessageBox.WARNING,
                            closable: true
                        });
                        return;
                    }

                    //这里自动取数据
                    //2015.11.25 增加过滤条件 
                    //支持多提交人过滤
                    PushTask.refreshStore();
                }

                Helper.Ajax(strUrl, { userid: strDomainId, svnname: svnname, strstarttime: starttime, strendtime: endtime }, AjaxSuccess, Helper.oDelegateFailure);
            }
        }, '->', /* this.GetKeyWord(),*/{
        xtype: 'button',
        anchor: '60%',
        height: "50px",
        text: '清空条件',
        tooltip: '清空所有条件',
        icon: '../../../Scripts/ExtJs/ext-3.4.0/resources/images/user/clear-filter.png',
        handler: function () {

            //SVN库名
            if (Ext.getCmp('Svn') != undefined && Ext.getCmp('Svn').getValue() != '') {
                Ext.getCmp('Svn').setValue('');
            }

            //过滤时间段
            if (Ext.getCmp('beginTime') != undefined && Ext.getCmp('beginTime').getValue() != '') {
                Ext.getCmp('beginTime').setValue('');
            }

            if (Ext.getCmp('endTime') != undefined && Ext.getCmp('endTime').getValue() != '') {
                Ext.getCmp('endTime').setValue('');
            }

            //过滤提交人
            if (Ext.getCmp('submitAuthor') != undefined && Ext.getCmp('submitAuthor').getValue() != '') {
                Ext.getCmp('submitAuthor').setValue('');
            }

            //清空路径
            Ext.getCmp('dynamicView').refresh();
        }
    }, {
        xtype: 'button',
        anchor: '60%',
        height: "50px",
        text: '搜索',
        icon: '../../../Scripts/ExtJs/ext-3.4.0/resources/images/user/search.png',
        handler: function () {

            /*if (Ext.getCmp('Svn') == undefined || Ext.getCmp('Svn').getValue() == '' || Ext.getCmp('Svn').getValue() == null) {
            Ext.Msg.alert("提示", '请选择SVN库!');
            return;
            }
            var starttime = Ext.util.Format.date(Ext.getCmp('beginTime').getValue(), 'Y-m-d');
            var endtime = Ext.util.Format.date(Ext.getCmp('endTime').getValue(), 'Y-m-d');
            if (starttime >= endtime) {
            Ext.Msg.alert("提示", '起始时间必须早于结束时间!');
            return;
            }*/

            var strUrl = PushTask.FormatUrl();
            var oGrid = Ext.getCmp(ID_DY_GRID_PANEL);
            oGrid.reload(strUrl);
        }
    }]
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
            PushTask.refreshStore();
        }
    });
}

/**
* 刷新
*/
this.refreshStore = function () {

    //根据id找到相应的grid
    var store = Ext.getCmp(ID_DY_GRID_PANEL).store;

    //store.reload();
    var strCodeRepositoryName = Ext.getCmp('Svn').getRawValue();

    //2015.11.02 新增日期时间段
    var startTime = Ext.util.Format.date(Ext.getCmp('beginTime').getValue(), 'Y-m-d H:i:s');
    var endTime = Ext.util.Format.date(Ext.getCmp('endTime').getValue(), 'Y-m-d H:i:s');

    //2015.11.25 新增提交人过滤
    var strSubmitAuthor = Ext.getCmp('submitAuthor').getValue();

    //2015.12.03
    var strPath = '';
    var selections = Ext.getCmp('dynamicView').getSelectedRecords();
    if (selections[0] != null)
        strPath = selections[0].data.Path;

    //同时更新Formaturl
    var url = PushTask.FormatUrl();

    store.load({
        params: {
            start: 0,
            limit: 20,
            strCodeRepositoryName: strCodeRepositoryName,
            strStartTime: startTime,
            strEndTime: endTime,
            strSubmitAuthor: strSubmitAuthor,
            strPath: strPath
        }
    })
}

/**
*代码推送
*/
this.winPushCodeFile = function (_list) {

    function UpdateRocord(strReceiverId) {

        //需要在data参数里，加一个traditional：true的参数，这样就能正常发送数组参数了。原因时从1.4以后，jQuery改变了参数的序列化方法。
        /*$.ajax({
        url: '/ReviewTask/UpdateStatuses',
        data: { selectedIDs: _list, status: strUserId },
        traditional: true,
        type: "POST",
        success: function (response) {
        //var oRes = Ext.util.JSON.decode(response.responseText);
        Ext.Msg.alert("提示", response.Notice);
        ReviewTask.refreshStore();
        }
        });*/

        //2015.11.25 暂时用土办法处理 将Ids处理字符串
        var strSelectedIDs = Helper.GetUrlParameters(_list);
        if (strSelectedIDs == undefined || strSelectedIDs == '' || strSelectedIDs == null) {
            Ext.Msg.alert("提示", "您没有选择任务!");
            return;
        }

        $.ajax({
            url: '/ReviewTask/SubmitCodeFiles',
            //data: { selectedID: _list, receiverId: strReceiverId, domainId: strDomainId },
            data: { strSelectedIDs: strSelectedIDs, receiverId: strReceiverId, domainId: strDomainId },
            traditional: true,
            //dataType: "json",
            type: "POST",
            success: function (response) {
                Ext.Msg.alert("提示", response.Notice);
                PushTask.refreshStore();
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
            height: 150,
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
                width: 380,
                height: 220,
                mode: 'local',
                //triggerAction: 'query',
                listeners: {
                    'render': function () {
                        store.load();
                    }
                }
            }]
        });

        //监听load事件
        /*store.on('load', function (store, record, opts) {
        var combo = Ext.getCmp("User");
        var firstValue = record[0].data.id;
        combo.setValue(firstValue); //选中  
        });*/

        return form;
    }

    var win = new Ext.Window({
        title: '分发任务',
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
                    var strReceiverId = Ext.getCmp('Receiver').getValue();
                    if (Helper.IsNullOrEmpty(Helper.Trim(strReceiverId))) {
                        Ext.Msg.alert('提示', '未指定任务接收者!');
                        return;
                    }

                    //win.close();
                    //UpdateRocord(strReviewStatusId);
                    UpdateRocord(strReceiverId);
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
* CPushTask 单例对象
*/
var PushTask = new Lucky.CPushTask();