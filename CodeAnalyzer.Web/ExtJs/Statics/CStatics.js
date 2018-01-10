/**
* Author:LuckyHu
*/
Ext.namespace("Lucky");
Lucky.CStatics = function () {

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
            emptyText: '输入名称'
        });

        return searchTextBox;
    }

    //构造url
    this.FormatUrl = function () {

        //两个条件
        var strkeyWord = '';
        var url = '/Statics/GetGridData?strUserId=' + strDomainId;

        //关键字
        if (Ext.getCmp('keyWord') != undefined && Ext.getCmp('keyWord').getValue() != '') {

            strkeyWord = Ext.getCmp('keyWord').getValue();
            url += "&strKeyWord=" + escape(strkeyWord);
        }

        //过滤时间段
        var strStartTime = '';
        if (Ext.getCmp('beginTime') != undefined && Ext.getCmp('beginTime').getValue() != '') {
            strStartTime = Ext.util.Format.date(Ext.getCmp('beginTime').getValue(), 'Y-m-d H:i:s');
            url += '&strStartTime=' + strStartTime;
        }
        var strEndTime = '';
        if (Ext.getCmp('endTime') != undefined && Ext.getCmp('endTime').getValue() != '') {
            strEndTime = Ext.util.Format.date(Ext.getCmp('endTime').getValue(), 'Y-m-d H:i:s');
            url += '&strEndTime=' + strEndTime;
        }

        return url;
    }

    //构造GridPanel 
    this.GetGridPanel = function (strTitle, strGridPanelId) {

        //定义checkbox列模型
        //1.一般模式
        //var sm = new Ext.grid.CheckboxSelectionModel();

        /*this.oDynamicGrid = new Ext.grid.DynamicGrid({
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
        pageSize: 10,
        displayInfo: true,
        displayMsg: '显示第{0}到{1}条数据,共{2}条',
        emptyMsg: "没有数据",
        beforePageText: "第",
        afterPageText: '页 共{0}页'
        }),
        clickstoEdit: 2
        });*/

        var columns = [
            { header: 'ID', dataIndex: 'Id', hidden: true },
            { header: '详情', dataIndex: '', renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                var str = "<a href='https://www.baidu.com'>查看详细信息</a>";
                return str;
            }
            },
            { header: 'SVN库', dataIndex: 'CodeRepositoryName' },
            { header: '账户', dataIndex: 'UserId' },
            { header: '版本', dataIndex: 'Revision' },
            { header: '动作', dataIndex: 'Action' },
            { header: '路径', dataIndex: 'FilePath' },
            { header: '提交说明', dataIndex: 'SubmitMessage' },
            { header: '提交人', dataIndex: 'SubmitAuthor' },
            { header: '提交日期', dataIndex: 'SubmitTime' }
            ];

        var reader = new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'demo',
            fields: [
                   { name: 'Id' },
                   { name: 'CodeRepositoryName' },
                   { name: 'UserId' },
                   { name: 'RealName' },
                   { name: 'Revision' },
                   { name: 'Action' },
                   { name: 'FilePath' },
                   { name: 'SubmitMessage' },
                   { name: 'SubmitAuthor' },
                   { name: 'SubmitTime'}]
        });

        var store = new Ext.data.GroupingStore({
            reader: reader,
            proxy: new Ext.data.HttpProxy({
                url: Statics.FormatUrl()
            }),
            groupField: 'CodeRepositoryName',
            sortInfo: { field: 'Id', direction: "ASC" },
            baseParams: {
                limit: 100
            },
            totalProperty: 'total',
            root: 'demo'
        });

        //自定义参数
        store.on('beforeload', function (store, options) {
            //关键字
            var strkeyWord = '';
            if (Ext.getCmp('keyWord') != undefined && Ext.getCmp('keyWord').getValue() != '') {
                strkeyWord = Ext.getCmp('keyWord').getValue();
            }

            //过滤时间段
            var strStartTime = '';
            if (Ext.getCmp('beginTime') != undefined && Ext.getCmp('beginTime').getValue() != '') {
                strStartTime = Ext.util.Format.date(Ext.getCmp('beginTime').getValue(), 'Y-m-d H:i:s');
            }
            var strEndTime = '';
            if (Ext.getCmp('endTime') != undefined && Ext.getCmp('endTime').getValue() != '') {
                strEndTime = Ext.util.Format.date(Ext.getCmp('endTime').getValue(), 'Y-m-d H:i:s');
            }

            Ext.apply(store.baseParams, { strKeyWord: strkeyWord, strStartTime: strStartTime, strEndTime: strEndTime });
        });

        store.load({
            params: { start: 0 }
        });

        ///视图   
        var view = new Ext.grid.GroupingView({
            ///是否自动填充 
            forceFit: true,
            groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "条" : "条"]})',
            ///排序描述 
            sortAscText: '正向排序',
            ///排序描述 
            sortDescText: '反向排序',
            ///菜单提示 显示 隐藏列 
            columnsText: '显示列/隐藏列',
            //显示分组菜单 
            enableGroupingMenu: true,
            ///内容为空时 提示的文本内容 
            emptyGroupText: 'AAAA',
            ///菜单中的分组描述字段 
            groupByText: '按此分组',
            ///分组显示的开关 
            showGroupsText: '是否显示分组',
            ///显示隐藏进行分徐的列 
            hideGroupedColumn: false,
            ///是否使用IFrame 
            frame: true
        })

        this.oDynamicGrid = new Ext.grid.GridPanel({
            id: ID_DY_GRID_PANEL,
            height: 400,
            autoWidth: true,
            region: 'center',
            layout: 'fit',
            store: store,
            columns: columns,
            view: view,
            //renderTo: 'grid',
            tbar: this.GetTbar(),
            bbar: new Ext.PagingToolbar({
                pageSize: 100,
                displayInfo: true,
                displayMsg: '显示第{0}到{1}条数据,共{2}条',
                emptyMsg: "没有数据",
                store: store,
                beforePageText: "第",
                afterPageText: '页 共{0}页'
            })
        });

        var oContextmenu = new Ext.menu.Menu({
            id: 'theContextMenu',
            items: [{
                text: '删除',
                icon: '../../../Scripts/ExtJs/ext-3.4.0/resources/images/user/delete_1.png',
                hidden: false,
                handler: function () {

                    if (!Helper.CheckValidation()) {
                        return;
                    }

                    //获取单选记录
                    var oRecord = Ext.getCmp(ID_DY_GRID_PANEL).getSelectionModel().getSelected();
                    var strId = oRecord.get('Id');

                    Ext.MessageBox.confirm('请确认', '您确定要删除？', function (btn) {

                        if (btn == 'yes') {
                            Role.Delete(strId);
                        }
                    });
                }
            }]
        });

        this.oDynamicGrid.on("rowcontextmenu", function (grid, rowIndex, e) {
            e.preventDefault();
            oContextmenu.showAt(e.getXY());
        });

        //20140925 增加查看明细功能
        this.oDynamicGrid.on("rowclick", function (grid, rowIndex) {
            var selectionModel = grid.getSelectionModel();
            var record = selectionModel.getSelected();

            /*var strDetail = '<div style="position:absolute;top: 20%;font-size:15px">';
            strDetail += '<p>【名称】:<b style="color:green">'
            strDetail += record.get('Name');
            strDetail += '</b></p>';
            strDetail += '</div>';*/

            //问题描述
            var questionnaire = "<br/>" + record.get('Questionnaire');
            var regRN = /\n/g;
            questionnaire = questionnaire.replace(regRN, "&nbsp;<br />");

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
            strDetail += '<p>【是否有Bug】:<b style="color:green">'
            strDetail += record.get('IsBug');
            strDetail += '</b></p>';
            if (record.get('Status') == 1) {
                strDetail += '<p>【暂停原因】:<b style="color:green">'
                strDetail += record.get('PendingReason');
                strDetail += '</b></p>';
            }
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
            height: 100,
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

                    Statics.refreshStore();
                }
            }, { text: 'SVN库', style: 'font-size:13px' }, {
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
                mode: 'local',
                listeners: {
                    'render': function () {
                        store.load();
                    }
                }
            }, { text: '起始时间', style: 'font-size:13px' },
            {
                xtype: 'datetimefield',
                id: 'beginTime',
                name: 'beginTime'
            }, { text: '结束时间', style: 'font-size:13px' },
            {
                xtype: 'datetimefield',
                id: 'endTime',
                name: 'endTime'
            }, '->', this.GetKeyWord(), {
                xtype: 'button',
                anchor: '60%',
                height: "50px",
                text: '搜索',
                icon: '../../../Scripts/ExtJs/ext-3.4.0/resources/images/user/search.png',
                handler: function () {
                    if (Ext.getCmp('Svn') == undefined || Ext.getCmp('Svn').getValue() == '' || Ext.getCmp('Svn').getValue() == null) {
                        Ext.Msg.alert("提示", '请选择SVN库!');
                        return;
                    }

                    var starttime = Ext.util.Format.date(Ext.getCmp('beginTime').getValue(), 'Y-m-d H:i:s');
                    var endtime = Ext.util.Format.date(Ext.getCmp('endTime').getValue(), 'Y-m-d H:i:s');
                    if (starttime >= endtime) {
                        Ext.Msg.alert("提示", '起始时间必须早于结束时间!');
                        return;
                    }

                    /*var strUrl = Statics.FormatUrl();
                    var oGrid = Ext.getCmp(ID_DY_GRID_PANEL);
                    oGrid.reload(strUrl);*/

                    //根据id找到相应的grid
                    var store = Ext.getCmp(ID_DY_GRID_PANEL).store;

                    //同时更新Formaturl
                    var url = Statics.FormatUrl();

                    store.load({
                        params: {
                            start: 0,
                            limit: 100,
                            strStartTime: starttime,
                            strEndTime: endtime
                        }
                    })

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

        //2015.11.02 新增日期时间段
        var startTime = Ext.util.Format.date(Ext.getCmp('beginTime').getValue(), 'Y-m-d H:i:s');
        var endTime = Ext.util.Format.date(Ext.getCmp('endTime').getValue(), 'Y-m-d H:i:s');

        //同时更新Formaturl
        var url = Statics.FormatUrl();

        store.load({
            params: {
                start: 0,
                limit: 100,
                strStartTime: startTime,
                strEndTime: endTime
            }
        })

    }

    //在这里继续写方法...

}

/**
* CStatics. 单例对象
*/
var Statics = new Lucky.CStatics();