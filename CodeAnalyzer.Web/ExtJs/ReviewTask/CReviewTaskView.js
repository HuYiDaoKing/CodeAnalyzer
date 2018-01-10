/**
* Author:LuckyHu
*/
Ext.namespace("Lucky");
Lucky.CReviewTaskView = function () {

    /**
    * 布局
    */
    this.GetViewPort = function () {

        var vp = new Ext.Viewport({
            layout: "border",
            items: [ReviewTask.GetGridPanel(), ReviewTask.GetDetailPanel()]
        });

        return vp;
    }

    //在这里继续写方法...

}

/**
* CReviewTaskView 单例对象
*/
var ReviewTaskView = new Lucky.CReviewTaskView();