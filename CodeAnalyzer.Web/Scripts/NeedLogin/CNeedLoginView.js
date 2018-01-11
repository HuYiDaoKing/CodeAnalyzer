/**
* Author:LuckyHu
*/
Ext.namespace("Lucky");
Lucky.CNeedLoginView = function () {

    /**
    * 布局
    */
    this.GetViewPort = function () {

        //2016.06.06
        var oTreePanel = NeedLoginWest.CreatTreePanel();
        NeedLoginWest.TreeClick(oTreePanel);

        var vp = new Ext.Viewport({
            layout: "border",
            //region: 'south',
            items: [NeedLogin.getPnWest(oTreePanel), NeedLogin.GetGridPanel(), NeedLogin.GetDetailPanel()]
        });

        return vp;
    }

    //在这里继续写方法...

}

/**
* CNeedLoginView 单例对象
*/
var NeedLoginView = new Lucky.CNeedLoginView();