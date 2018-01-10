/**
* Author:LuckyHu
*/
Ext.namespace("Lucky");
Lucky.CRoleView = function () {

    /**
    * 布局
    */
    this.GetViewPort = function () {

        var vp = new Ext.Viewport({
            layout: "border",
            items: [Role.GetGridPanel(), Role.GetDetailPanel()]
        });

        return vp;
    }

    //在这里继续写方法...

}

/**
* CRoleView 单例对象
*/
var RoleView = new Lucky.CRoleView();