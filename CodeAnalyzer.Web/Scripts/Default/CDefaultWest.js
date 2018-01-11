/*
* Author:LuckyHu
* Date:2013-03-29
*/
Ext.namespace("Lucky");
Lucky.CDefaultWest = function () {

    var oTreePanel = null;

    /**
    * 获取资源树
    */
    this.CreatTreePanel = function () {

        var root = new Ext.tree.AsyncTreeNode({
            id: "root",
            text: "菜单",
            expanded: true,
            leaf: false,
            children: [
            {
                id: 1,
                text: '任务管理',
                leaf: false,
                expanded: true,
                hidden: bHiddenMid,
                children: [{
                    id: '1-1',
                    text: '任务分配',
                    url: '/PushTask/Index',
                    leaf: true
                }, {
                    id: '1-2',
                    text: 'NeedLogin特性任务分配',
                    url: '/PushTask/NeedLogin',
                    leaf: true
                }]
            }, {
                id: 2,
                text: '任务审查',
                leaf: false,
                expanded: true,
                children: [{
                    id: '2-1',
                    text: '任务审查',
                    url: '/ReviewTask/Index',
                    leaf: true
                }, {
                    id: '2-2',
                    text: 'NeedLogin任务审查',
                    url: '/ReviewDllTask/Index',
                    leaf: true
                }, {
                    id: '2-3',
                    text: 'bug任务列表',
                    url: '/BugTask/Index',
                    leaf: true
                }]
            }, {
                id: 3,
                text: '统计管理',
                leaf: false,
                expanded: true,
                hidden: bHiddenSuper,
                children: [{
                    id: '3-1',
                    text: '统计',
                    url: '/AllStatics/Index',
                    leaf: true
                }]
            }, {
                id: 4,
                text: '用户管理',
                leaf: false,
                expanded: true,
                hidden: bHiddenSuper,
                children: [{
                    id: '4-1',
                    text: '用户管理',
                    url: '/AdminUser/Index',
                    leaf: true
                }, {
                    id: '4-2',
                    text: '角色管理',
                    url: '/Role/Index',
                    leaf: true
                }]
            }]
        });

        this.oTreePanel = new Ext.tree.TreePanel({
            animate: true, //以动画形式伸展,收缩子节点  
            title: "资源管理器",
            //collapsible: true,//如果为true，panel是可收缩的，并且有一个收起/展开按钮自动被渲染到它的头部工具区域  
            rootVisible: false, //是否显示根节点  
            autoScroll: false,
            autoWidth: true,
            root: root,
            loader: new Ext.tree.TreeLoader(),
            width: 100
            //bodyStyle: 'background-color:#1E1E1E', //背景色
            //frame:false
        });

        return this.oTreePanel;
    }

    /**
    * Tree单击事件
    */
    this.TreeClick = function (pnCenter, oTreePanel) {

        //注册事件
        //绑定节点单击事件
        oTreePanel.on("click", function (node) {

            node.select;

            //为叶子结点时，点击进入链接
            //if (!node.isLeaf()) {
            var oAttributes = node.attributes;

            if (node.leaf == true) {
                var tab = pnCenter.getComponent("newtab" + node.id);

                //src路径,传递参数
                //var src = "../Article/Index?strTreeNodeID=" + node.id;
                //var src = node.attributes.url;
                var src = node.attributes.url + "?strNodeId=" + node.id;

                if (!tab) {

                    pnCenter.add({
                        title: node.attributes.text,
                        id: 'newtab' + node.id,
                        //autoHeight: true,
                        layout: 'fit',
                        closable: true, //是否可关闭
                        autoScroll: false,
                        frame: true,
                        border: false,
                        html: '<iframe id="iframe' + node.id + '" src="' + src + '" width="100%" height="100%" frameborder="0" scrolling="auto"></iframe>'//改变iframe,解决跨域问题
                    });

                    pnCenter.setActiveTab("newtab" + node.id);

                }
                else {

                    //刷新
                    var currentTab = Ext.getCmp("newtab" + node.id);

                    //1.从队列中移除当前tab
                    pnCenter.remove(currentTab);

                    //2.添加新tab
                    pnCenter.add({
                        title: node.attributes.text,
                        id: 'newtab' + node.id,
                        //autoHeight: true,
                        layout: 'fit',
                        closable: true, //是否可关闭
                        autoScroll: false,
                        frame: true,
                        html: '<iframe  id="iframe' + node.id + '" name="iframe' + node.id + '" src="' + src + '" width="100%" height="100%" frameborder="0" scrolling="auto"></iframe>'//改变iframe,解决跨域问题
                    });

                    pnCenter.setActiveTab("newtab" + node.id);
                }
            }
        });

    }

    /**
    * 获取tbar
    */
    this.GetTbar = function () {

        var tbar = new Ext.Toolbar({
            //style: tbarStyle,
            items: [{
                text: "刷新",
                //iconCls: 'icon-refresh',
                //ctCls: 'f-c',
                icon: '../../Scripts/ExtJs/ext-3.4.0/resources/images/user/arrow_refresh_small.png',
                handler: function () {

                    /*
                    var node = oTreePanel.getSelectionModel().getSelectedNode();   //tree 变量为前面定义好的treepanel变量，node为选择节点
                    if (node == null) { //没有选中 重载树   
                    oTreePanel.getRootNode().reload();
                    } else {        //重载树 并默认选中上次选择的节点     
                    var path = node.getPath('id');
                    oTreePanel.getLoader().load(oTreePanel.getRootNode(),
                    function (treeNode) {
                    oTreePanel.expandPath(path, 'id', function (bSucess, oLastNode) {
                    oTreePanel.getSelectionModel().select(oLastNode);
                    });
                    }, this);
                    }*/
                    oTreePanel.getRootNode().reload();
                }
            }]
        });

        return tbar;
    }

    //在这里继续些方法...
}

/**
* CDefaultWest 单例对象
*/
var DefaultWest = new Lucky.CDefaultWest();