/**
* Author:LuckyHu
*/
Ext.namespace("Lucky");
Lucky.CAdminUser = function () {

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
        var url = '/AdminUser/GetGridData?strUserId=' + strDomainId;

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
            use_ActionColumn:false,
            add_Action:AdminUser.AddEvent,
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
                text: '邮箱修改',
                icon: '../../../Scripts/ExtJs/ext-3.4.0/resources/images/user/edit_1.png',
                handler: function () {

                    var oRecord = Ext.getCmp(ID_DY_GRID_PANEL).getSelectionModel().getSelected();
                    var strAccountId= oRecord.get('AccountId');
                    var strEmail = oRecord.get('Email');
                    AdminUser.winEmail(strAccountId,strEmail);
                }
            },{
                text: '角色修改',
                //iconCls: 'icon-edit',
                icon: '../../../Scripts/ExtJs/ext-3.4.0/resources/images/user/edit_1.png',
                handler: function () {

                    var oRecord = Ext.getCmp(ID_DY_GRID_PANEL).getSelectionModel().getSelected();
                    var strId = oRecord.get('Id');
                    AdminUser.WinUpdateRoleWindow(strId);
                }
            },{
                text: '删除',
                //iconCls: 'icon-delete',
                icon: '../../../Scripts/ExtJs/ext-3.4.0/resources/images/user/delete_1.png',
                handler: function () {
                   
                    if (!Helper.CheckValidation()) {
                        return;
                    }
                    var oRecord = Ext.getCmp(ID_DY_GRID_PANEL).getSelectionModel().getSelected();
                    var strId = oRecord.get('Id');
                    //AdminUser.WinUpdateRoleWindow(strId);
                    Ext.MessageBox.confirm('请确认', '您确定要删除？', function (btn) {

                        if (btn == 'yes') {

                          AdminUser.Delete(strId);
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

            //问题描述
            var questionnaire = "<br/>" + record.get('Questionnaire');
            var regRN = /\n/g;
            questionnaire = questionnaire.replace(regRN, "&nbsp;<br />");

            var strDetail = '<div style="position:absolute;top: 20%;font-size:15px">';
            strDetail += '<p>【用户名】:<b style="color:green">'
            strDetail += record.get('AccountId');
            strDetail += '</b></p>';
            strDetail += '<p>【邮箱】:<b style="color:green">'
            strDetail += record.get('Email');
            strDetail += '</b></p>';
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

                    AdminUser.refreshStore();
                }
            }, '->', this.GetKeyWord(), {
                xtype: 'button',
                anchor: '60%',
                height: "50px",
                text: '搜索',
                icon: '../../../Scripts/ExtJs/ext-3.4.0/resources/images/user/search.png',
                handler: function () {
                    var strUrl = AdminUser.FormatUrl();
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
    * 修改邮箱
    */
    this.winEmail = function (strAccountId, strOldEmail) {

        function UpdateRocord(strEmail) {

            //需要在data参数里，加一个traditional:true的参数，这样就能正常发送数组参数了。原因时从1.4以后，jQuery改变了参数的序列化方法。
            $.ajax({
                url: '/AdminUser/UpdateEmail',
                data: { accountId: strAccountId, strEmail: strEmail },
                type: "POST",
                success: function (response) {
                    Ext.Msg.alert("提示", response.Notice);
                    AdminUser.refreshStore();
                }
            });
        }

        function GetForm() {

            var form = new Ext.form.FormPanel({
                width: 500,
                height: 70,
                frame: true,
                maxinizable: false,
                items: [{
                    xtype: "textfield",
                    fieldLabel: "邮箱",
                    emptyText: '填写邮箱',
                    id: "Email",
                    labelSepartor: "：",
                    allowBlank: false,
                    labelWidth: 60,
                    height: 70,
                    width: 350
                }]
            });

            return form;
        }
        var win = new Ext.Window({
            title: '修改邮箱',
            width: 500,
            height: 140,
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
                    var strEmail = Ext.getCmp('Email').getValue();
                    if (Helper.IsNullOrEmpty(Helper.Trim(strEmail))) {
                        Ext.Msg.alert('提示', '不能为空!');
                        return;
                    }

                    win.close();
                    UpdateRocord(strEmail);
                }
            }, {
                text: '关闭',
                handler: function () {
                    win.close();
                }
            }]
        });

        //表单填充
        Ext.getCmp('Email').setValue(strOldEmail);
        win.show();
    }

    /**
    * 修改角色
    */
    this.WinUpdateRoleWindow = function (strId) {

        var records = this.GetRoleCheckBoxData(strId);

        var checkStore = [];
        for (var i = 0; i < records.length; i++) {

            var oRecord = records[i];

            var oCheckItem = {
                boxLabel: oRecord.Name,
                name: oRecord.Id,
                //inputValue: records[i].id,
                checked: oRecord.IsChecked
            };
            checkStore.push(oCheckItem);
        }

        var myCheckboxGroup = new Ext.form.CheckboxGroup({
            id: 'myGroup',
            xtype: 'checkboxgroup',
            itemCls: 'x-check-group-alt',
            columns: 5,
            vertical: true,
            items: checkStore
        });

        var oPanel = new Ext.Panel({
            id: 'role-view',
            frame: true,
            width: 500,
            height: 200,
            collapsible: false,
            layout: 'fit',
            //title: '角色列表',
            items: [myCheckboxGroup]
        });

        var win = new Ext.Window({
            width: 500,
            autoHeight: true,
            maximizable: false,
            maskDisabled: true,
            title: '角色修改',
            modal: true,
            layout: 'fit',
            bodyStyle: 'background-color:#fff',
            items: [oPanel],
            buttonAlign: 'center',
            buttons: [
            {
                text: '确定',
                handler: function () {

                    var arryCheckedRoles = new Array();

                    for (var i = 0; i < myCheckboxGroup.items.length; i++) {
                        if (myCheckboxGroup.items.itemAt(i).checked)
                            arryCheckedRoles.push(myCheckboxGroup.items.itemAt(i).name);
                    }

                    if (arryCheckedRoles.length == 0)
                    {
                        Ext.Msg.alert('提示', '亲,你没有选择角色!');
                        return;
                    }



                    var strCheckedRoles = Helper.GetUrlParameters(arryCheckedRoles);

                    //--------修改
                    $.ajax({
                        type: 'POST',
                        url: '/AdminUser/UpdateUserRole',
                        data: {
                            id: strId,
                            strCheckedRoles: strCheckedRoles,
                            strAuthor: strDomainId
                        },
                        success: function (data) {

                            Ext.Msg.alert("提示", data.Notice);
                            AdminUser.refreshStore();
                        }
                    });

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
    * 获取角色复选框Data
    */
    this.GetRoleCheckBoxData = function (strId) {
        var oResult;
        $.ajax({
            type: 'POST',
            url: '/Role/GetRolesData',
            data: {
                strId: strId,
                strAuthor: strDomainId
            },
            async: false,
        }).done(function (json) {
            oResult = json;
        });

        return oResult;
    }

    /**
    * 删除
    */
    this.Delete = function (strId) {

        $.ajax({
            type: 'POST',
            url: '/AdminUser/Delete',
            data: {
                id: strId,
                strAuthor: strDomainId
            },
            success: function (data) {

                Ext.Msg.alert("提示", data.Notice);
                AdminUser.refreshStore();
            }
        });
    }

    /*
    * 测试
    */
    this.AddEvent =function(){
    
    //获取单选记录
    var oRecord = Ext.getCmp(ID_DY_GRID_PANEL).getSelectionModel().getSelected();
    var strId = oRecord.get('Id');
    Ext.Msg.alert("提示", '你选的是:'+strId);
    }

    //在这里继续写方法...

}

/**
* CAdminUser. 单例对象
*/
var AdminUser = new Lucky.CAdminUser();