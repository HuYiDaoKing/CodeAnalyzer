/**
* Author:LuckyHu
*/
Ext.namespace("Lucky");
Lucky.CRole = function () {

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
        var url = '/Role/GetGridData?strUserId=' + strDomainId;

        //关键字
        if (Ext.getCmp('keyWord') != undefined && Ext.getCmp('keyWord').getValue() != '') {

            strkeyWord = Ext.getCmp('keyWord').getValue();
            url += "&strKeyWord=" + escape(strkeyWord);
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
        });

        var oContextmenu = new Ext.menu.Menu({
            id: 'theContextMenu',
            items: [{
                text: '删除',
                //iconCls: 'icon-delete',
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
            //grid.getSelectionModel().selectRow(rowIndex);
            oContextmenu.showAt(e.getXY());
        });

        //20140925 增加查看明细功能
        this.oDynamicGrid.on("rowclick", function (grid, rowIndex) {
            var selectionModel = grid.getSelectionModel();
            var record = selectionModel.getSelected();

            var strDetail = '<div style="position:absolute;top: 20%;font-size:15px">';
            strDetail += '<p>【名称】:<b style="color:green">'
            strDetail += record.get('Name');
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
                icon: '../../../Scripts/ExtJs/ext-3.4.0/resources/images/user/arrow_refresh_small.png',
                handler: function () {

                    Role.refreshStore();
                }
            }, {
                text: "添加",
                tooltip: '添加',
                hidden: false,
                icon: '../../../Scripts/ExtJs/ext-3.4.0/resources/images/user/add_1.png',
                handler: function () {
                    Role.winAddRecord();
                }
            }, '->', this.GetKeyWord(), {
                xtype: 'button',
                anchor: '60%',
                height: "50px",
                text: '搜索',
                icon: '../../../Scripts/ExtJs/ext-3.4.0/resources/images/user/search.png',
                handler: function () {
                    var strUrl = Field.FormatUrl();
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
    * 增加
    */
    //--------------------start

    this.GetForm = function () {

        var form = new Ext.form.FormPanel({
            width: 400,
            height: 150,
            frame: true,
            maxinizable: false,
            items: [{
                name: "name",
                id: "name",
                fieldLabel: "<font color=red>*</font> 角色名称",
                xtype: "textfield",
                emptyText: "请输入角色名称,名称长度不能超过50！",
                anchor: "96%",
                allowBlank: false
            }]
        });

        return form;
    }

    /**
    * 添加角色
    */
    this.winAddRecord = function () {

        var win = new Ext.Window({
            title: '添加角色',
            width: 400,
            height: 150,
            maximizable: false,
            maskDisabled: true,
            modal: true,
            bodyStyle: 'background-color:#fff',
            items: [Role.GetForm()],
            buttonAlign: 'center',
            buttons: [
            {
                text: '确定',
                handler: function () {//点击时触发的事件

                    var strName = Ext.getCmp('name').getValue();

                    //2014.04.01 表单验证
                    if (Helper.IsNullOrEmpty(Helper.Trim(strName))) {
                        Ext.Msg.alert('提示', '名称不能为空!');
                        return;
                    }
                    if (strName.length > 50) {
                        Ext.Msg.alert("提示", '名称长度不能超过50!');
                        return;
                    }

                    win.close();

                    function AjaxSuccess(response, options) {

                        var oRes = Ext.util.JSON.decode(response.responseText);

                        Ext.Msg.alert("提示", oRes.Notice);

                        Role.refreshStore();
                    }

                    Helper.Ajax("/Role/Add", {
                        strName: strName,
                        strAuthor: strDomainId
                    }, AjaxSuccess, Helper.oDelegateFailure);
                }
            }, {
                text: '关闭',
                handler: function () {
                    win.close();
                }
            }]
        });

        win.show();
    };

    /**
    * 删除
    */
    this.Delete = function (strId) {

        $.ajax({
            type: 'POST',
            url: '/Role/Delete',
            data: {
                strId: strId,
                strAuthor: strDomainId
            },
            success: function (data) {

                Ext.Msg.alert("提示", data.Notice);
                Role.refreshStore();
            }
        });
    }

    //在这里继续写方法...

}

/**
* CRole. 单例对象
*/
var Role = new Lucky.CRole();