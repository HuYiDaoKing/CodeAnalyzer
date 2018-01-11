/**
* Author:LuckyHu
*/
Ext.namespace("Lucky");
Lucky.CPushTaskView = function () {

    /**
    * 布局
    */
    this.GetViewPort = function () {

        var vp = new Ext.Viewport({
            layout: "border",
            //region: 'south',
            items: [PushTask.getPnWest(), PushTask.GetGridPanel(), PushTask.GetDetailPanel()]
        });

        return vp;
    }

    //在这里继续写方法...

}

/**
* CPushTaskView 单例对象
*/
var PushTaskView = new Lucky.CPushTaskView();