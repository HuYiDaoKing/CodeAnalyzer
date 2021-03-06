﻿/**
* Author:LuckyHu
*/
Ext.namespace("Lucky");
Lucky.CLogServiceConfig = function () {

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

        var url = '/LogServiceConfig/GetGridData';

        //关键字
        if (Ext.getCmp('keyWord') != undefined && Ext.getCmp('keyWord').getValue() != '') {

            strkeyWord = Ext.getCmp('keyWord').getValue();
            url += "?strKeyWord=" + escape(strkeyWord);

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
            region: 'center',//
            layout: 'fit',
            storeUrl: this.FormatUrl(),
            checkboxSelModel: true,
            sm: sm,
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

        //20140925 增加查看明细功能
        this.oDynamicGrid.on("rowclick", function (grid, rowIndex) {
            var selectionModel = grid.getSelectionModel();
            var record = selectionModel.getSelected();

            var strDetail = '<div style="position:absolute;top: 20%;font-size:15px">';
            strDetail += '<p>【名称】:<b style="color:green">'
            strDetail += record.get('ConfigType');
            strDetail += '</b></p>';
            strDetail += '<p>【值】:<b style="color:green">'
            strDetail += record.get('ConfigValue');
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
            collapsible: true,
            title: '任务详情',
            region: 'south',
            width: '100%',
            height: 120,
            items: []
        });

        return detailPanel;
    }

    //获取tbar
    this.GetTbar = function () {

        var tbar = new Ext.Toolbar({
            items: [{
                text: "刷新",
                icon: '../../../Scripts/ExtJs/ext-3.4.0/resources/images/user/arrow_refresh_small.png',
                handler: function () {

                    LogServiceConfig.refreshStore();
                }
            }, {
                text: "增加",
                hidden: false,
                icon: '../../Scripts/ExtJs/ext-3.4.0/resources/images/user/add.png',
                handler: function () {
                    LogServiceConfig.winAddRecord();
                }
            }, {
                text: "编辑",
                icon: '../../Scripts/ExtJs/ext-3.4.0/resources/images/user/application_edit.png',
                handler: function () {
                    var oRecord = Ext.getCmp(ID_DY_GRID_PANEL).getSelectionModel().getSelected();
                    if (oRecord == undefined) {
                        Ext.Msg.alert("提示", "您没有选择任何记录!");
                        return;
                    }

                    var strId = oRecord.get('Id');
                    var strConfigType = oRecord.get('ConfigType');
                    var strConfigValue = oRecord.get('ConfigValue');
                    LogServiceConfig.winUpdateRecord(strId, strConfigType, strConfigValue);
                }
            }, {
                text: '删除',
                iconCls: 'icon-delete',
                handler: function () {

                    var oRecord = Ext.getCmp(ID_DY_GRID_PANEL).getSelectionModel().getSelected();
                    if (oRecord == undefined) {
                        Ext.Msg.alert("提示", "您没有选择任何记录!");
                        return;
                    }

                    var strId = oRecord.get('Id');
                    Ext.MessageBox.confirm('请确认', '您确定要删除？', function (btn) {

                        if (btn == 'yes') {

                            LogServiceConfig.Delete(strId);
                        }
                    });
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
            url: '/LogServiceConfig/Delete',
            data: { strId: strId },
            success: function (data) {

                Ext.Msg.alert("提示", data.Notice);
                LogServiceConfig.refreshStore();
            }
        });
    }

    /**
    * 刷新
    */
    this.refreshStore = function () {

        //根据id找到相应的grid
        var store = Ext.getCmp(ID_DY_GRID_PANEL).store;

        store.reload();
    }

    this.GetForm = function () {

        var form = new Ext.form.FormPanel({
            width: 400,
            height: 300,
            frame: true,
            maxinizable: false,
            items: [{
                xtype: "fieldset",
                title: "<b style='color: #F00'>必填信息</b>",
                defaultType: "textfield",
                width: 380,
                height: 300,
                items: [{
                    name: "ConfigType",
                    id: "ConfigType",
                    fieldLabel: "<font color=red>*</font> 名称",
                    xtype: "textfield",
                    emptyText: "请输入名称,名称长度不能超过50！",
                    anchor: "96%",
                    allowBlank: false
                }, {
                    name: "ConfigValue",
                    id: "ConfigValue",
                    fieldLabel: "<font color=red>*</font> 值",
                    xtype: "textfield",
                    emptyText: "0=关闭,1=开启",
                    anchor: "96%",
                    allowBlank: false
                }]
            }]
        });

        return form;
    }

    /**
    * 添加
    */
    this.winAddRecord = function () {

        var win = new Ext.Window({
            title: '添加任务',
            width: 400,
            height: 220,
            maximizable: false,
            maskDisabled: true,
            modal: true,
            bodyStyle: 'background-color:#fff',
            items: [LogServiceConfig.GetForm()],
            buttonAlign: 'center',
            buttons: [
            {
                text: '确定',
                handler: function () {

                    var strConfigType = Ext.getCmp('ConfigType').getValue();

                    if (Helper.IsNullOrEmpty(Helper.Trim(strConfigType))) {
                        Ext.Msg.alert('提示', '名称不能为空!');
                        return;
                    }

                    var strConfigValue = Ext.getCmp('ConfigValue').getValue();

                    if (Helper.IsNullOrEmpty(Helper.Trim(strConfigValue))) {
                        Ext.Msg.alert('提示', '值不能为空!');
                        return;
                    }

                    win.close();
                    LogServiceConfig.AddRecord(strConfigType, strConfigValue);
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
    * 修改角色
    */
    this.winUpdateRecord = function (strId, strOldConfigType, strOldConfigValue) {

        var win = new Ext.Window({
            title: '修改任务',
            width: 400,
            height: 220,
            maximizable: false,
            maskDisabled: true,
            modal: true,
            bodyStyle: 'background-color:#fff',
            items: [LogServiceConfig.GetForm()],
            buttonAlign: 'center',
            buttons: [
            {
                text: '确定',
                handler: function () {

                    var strConfigType = Ext.getCmp('ConfigType').getValue();

                    if (Helper.IsNullOrEmpty(Helper.Trim(strConfigType))) {
                        Ext.Msg.alert('提示', '名称不能为空!');
                        return;
                    }

                    var strConfigValue = Ext.getCmp('ConfigValue').getValue();

                    if (Helper.IsNullOrEmpty(Helper.Trim(strConfigValue))) {
                        Ext.Msg.alert('提示', '值不能为空!');
                        return;
                    }

                    win.close();
                    LogServiceConfig.UpdateRocord(strId, strConfigType, strConfigValue);
                }
            }, {
                text: '关闭',
                handler: function () {
                    win.close();
                }
            }]
        });

        //表单填充
        Ext.getCmp('ConfigType').setValue(strOldConfigType);
        Ext.getCmp('ConfigValue').setValue(strOldConfigValue);
        win.show();
    }

    /**
    * 添加
    */
    this.AddRecord = function (strConfigType, strConfigValue) {

        var strUrl = "/LogServiceConfig/Add";

        function AjaxSuccess(response, options) {

            var oRes = Ext.util.JSON.decode(response.responseText);

            Ext.Msg.alert("提示", oRes.Notice);

            Task.refreshStore();
        }

        Helper.Ajax(strUrl, {
            configtype: strConfigType,
            configvalue: strConfigValue,
        }, AjaxSuccess, Helper.oDelegateFailure);
    }

    /**
    * 修改
    */
    this.UpdateRocord = function (strId, strConfigType, strConfigValue) {

        var strUrl = "/LogServiceConfig/Update";

        function AjaxSuccess(response, options) {

            var oRes = Ext.util.JSON.decode(response.responseText);

            Ext.Msg.alert("提示", oRes.Notice);

            Task.refreshStore();
        }

        Helper.Ajax(strUrl, {
            id: strId,
            configtype: strConfigType,
            configvalue: strConfigValue
        }, AjaxSuccess, Helper.oDelegateFailure);
    }

    //在这里继续写方法...

}

/**
* CLogServiceConfig 单例对象
*/
var LogServiceConfig = new Lucky.CLogServiceConfig();