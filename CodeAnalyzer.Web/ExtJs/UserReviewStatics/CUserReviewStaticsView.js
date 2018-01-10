/**
* Author:LuckyHu
*/
Ext.namespace("Lucky");
Lucky.CUserReviewStaticsView = function () {

    /**
    * 布局
    */
    this.GetViewPort = function () {
        var vp = new Ext.Viewport({
            layout: "border",
            items: [UserReviewStatics.getPnWest(), UserReviewStatics.GetPnCenter(), UserReviewStatics.GetPnEast()]
        });

        return vp;
    }

    //在这里继续写方法...

}

/**
* CUserReviewStaticsView 单例对象
*/
var UserReviewStaticsView = new Lucky.CUserReviewStaticsView();