/**
* Author:LuckyHu
*/
Ext.namespace("Lucky");
Lucky.CLogServiceConfigView = function () {

    /**
    * 布局
    */
    this.GetViewPort = function () {
        var vp = new Ext.Viewport({
            layout: "border",
            //region: 'south',
            items: [LogServiceConfig.GetGridPanel(), LogServiceConfig.GetDetailPanel()]
        });

        return vp;
    }

    //在这里继续写方法...

}

/**
* CLogServiceConfigView 单例对象
*/
var LogServiceConfigView = new Lucky.CLogServiceConfigView();