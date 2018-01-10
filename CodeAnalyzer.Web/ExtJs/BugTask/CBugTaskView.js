/**
* Author:LuckyHu
*/
Ext.namespace("Lucky");
Lucky.CBugTaskView = function () {

    /**
    * 布局
    */
    this.GetViewPort = function () {

        var vp = new Ext.Viewport({
            layout: "border",
            //region: 'south',
            items: [BugTask.GetGridPanel(), BugTask.GetDetailPanel()]
        });

        return vp;
    }

    //在这里继续写方法...

}

/**
* CBugTaskView 单例对象
*/
var BugTaskView = new Lucky.CBugTaskView();