/**
* Author:LuckyHu
*/
Ext.namespace("Lucky");
Lucky.CAllStaticsView = function () {

    /**
    * 布局
    */
    this.GetViewPort = function () {

        var vp = new Ext.Viewport({
            layout: "border",
            items: [AllStatics.GetGridPanel(), AllStatics.GetDetailPanel()]
        });

        return vp;
    }

    //在这里继续写方法...

}

/**
* CAllStaticsView 单例对象
*/
var AllStaticsView = new Lucky.CAllStaticsView();