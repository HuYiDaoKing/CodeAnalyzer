

//Ext.grid.DynamicGrid = Ext.extend(Ext.grid.GridPanel, {
Ext.grid.DynamicGrid = Ext.extend(Ext.grid.EditorGridPanel, {

    //缺省构造参数
    border: false,
    autoScroll: true,
    columnLine: true,
    trackMouserOver: true,
    stripRows: true,
    loadMask: true,
    plugins: [],

    //自定义属性
    urlParams: null,
    group: false,
    enablefilter: false,
    editable: true,
    smCheckBox: true,
    rowCounter: true,
    privileges: true,
    s_sm: null,
    groupField: null,
    useFilters: true, //使用过滤器
    useActionColumn: false, //使用操作列,
    addAction: null,
    editAction: null,
    deleteAction: null,

    //初始化组件
    initComponent: function () {

        //是否启用操作列
        this.useActionColumn = this.use_ActionColumn;

        //接受函数
        //this.addAction = function () { Ext.Msg.alert('提示', '你好!'); }
        this.addAction = this.add_Action;

        //checkBox属性
        this.s_sm = this.sm;

        //配置缺省表达式
        //1.一般模式
        this.cm = new Ext.grid.ColumnModel([{ header: '', dataIndex: ''}]);

        //2.列锁定模式
        //this.cm = new Ext.ux.grid.LockingColumnModel([{ header: '', dataIndex: '' }]);

        //创建store
        //GroupingStore
        var ds = new Ext.data.Store({
            url: this.storeUrl,
            reader: new Ext.data.JsonReader
        });
        ds.load();

        //设置默认配置
        var config = {
            viewConfig: {
                //forceFit: true
                scrollOffset: 0, //不加这个的话,会在grid的最右边有个空白,留作滚动条的位置
                enableRowBody: true,
                showPreview: true, //初始显示预览效果,这个是自定义的属性  
                getRowClass: function (record, rowIndex, p, ds) {//为Grid行添加颜色

                    //todo:缺少为每种类型配置一种颜色表示  
                    //暂时空着备用
                    var strCaseState = record.get(CASE_STATE);

                    var cls = 'white-row';

                    if (strCaseState == "False") {
                        cls = 'green-row';
                        return cls;
                    }
                    else {
                        cls = 'yellow-row';
                        return cls;
                    }
                }
            },
            enableColLock: true,
            loadMask: true,
            border: true,
            stripeRows: true,
            ds: ds,
            columns: []
        };

        //给分页PagingToolbar绑定store
        this.bbar.bindStore(ds, true);

        //添加新的属性或者覆盖缺省函数
        Ext.apply(this, config);
        Ext.apply(this.initialConfig, config);

        //Ext.Ajax.timeout = 180000; //3分钟超时 


        //是否使用过滤器
        //2013.07.12 暂时不使用过滤器
        /*if (this.useFilters) {

        this.filter = new Ext.ux.grid.GridFilters({ local: true, filters: [] });

        if (null == this.plugins)
        this.plugins = [];

        this.plugins.push(this.filter);
        }*/

        //调用父类构造函数(必须)
        Ext.grid.DynamicGrid.superclass.initComponent.apply(this, arguments);

        this.on('headerclick', this.onHeaderClick, this);
        this.on('headerdbclick', this.onheaderDbClick, this);
    },
    onRender: function (ct, position) {

        this.colModel.defaultSortable = true;

        //设置ajax超时时间900s(15mim)
        Ext.Ajax.timeout = 900000;

        Ext.grid.DynamicGrid.superclass.onRender.call(this, ct, position);

        this.el.mask('Loading...');

        //2015.11.02 增加参数
        this.store.on('beforeload', function (store, options) {
            //var new_params = { name: Ext.getCmp('search').getValue() };
            //Ext.apply(store.proxy.extraParams, new_params);
            //关键字
            var strkeyWord = '';
            if (Ext.getCmp('keyWord') != undefined && Ext.getCmp('keyWord').getValue() != '') {
                strkeyWord = Ext.getCmp('keyWord').getValue();
            }

            //SVN库名
            var strCodeRepositoryName = '';
            if (Ext.getCmp('Svn') != undefined && Ext.getCmp('Svn').getValue() != '') {
                strCodeRepositoryName = Ext.getCmp('Svn').getRawValue();
            }

            //过滤时间段
            var strStartTime = '';
            if (Ext.getCmp('beginTime') != undefined && Ext.getCmp('beginTime').getValue() != '') {
                strStartTime = Ext.util.Format.date(Ext.getCmp('beginTime').getValue(), 'Y-m-d');
            }
            var strEndTime = '';
            if (Ext.getCmp('endTime') != undefined && Ext.getCmp('endTime').getValue() != '') {
                strEndTime = Ext.util.Format.date(Ext.getCmp('endTime').getValue(), 'Y-m-d');
            }

            //状态
            var strStatus = '';
            if (Ext.getCmp('Status') != undefined && Ext.getCmp('Status').getValue() != '') {
                strStatus = Ext.getCmp('Status').getValue();
            }

            //路径
            var strPath = '';
            if (Ext.getCmp('dynamicView') != undefined) {
                var selections = Ext.getCmp('dynamicView').getSelectedRecords();
                if (selections[0] != null)
                    strPath = selections[0].data.Path;
            }

            Ext.apply(store.baseParams, { strKeyWord: strkeyWord, strCodeRepositoryName: strCodeRepositoryName, strStartTime: strStartTime, strEndTime: strEndTime, status: strStatus, strPath: strPath });
        });

        this.store.on('load', function (s, records) {

            if (typeof (this.store.reader.jsonData.columns) === 'object') {

                //var testStore = this.store.reader.jsonData;
                var columns = [];

                if (this.rowNumberer) {
                    columns.push(new Ext.grid.RowNumberer());
                }

                //是否使用列计数器
                if (this.rowCounter) {

                    this.rm = new Ext.grid.RowNumberer({ width: 40 });
                    columns.push(this.rm);
                }

                //是否使用checkBox选择器
                /*if (this.checkboxSelModel) {

                columns.push(this.s_sm);
                }*/

                if (this.smCheckBox) {
                    //this.s_sm.sortLock();
                    columns.push(this.s_sm);
                }
                else
                    this.sm = new Ext.grid.RowSelectionMode({ singleSelect: true });

                //处理Grid Store
                Ext.each(this.store.reader.jsonData.columns,
                function (column) {

                    //设置单元样式
                    function Addsytle(value, record, store) {

                        var data = store.data;

                        /*if (data[CASE_STATE] == 'True')
                        return '<div style="width:850px;height:25px;"><del style="color:gray;">' + value + '</del></div>';
                        else
                        return '<div style="width:850px;height:50px;margin: 0 auto;">' + value + '</del></div>';*/
                        return '<span ext:qtip="' + value + '">' + value + '</span>';
                    }

                    //1初始化文本编辑器
                    var editor = new Ext.form.TextArea({ allowBlank: true });

                    //初始化列宽
                    var iWidth = 150;

                    //2.根据该列是否有有效数据判断是否显示该列，隐藏指定字段
                    var b_Hidden = false;

                    //1.1 有条件的配置部分字段不可编辑
                    if (column.header == 'ID') {
                        editor = null;
                    }

                    if (column.header == '路径') {
                        //iWidth = 450;
                        b_Hidden = true;
                    }

                    if (column.header == '提交描述') {
                        iWidth = 400;
                    }

                    //2.1 潜规则:所有包含ID列都被隐藏
                    if (Helper.isStrContains(column.header, 'ID', true)) {
                        //隐藏并禁用修改
                        b_Hidden = true;
                    }

                    //2.2 遍历store-records

                    //2.2.1 筛选字段值全为空的列
                    //声明一变量用于存放字段值的集合
                    var arrFieldsValue = "";
                    if (typeof (Ext.getCmp(ID_DY_GRID_PANEL).store.reader.jsonData.records) == 'object') {
                        //if (typeof (records) == 'object') {
                        Ext.each(Ext.getCmp(ID_DY_GRID_PANEL).store.reader.jsonData.records, function (record) {
                            //Ext.each(records, function (record) {
                            var strField = column.dataIndex;
                            arrFieldsValue += record[strField];

                        });
                    }

                    //2.2.2 当前字段的所有值的列均为空时，设置隐藏
                    if (arrFieldsValue == "")
                        b_Hidden = true;

                    //3.Grid配置
                    columns.push({
                        id: column.header.replace(/\s+/g, '-'),
                        header: column.header,
                        dataIndex: column.dataIndex,
                        width: iWidth,
                        editor: null,
                        hidden: b_Hidden,
                        renderer: Addsytle, //添加颜色或样式
                        tooltip: column.header,
                        sortable: true
                    });
                });

                //2015.08.31 添加操作列
                var operationColumn = {
                    header: '操作',
                    tooltip: '操作',
                    xtype: 'actioncolumn', //操作列 
                    width: 100,
                    items: [{
                        //icon: 'icon-edit', // 编辑图片地址
                        icon: '../../Scripts/ExtJs/ext-3.4.0/resources/images/user/edit_1.png',
                        //iconCls: 'icon-edit',
                        tooltip: '编辑',   //鼠标over显示的文字 使用此功能,必须 Ext.tip.QuickTipManager.init();
                        handler: function (grid, rowIndex, colIndex) {
                            var rec = grid.getStore().getAt(rowIndex);
                            //alert("Edit " + rec.get('framework'));
                            //Ext.Msg.alert("提示", "修改 " + rec.get('Name'));
                            if (this.addAction == null || this.addAction == undefined) {
                                Ext.Msg.alert("提示", '建设中...');
                            } else {
                                this.addAction();
                            }
                        }
                    }, '-', {
                        //icon: 'icon-delete',
                        icon: '../../Scripts/ExtJs/ext-3.4.0/resources/images/user/delete_1.png',
                        //iconCls: 'icon-delete',
                        tooltip: '删除',
                        handler: function (grid, rowIndex, colIndex) {
                            var rec = grid.getStore().getAt(rowIndex);
                            if (this.deleteAction == null || this.deleteAction == undefined) {
                                Ext.Msg.alert("提示", '建设中...');
                            } else {
                                this.deleteAction();
                            }
                        }
                    }],
                    scope: this
                }
                if (this.useActionColumn)
                    columns.push(operationColumn);

                this.getColumnModel().setConfig(columns);
            }

            this.el.unmask();
        }, this);

        this.store.load();
    },

    //////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////Events/////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////
    refresh: function () {

        //重新加载数据
        this.getStore().reload();
    },
    reload: function (storeUrl) {

        //从后台重新载入store
        this.getStore().proxy = new Ext.data.HttpProxy({
            //method :'get',get模式下提交不了页面的参数  
            method: 'POST',
            url: storeUrl
        });

        //2013.07.12 暂时不使用过滤器
        this.getStore().reload({ callback: this.doReconfigFilter, scope: this });
        //this.getStore().reload();
    },
    doReconfigFilter: function () {

        //2015.09.23注释
        /*if (this.useFilters)
        this.filter.addFilters(this.getFilterCfg(this.store));*/
    },
    //初始化过滤器配置
    getFilterCfg: function (store) {

        var filterCfg = [];
        var columnConfig = store.reader.jsonData.columns;
        for (var i = 0; i < columnConfig.length; i++) {

            var jsonColumnCfg = columnConfig[i];

            //1.定义初始值
            var type = jsonColumnCfg.filterType;
            if (Helper.IsNullOrEmpty(type))
                continue;

            //2.如果一列中不重复数据个数小于10，则使用list过滤器，只适用于数据类型是sting的列
            var options = undefined;
            var data = store.collect(jsonColumnCfg.dataIndex, false, true);
            if (type == 'list')
                options = data;

            //3. 初始化列配置信息
            filterCfg.push({

                type: type,
                dataIndex: jsonColumnCfg.dataIndex,
                options: options
            });
        }
        return filterCfg;
    },
    clearFilter: function () {
        this.filter.clearFilters();
    },
    onheaderClick: function () {

        //屏蔽单击表头的事件
        return false;
    },
    onHeaderDbClick: function (grid, colIndex) {

        var oDiv = Ext.Dom.Helper.insertAfter(grid.getE1(),
        {
            tag: 'div', style: 'width:atuo', visiablity: hidden,
            flag: 'left',
            align: 'left'
        });

        //获取被电击的列名
        var strText = this.colModel.getColumHeader(colIndex);

        //获取这一列下的所有数据
        var data = this.store.collect(strText);
        data.push(strText);

        //得到最长的字符串
        strText = this.findItemofMaxLength(data);

        //用最长字符串去计算列宽
        oDiv.innerHTML = strText;
        if (oDiv.clientWidth > 0) {
            this.colModel.setColumnWidth(colIndex, oDiv.clientWidth + 15);
        }
    }
});
