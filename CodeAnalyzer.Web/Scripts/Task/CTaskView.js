/**
* Author:LuckyHu
*/
Ext.namespace("Lucky");
Lucky.CTaskView = function () {

    /**
    * 布局
    */
    this.GetViewPort = function () {

        /*var pnCenter = new Ext.TabPanel({
            region: 'center',
            id: 'pnCenter',
            frame: true,
            activeTab: 0
        });

        //添加GridPanel到Tab
        pnCenter.add({
            title: '任务管理',
            layout: 'fit',
            closable: true, //是否可关闭
            autoScroll: false,
            frame: true,
            border: false,
            activeTab: 0,
            items: [Task.GetGridPanel(pnCenter)]
        })*/;
        /*var pnCenter = new Ext.Panel({
            frame: true,
            region: 'center',
            items: [Task.GetGridPanel()]
        });*/
        var vp = new Ext.Viewport({
            layout: "border",
            //region: 'south',
            items: [Task.GetGridPanel(), Task.GetDetailPanel()]
        });

        return vp;
    }

    //在这里继续写方法...

}

/**
* CTaskView 单例对象
*/
var TaskView = new Lucky.CTaskView();