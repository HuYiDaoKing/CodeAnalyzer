/**
* Author:LuckyHu
*/
Ext.namespace("Lucky");
Lucky.CNeedLoginReviewTaskView = function () {

    /**
    * 布局
    */
    this.GetViewPort = function () {

        var vp = new Ext.Viewport({
            layout: "border",
            items: [NeedLoginReviewTask.GetGridPanel(), NeedLoginReviewTask.GetDetailPanel()]
        });

        return vp;
    }

    //在这里继续写方法...

}

/**
* CNeedLoginReviewTaskView 单例对象
*/
var NeedLoginReviewTaskView = new Lucky.CNeedLoginReviewTaskView();