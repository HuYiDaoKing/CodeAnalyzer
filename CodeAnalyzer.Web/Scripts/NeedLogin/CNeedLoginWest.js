/*
* Author:LuckyHu
* Date:2016-06-06
*/
Ext.namespace("Lucky");
Lucky.CNeedLoginWest = function () {

    var oTreePanel = null;

    /**
    * 获取资源树
    */
    this.CreatTreePanel = function () {
        var loader = new Ext.tree.TreeLoader({
            url: '/PushTask/GetTreeData'
        });

        var root = new Ext.tree.AsyncTreeNode({
            id: '0',
            text: "根节点",
            leaf: false,
            loader: loader,
            expandable: true,
            expanded: true
        });
        this.oTreePanel = new Ext.tree.TreePanel({
            //id: "treeCategories",
            id: 'treeFiles',
            animate: true,
            enableDD: false,
            allowDrag: false,
            useArrows: false,
            lines: true,
            root: root,
            autoScroll: true,
            //autoWidth: true,
            rootVisible: false,
            tbar: NeedLoginWest.GetTbar(),
            width: 400,
            listeners:
                      {
                          "contextMenu": function (node, e) {
                              var myContextMenu = new Ext.menu.Menu({
                                  shadow: 'frame',
                                  items: [{
                                      iconCls: "icon-scan",
                                      text: "开始检查",
                                      hidden: true,
                                      scope: this,
                                      handler: function () {
                                          myContextMenu.hide();
                                          /*Ext.MessageBox.prompt("添加产品分类", "名称：", function (button, text) {
                                          if (button == "ok") {
                                          if (Ext.util.Format.trim(text) != "") {
                                          addCategory(node, text);
                                          }
                                          }
                                          });*/
                                          node.select;
                                          //var msg = '当前选中的是:' + node.attributes.path;

                                          Ext.Msg.confirm('Hey!', '你确认要检查吗?', function (btn, text) {
                                              if (btn == 'yes') {
                                                  Ext.Msg.alert('提示', 'Yes');
                                              } else {
                                                  Ext.Msg.alert('提示', 'No');
                                              }
                                          });

                                          NeedLogin.refreshStore();
                                      }
                                  }, {
                                      iconCls: "button-add",
                                      text: "添加",
                                      scope: this,
                                      hidden: true,
                                      handler: function () {
                                          myContextMenu.hide();
                                          Ext.MessageBox.prompt("添加产品分类", "名称：", function (button, text) {
                                              if (button == "ok") {
                                                  if (Ext.util.Format.trim(text) != "") {
                                                      addCategory(node, text);
                                                  }
                                              }
                                          });
                                      }
                                  },
                                    {
                                        iconCls: "button-edit",
                                        text: "编辑",
                                        hidden: true,
                                        handler: function () {
                                            myContextMenu.hide();
                                            Ext.MessageBox.prompt("编辑产品分类", "名称：", function (button, text) {
                                                if (button == "ok") {
                                                    if (Ext.util.Format.trim(text) != "") {
                                                        if (node.text != text) { //在修改值的情况下，请求处理
                                                            editCategory(node, text);
                                                        }
                                                    }
                                                }
                                            }, this, false, node.text);
                                        }
                                    },
                                    {
                                        iconCls: "button-delete",
                                        text: "删除",
                                        hidden: true,
                                        handler: function () {
                                            myContextMenu.hide();
                                            Ext.MessageBox.confirm("确认删除", "是否要删除指定内容？", function (button, text) {
                                                if (button == "yes") {
                                                    removeCategory(node);
                                                }
                                            });
                                        }
                                    }
                                  ]
                              });

                              if (node.parentNode == null) {    //主根目录没有编辑和删除的功能
                                  myContextMenu.items.get(1).setDisabled(true);
                                  myContextMenu.items.get(2).setDisabled(true);
                              } else {
                                  if (!node.isLeaf()) {
                                      myContextMenu.items.itemAt(2).setDisabled(true);  //如果有子目录没有删除功能，根据需求而定（也可以设置删除功能
                                  } else {
                                      //myContextMenu.items.itemAt(0).setDisabled(true);
                                  }

                                  myContextMenu.items.itemAt(1).setDisabled(false);

                              }
                              e.preventDefault();

                              node.select(); //结点进入选择状态
                              myContextMenu.showAt(e.getPoint());
                          }
                      }
        });


        return this.oTreePanel;
    }




    /**
    * Tree单击事件
    */
    this.TreeClick = function (oTreePanel) {

        //注册事件
        //绑定节点单击事件
        oTreePanel.on("click", function (node) {

            node.select;

            //为叶子结点时，点击进入链接
            //if (!node.isLeaf()) {
            var oAttributes = node.attributes;
            /*
            if (node.leaf == true) {
            var tab = pnCenter.getComponent("newtab" + node.id);

            //src路径,传递参数
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
            }*/
            //src路径,传递参数
            //var src = node.attributes.url + "?strNodeId=" + node.id;
            //Ext.Msg.alert('提示', src);
            //console.log("当前选中属性:" + oAttributes);
            var dir = oAttributes.path;
            NeedLogin.refreshStore(dir);
        });

    }

    /**
    * 获取tbar
    */
    this.GetTbar = function (oTreePanel) {

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
                    //oTreePanel.getRootNode().reload();
                    //treeFiles
                    Ext.getCmp("treeFiles").getRootNode().reload();
                }
            }]
        });

        return tbar;
    }

    //在这里继续些方法...
}

/**
* CNeedLoginWest 单例对象
*/
var NeedLoginWest = new Lucky.CNeedLoginWest();