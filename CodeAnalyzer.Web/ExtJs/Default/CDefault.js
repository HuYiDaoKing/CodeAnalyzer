/*
* Author:LuckyHu
* Date:2013-03-29
*/
Ext.namespace("Lucky");
Lucky.CDefault = function () {

    /**
    * 构造GridPanel
    */
    this.GetGridPanel = function () {

        var url = '/Article/GetArticleData';

        this.oDynamicGrid = new Ext.grid.DynamicGrid({
            id: ID_DY_GRID_PANEL,
            title: '文章列表',
            region: 'center',
            layout: 'fit',
            storeUrl: url,
            checkboxSelModel: true,
            sm: new Ext.grid.CheckboxSelectionModel(),
            tbar: Default.GetTbar()
        });

        var oContextmenu = new Ext.menu.Menu({
            id: 'theContextMenu',
            items: [{
                text: '修改',
                handler: function () {
                    Ext.Msg.alert("提示", "尚未实现!");
                }
            }, {
                text: '删除',
                handler: function () {
                    Ext.Msg.alert("提示", "查看详情");
                }
            }]
        });

        this.oDynamicGrid.on("rowcontextmenu", function (grid, rowIndex, e) {
            e.preventDefault();
            grid.getSelectionModel().selectRow(rowIndex);
            oContextmenu.showAt(e.getXY());
        });

        return this.oDynamicGrid;
    }

    /**
    * 获取tbar
    */
    this.GetTbar = function () {

        var tbar = new Ext.Toolbar({

            items: [{
                text: "刷新",
                handler: function () {

                    //根据id找到相应的grid
                    var store = Ext.getCmp(ID_DY_GRID_PANEL).store;
                    store.reload();
                }
            }, {
                text: "增加",
                handler: function () {
                    Default.InserArticle();
                }
            }, {
                text: "显示所有列",
                handler: function () {
                    Ext.Msg.alert("提示", "显示所有列");
                }
            }, {
                text: "导出",
                iconCls: '../../Content/images/Gray_Row.jpg',
                handler: function () {
                    Ext.Msg, alert("btn2");
                    window.location.href = "DyGrid/FileDownload";
                }
            }]
        });

        return tbar;
    }

    /**
    * 插入文章
    */
    this.InserArticle = function () {

        var strUrl = "/Article/InsertArticles";

        function AjaxSuccess(response, options) {

            //1.获取后台消息对象
            var oRet = Ext.util.JSON.decode(response.responseText);

            //2.窗口
            if (oRet == "true")
                Ext.Mag.alert("插入成功!");
        }

        Helper.Ajax(strUrl, null, AjaxSuccess, Helper.oDelegateFailure);

    }


    //在这里继续写方法...    
}

/**
* CDefault 单例对象
*/
var Default = new Lucky.CDefault();