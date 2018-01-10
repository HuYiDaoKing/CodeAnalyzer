Ext.namespace("TCAMP");
TCAMP.TCAMPTreePanel = Ext.extend(Ext.tree.TreePanel, {

    //缺省构造函数
    animCollapse: false,
    animate: false,
    boder: false,
    autoScroll: true,
    layout: 'fit',
    rootVisiable: false,
    onlyCheckable: true,
    checkModel: 'cascade',

    //自定义属性
    checkbox: false,
    filterWidth: 170,
    hiddenNodes: [],
    mask: true,

    //组件初始化
    initComponent: function (config) {

        //添加新的属性或覆盖缺省参数
        Ext.apply(this, config);

        //初始化相关子控件
        //1.根据输入的strTyoe创建Loader
        this.loader = new Ext.tree.TreeLoader({
            preLoadChildren: true,
            clearOnLoad: false,
            url: this.url,
            baseAttrs: function () {
                /*if (checkbox) {
                }*/
            }
        });

        //2.创建RootNode
        this.root = new Ext.tree.AsyncTreeNode({ text: 'Root', expanded: true });
        this.stateCtrl = new Ext.state.CookieProvider();
        this.state = this.stateCtrl.get('ExplorePanelStae_' + this.id, new Array());

        //调用父类构造函数(必须)
        TCAMP.TCAMPTreePanel.superclass.initComponent.apply(this, arguments);

        //调用父类代码之后
        //如设置事件处理和渲染组件
        //定义自定义事件(如果必要)
        if (this.mask) {
            this.on('render', this.createMask, this);
        }
        this.on('expandnode', this.onExpandNode, this);
        this.on('collapsenode', this.onCollapsenode, this);
        this.on('load', function () { this.restoreState(this.root.getPath()); }, this);
    },

    ///////////////////////////////////////////////////////////////////
    ///////////////      private              /////////////////////////
    ///////////////////////////////////////////////////////////////////

    createMask: function () {

        var mask = new Ext.LoadMask(this.getEl(), this.maskConfig);
        this.on('beforeload', mask.show, mask);
        this.on('load', mask.hide, mask);
    },

    //取消所有备选结点的选择状态
    unCheckAll: function () {

        this.root.cascade(function (n) {

            //由于是异步树,没有展开过的节点没有checkBox属性
            if (n.getUI().checkBox) {
                n.getUI().checkbox.checked = false;
            }
        }, this);
    },
    saveState: function (oState) {
        this.state = oState;
        this.stateCtrl.set('ExplorePanelState_' + this.id, this.state);
    },
    restoreState: function (defaultPath) {
        if (this.state.length == 0) {
            var newState = new Array(defaultPath);
            this.saveState(newState);
            this.expandPath(defaultPath);
            return;
        }
        var state = this.state;
        for (var i = 0; i < state.length; ++i) {
            try {

                this.expandPath(state[i]);
            }
            catch (e) { }
        }
    },
    //////////////////////////////////////////////////////////
    ////////////////////////////    Public    ///////////////
    /////////////////////////////////////////////////////////

    //刷新资源树
    refresh: function () {
        this.root.reload();
    },
    resetUrl: function () {
        this.loader.url = url;
    },

    //////////////////////////////////////////////////////////
    ////////////////////////////    Event    ////////////////
    /////////////////////////////////////////////////////////
    onExpandNode: function (node) {

        if (Helper.IsNullOrEmpty(node))
            return false;

        //刷新有删除记号的结点
        node.eachChild(function (subNode) {
            if (subNode.attributes.deleted) {
                subNode.setText('<del style="color:gray;">' + subNode.Text + '</del>');
            }
        });
        var curPath = node.getPath();
        var newState = new Array();
        for (var i = 0; i < this.state.length; ++i) {
            var path = this.state[i];

            //已存在的路径集合中没有找到包含该结点的路径,则添加
            if (curPath.indexOf(path) == -1) {
                newState.push(path);
            }
            newState.push(curPath);
            this.saveState(newState);
        }
    },
    onCollapsNode: function (node) {

        if (Helper.IsNullOrEmpty(node))
            return false;

        var closePath = node.getPath();
        var newState = new Array();
        for (var i = 0; i < this.state.length; ++i) {

            var path = this.state[i];
            if (path.indexOf(closePath) == -1) {
                newState.push(path);
            }
        }
        var parentNode = node.parentNode;
        newState.push((parentNode == null ? this.pathSeparator : parentNode.getPath()));
        this.saveState(newState);
    }
});

//注册
Ext.reg('explore_panel', TCAMP.TCAMPTreePanel)