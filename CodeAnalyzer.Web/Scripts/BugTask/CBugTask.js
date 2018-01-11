/**
* Author:LuckyHu
*/
Ext.namespace("Lucky");
Lucky.CBugTask = function () {

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
            emptyText: '输入路径'
        });

        return searchTextBox;
    }

    //构造url
    this.FormatUrl = function (flag) {

        //两个条件
        var strkeyWord = '';
        var url = '/ReviewTask/GetGridData?strUserId=' + strDomainId;

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

        url += '&isBug=true';
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
            clickstoEdit: 2
        });

        var oContextmenu = new Ext.menu.Menu({
            id: 'theContextMenu',
            items: [{
                text: 'Bug修复',
                icon: '../../../Scripts/ExtJs/ext-3.4.0/resources/images/user/bug_fix.png',
                handler: function () {

                    var oRecord = Ext.getCmp(ID_DY_GRID_PANEL).getSelectionModel().getSelected();
                    var id = oRecord.get('Id');
                    $.ajax({
                        type: 'GET',
                        url: '/BugTask/BugFix',
                        data: { id: id },
                        success: function (data) {

                            Ext.Msg.alert("提示", data.Notice);
                            BugTask.refreshStore();
                        }
                    });
                }
            }, ]
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

                    BugTask.refreshStore();
                }
            }, '->', this.GetKeyWord(), {
                xtype: 'button',
                anchor: '60%',
                height: "50px",
                text: '搜索',
                icon: '../../../Scripts/ExtJs/ext-3.4.0/resources/images/user/search.png',
                handler: function () {
                    var strUrl = BugTask.FormatUrl('all');
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

    //在这里继续写方法...

}

/**
* CBugTask. 单例对象
*/
var BugTask = new Lucky.CBugTask();