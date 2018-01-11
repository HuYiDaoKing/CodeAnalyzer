/**
* Author:LuckyHu
*/
Ext.namespace("Lucky");
Lucky.CAdminUserView = function () {

    /**
    * 布局
    */
    this.GetViewPort = function () {

        var vp = new Ext.Viewport({
            layout: "border",
            items: [AdminUser.GetGridPanel(), AdminUser.GetDetailPanel()]
        });

        return vp;
    }

    //在这里继续写方法...

}

/**
* CAdminUserView 单例对象
*/
var AdminUserView = new Lucky.CAdminUserView();