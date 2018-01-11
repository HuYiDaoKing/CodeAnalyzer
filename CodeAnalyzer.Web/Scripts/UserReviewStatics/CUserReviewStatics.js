/**
* Author:LuckyHu
*/
Ext.namespace("Lucky");
Lucky.CUserReviewStatics = function () {

    //formaturl
    //构造url
    this.FormatUrl = function () {

        //两个条件
        var strkeyWord = '';
        //2015.11.25 特别说明
        //这里的UserId两种可能:1.登录用户的ID 2.审核人账号(统计页面使用)
        //var url = '/ReviewTask/GetGridData?strUserId=' + strDomainId;
        //var url = '/ReviewTask/GetGridData?strUserId=' + senderId;
        var url = '/UserReviewStatics/GetGridData?strUserId=' + senderId;//2015.11.26独立处理

        //关键字
        if (Ext.getCmp('keyWord') != undefined && Ext.getCmp('keyWord').getValue() != '') {
            strkeyWord = Ext.getCmp('keyWord').getValue();
            url += "&strKeyWord=" + escape(strkeyWord);
        }

        //2015.11.25 废除该查询条件 svn库名
        /*if (Ext.getCmp('Svn') != undefined && Ext.getCmp('Svn').getValue() != '') {
            var strCodeRepositoryName = Ext.getCmp('Svn').getValue();
            url += '&strCodeRepositoryName=' + strCodeRepositoryName;
        }*/

        //状态
        if (Ext.getCmp('Status') != undefined) {
            var status = -2; //全部
            if (Ext.getCmp('Status').getValue() != '') {
                status = Ext.getCmp('Status').getValue();
            }

            url += '&status=' + status;
        } else {
            url += '&status=-2';
        }
        return url;
    }

    //pnWest
    this.getPnWest = function () {
        var pieChart = function () {

            var store = new Ext.data.JsonStore({
                fields: ['season', 'total'],
                // 获取Json数据的URL  
                url: "/UserReviewStatics/GetPieData?senderId="+senderId,
                // 设置自动获取  
                autoLoad: true,
                root: "dataList"
            });

            var pie = new Ext.Panel({
                width: 300,
                height: 300,
                title: '任务状态统计图',
                items: {
                    store: store,
                    xtype: 'piechart',
                    dataField: 'total',
                    categoryField: 'season',
                    listeners: {
                        itemclick: function (o) {
                            var rec = store.getAt(o.index);
                            //Ext.Msg.alert('提示', rec.data.season);
                        }
                    },
                    extraStyle: {
                        legend:
                    {
                        display: 'bottom',
                        padding: 5,
                        font:
                      {
                          family: 'Tahoma',
                          size: 13
                      }
                    }
                    }
                }
            });

            return pie;
        }

        //Bug/非Bug数量
        var pieChart2=function () {

            var store = new Ext.data.JsonStore({
                fields: ['season', 'total'],
                // 获取Json数据的URL  
                url: "/UserReviewStatics/GetPieBugData?senderId="+senderId,
                // 设置自动获取  
                autoLoad: true,
                root: "dataList"
            });

            var pie = new Ext.Panel({
                width: 300,
                height: 300,
                title: '任务Bug统计图',
                items: {
                    store: store,
                    xtype: 'piechart',
                    dataField: 'total',
                    categoryField: 'season',
                    listeners: {
                        itemclick: function (o) {
                            var rec = store.getAt(o.index);
                            //Ext.Msg.alert('提示', rec.data.season);
                        }
                    },
                    extraStyle: {
                        legend:
                    {
                        display: 'bottom',
                        padding: 5,
                        font:
                      {
                          family: 'Tahoma',
                          size: 13
                      }
                    }
                    }
                }
            });

            return pie;
        }

        var pnWest = new Ext.Panel({
            id: "pnWest",
             plain: true,  
            layout: 'column',  
            width: 300,
            height: 'auto',
            //split: true, //显示分隔条
            region: 'west',
            collapsible: true,
            items: [pieChart(),pieChart2()]
        });

        return pnWest;
    }

    //pnCenter
    this.GetPnCenter = function () {

        var GetKeyWord = function () {

            //搜索框
            var searchTextBox = new Ext.form.TextField({
                id: 'keyWord',
                xtype: 'textfield',
                fieldLabel: '关键词',
                name: 'keyWord',
                anchor: '60%',
                height: "50px",
                emptyText: '输入路径名称'
            });

            return searchTextBox;
        }

        //工具
        var GetTbar = function () {

            //svn下拉列表数据
            var store = new Ext.data.Store({

                proxy: new Ext.data.HttpProxy({ url: '/PushTask/GetSvnComboStore' }),

                reader: new Ext.data.JsonReader({ root: 'data' },
              [{ name: 'id' }, { name: 'name'}])
            });

            var statuscombo = new Ext.data.Store({

                proxy: new Ext.data.HttpProxy({ url: '/UserReviewStatics/GetStatusStore' }),

                reader: new Ext.data.JsonReader({ root: 'data' },
              [{ name: 'id' }, { name: 'name'}])
            });

            var tbar = new Ext.Toolbar({
                items: [{
                    text: "刷新",
                    icon: '../../../Scripts/ExtJs/ext-3.4.0/resources/images/user/arrow_refresh_small.png',
                    handler: function () {

                        UserReviewStatics.refreshStore();
                    }
                },/*{
                    text: "所有",
                    icon: '../../../Scripts/ExtJs/ext-3.4.0/resources/images/user/all-files.png',
                    handler: function () {

                        //Statistics.refreshStore();
                        UserReviewStatics.All();
                    }
                },*//* {
                    name: "Svn",
                    id: "Svn",
                    xtype: "combo",
                    anchor: "96%",
                    allowBlank: false,
                    store: store,
                    displayField: 'name',
                    valueField: 'id',
                    hiddenName: 'name',
                    triggerAction: 'all',
                    emptyText: '请选择svn库...',
                    allowBlank: false,
                    blankText: '请选择svn库',
                    editable: false,
                    selectOnFocus: true,
                    mode: 'local',
                    listeners: {
                        'render': function () {
                            store.load();
                        }
                    }
                },*/ {
                    name: "状态",
                    id: "Status",
                    xtype: "combo",
                    anchor: "96%",
                    allowBlank: false,
                    store: statuscombo,
                    displayField: 'name',
                    valueField: 'id',
                    hiddenName: 'name',
                    triggerAction: 'all',
                    emptyText: '请选择状态...',
                    allowBlank: false,
                    blankText: '请选择状态',
                    editable: false,
                    selectOnFocus: true,
                    mode: 'local',
                    listeners: {
                        'render': function () {
                            statuscombo.load();
                        }
                    }
                }, '->', GetKeyWord(), {
                    xtype: 'button',
                    anchor: '60%',
                    height: "50px",
                    text: '搜索',
                    icon: '../../../Scripts/ExtJs/ext-3.4.0/resources/images/user/search.png',
                    handler: function () {
                        var strUrl = UserReviewStatics.FormatUrl();
                        var oGrid = Ext.getCmp(ID_DY_GRID_PANEL);
                        oGrid.reload(strUrl);
                    }
                }]
            });

            return tbar;
        };

        var GetGridPanel = function () {

            //定义checkbox列模型
            //1.一般模式
            var sm = new Ext.grid.CheckboxSelectionModel();

            this.oDynamicGrid = new Ext.grid.DynamicGrid({
                id: ID_DY_GRID_PANEL,
                height: 700,
                autoWidth: true,
                region: 'center',
                layout: 'fit',
                storeUrl: UserReviewStatics.FormatUrl(),
                checkboxSelModel: true,
                sm: sm,
                use_ActionColumn: false,
                tbar: GetTbar(),
                bbar: new Ext.PagingToolbar({
                    pageSize: 20,
                    displayInfo: true,
                    displayMsg: '显示第{0}到{1}条数据,共{2}条',
                    emptyMsg: "没有数据",
                    beforePageText: "第",
                    afterPageText: '页 共{0}页'
                }),
                clickstoEdit: 2
            });

            //20140925 增加查看明细功能
            this.oDynamicGrid.on("rowclick", function (grid, rowIndex) {
                var selectionModel = grid.getSelectionModel();
                var record = selectionModel.getSelected();

                var source = {
                    SVN库: record.get('CodeRepositoryName'),
                    文件名:record.get('Name'),
                    路径:record.get('FilePath'),
                    任务分配者:record.get('SenderId'),
                    代码提交人:record.get('SubmitAuthor'),
                    提交描述:record.get('SubmitMessage'),
                    代码提交时间:record.get('SubmitTime'),
                    审查人:record.get('Checker'),
                    是否有BUG:record.get('IsBug'),
                    挂起原因:record.get('PendingReason'),
                    问题单:record.get('Questionnaire'),
                    任务接收时间:record.get('ReceiveTime'),
                    任务完成时间:record.get('EndTime'),
                    状态:record.get('Status'),
                };
                Ext.getCmp("propsGrid").setSource(source);

            });

            //添加自定义参数
            Ext.apply(this.oDynamicGrid.store.baseParams, { strCodeRepositoryName: '' });
            return this.oDynamicGrid;
        }

        //center-south
        var detailPanel = new Ext.Panel({
            id: 'detailPanel',
            collapsible: true,
            title: '任务详情',
            region: 'west',
            width: '100%',
            height: 300,
            items: []
        });


        var pnCenter = new Ext.Panel({
            region: 'center',
            layout: 'fit',
            //items: [GetGridPanel(), detailPanel]
            items: [GetGridPanel()]
        });

        return pnCenter;
    }

    //pnEast
    this.GetPnEast = function () {

        //增加属性面板
        var propsGrid = new Ext.grid.PropertyGrid({
            //renderTo: 'prop-grid',
            id: 'propsGrid',
            title: '评审文件明细',
            width: 300,
            //autoHeight: true,
            propertyNames: {
                tested: 'QA',
                borderWidth: 'Border Width'
            },
            source: {},
            viewConfig: {
                forceFit: true,
                scrollOffset: 2 // the grid will never have scrollbars
            }
        });

        var pnEast = new Ext.Panel({
            id: "pnEast",
            layout: 'fit',
            width: 300,
            //height: 'auto',
            split: true, //显示分隔条
            region: 'east',
            collapsible: true,
            items: [propsGrid]
        });

        return pnEast;
    }

    /**
    * 刷新
    */
    this.refreshStore = function () {

        //根据id找到相应的grid
        var store = Ext.getCmp(ID_DY_GRID_PANEL).store;
        //var strCodeRepositoryName = Ext.getCmp('Svn').getRawValue();
        //var strStatus = Ext.getCmp('Status').getRawValue();
        var strStatus = Ext.getCmp('Status').getValue();
        //var strKeyWord = Ext.getCmp('keyWord').getValue();

        var strKeyWord='';
        //关键字
        if (Ext.getCmp('keyWord') != undefined && Ext.getCmp('keyWord').getValue() != '') {
            strkeyWord = Ext.getCmp('keyWord').getValue();
        }

        //刷新url
        UserReviewStatics.FormatUrl();

        store.load({
            params: {
                start: 0,
                limit: 20,
                //strCodeRepositoryName: strCodeRepositoryName,
                status: strStatus
                //strKeyword: strKeyWord
            }
        })
    }

    //查看全部
    this.All=function(){
        
        //根据id找到相应的grid
        var store = Ext.getCmp(ID_DY_GRID_PANEL).store;
        store.load({
            params: {
                start: 0,
                limit: 20,
                status: -2
            }
        })
    }

    //在这里继续写方法...

}

/**
* CUserReviewStatics. 单例对象
*/
var UserReviewStatics = new Lucky.CUserReviewStatics();