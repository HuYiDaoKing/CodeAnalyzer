/**
* Author:LuckyHu
*/
Ext.namespace("Lucky");
Lucky.CStaticsView = function () {

    /**
    * 布局
    */
    this.GetViewPort = function () {
        /*var vp = new Ext.Viewport({
            layout: "border",
            items: [Statistics.getPnWest(), Statistics.GetPnCenter(), Statistics.GetPnEast()]
        });*/
        var vp = new Ext.Viewport({
            layout: "border",
            items: [Statics.GetGridPanel(), Statics.GetDetailPanel()]
        });

        return vp;
    }

    //在这里继续写方法...

}

/**
* CStaticsView 单例对象
*/
var StaticsView = new Lucky.CStaticsView();