/*

    图片列表视图，可以把图片按图片集合的形式展现

    未来可能发展为一个功能丰富的图片播放管理工具

    <script type="text/javascript" language="javascript" src="/modules/cms/js/pictureview.js"></script>

    eg:

    var pic = new BeidaSoft.CMS.PictureView({

        dataUrl:"somedata.htm"

    })

    layout.C.add(pic)

    传递参数为标准翻页工具条提供的参数如：start、limit等等

    数据格式要求为

    {

        totalCount:100,

        rows:[

            {

                id:"123",

                name:"pic1",

                smallImageSrc:"",

                bigImageSrc:""

            },{

                name:"pic2"

            }

        ]

    }
    */

Ext.namespace('BeidaSoft.CMS');

BeidaSoft.CMS.PictureView = function (config) {

    BeidaSoft.CMS.PictureView.superclass.constructor.call(this, config)

}

Ext.extend(BeidaSoft.CMS.PictureView, Ext.Panel, {

    border: false,

    layout: "fit",

    pageSize: 20,

    dataUrl: "",

    store4Pic: null,

    initComponent: function () {

        //数据源

        var store = new Ext.data.JsonStore({

            url: this.dataUrl,

            root: 'rows',

            totalProperty: 'totalCount',

            fields: [

                { name: 'id', mapping: 'id' },

                { name: 'name', mapping: 'name' },

                { name: 'smallImageSrc', mapping: 'smallImageSrc' },

                { name: 'bigImageSrc', mapping: 'bigImageSrc' }

            ],

            listeners: {

                beforeload: function () {

                    //alert(1)

                    //return false

                },

                load: function () {

                },

                loadexception: function (misc) {

                    //不符合reader格式的数据也会引发异常

                    //debugger

                    //alert(3)

                }

            }
        });

        this.store4Pic = store


        //翻页工具条

        this.bbar = new Ext.PagingToolbar({

            pageSize: this.pageSize,

            store: this.store4Pic,

            displayInfo: true,

            emptyMsg: '没有记录'

        });



        //var handler4ClickPic = String.format('Ext.getCmp("{0}").ClickPic("{id}")', this.id)
        //var currentObject = String.format('Ext.getCmp("{0}")', this.id)
        var template = [

            '<style>',
                'li {float:left;width:145px;height:140px}',
            '</style>',
            '<ul id="img-preview">',
                '<tpl for=".">',
                    '<li style="height:168px; border: solid 1px #ccc; margin:5px;" class="picture">',
                        '<dl style="text-align:center;">',
                        '<dt>',
                        '<a target="_blank">',
                        //'<a target="_blank" onmouseover=Ext.getCmp("{0}").aa() >',
                            //'<img width="145" height="120" src="{smallImageSrc}" />',
                            //'<img width="145" height="80" src="{smallImageSrc}" />',
                            '<img style="max-width: 100%;width: 80px;height: 80px;vertical-align: middle;border: 0;ms-interpolation-mode: bicubic;" src="{smallImageSrc}" title="{name}"/>',
                        '</a>',
                        '</dt>',
                        '<dd style="padding-bottom=0px ;padding-left=0px ;padding-right=0px ;padding-top=0px ;">',

                        '<p><label style="text-align:center; display:">',

                        '<input type="checkbox" id="{id}" name="{name}" />',

                        "{name}", '</label></p>',

                        '<br>',
                        '</dd>',
                        '</dl>',
                    '</li>',
                '</tpl>',
            '</ul>'

        ].join("");

        template = String.format(template, this.id);



        this.tpl4Pic = new Ext.XTemplate(template);



        this.dataview4Pic = new Ext.DataView({

            store: this.store4Pic,

            tpl: this.tpl4Pic,

            //因为有的样式是用id写的所以也这么写是不合适的

            //id: 'phones',

            itemSelector: 'li.phone',

            overClass: 'phone-hover',

            multiSelect: true,

            emptyText: 'No images to display',

            autoScroll: true

        });

        this.items = this.dataview4Pic;

        BeidaSoft.CMS.PictureView.superclass.initComponent.call(this);

    },

    //设置参数

    SetBaseParams: function (params) {

        //尚未实现

    },

    //整合数据

    LoadData: function () {
        this.store4Pic.load()
    },
    //20140818
    ReLoadData: function (strDataUrl) {

        this.store4Pic.proxy = new Ext.data.HttpProxy({
            url: strDataUrl,
            method: 'POST'
            //params: { userName: 'tom', password: '123' }, //请求参数
            //customer: '自定义属性', //附加属性
            //reader: new Ext.data.JsonReader({ totalProperty: "results", root: "data" })////reader配置是proxy的，不是store的
        });
        this.store4Pic.load();

    },
    //派生类可以重写这些方法来实现特定的逻辑

    //预览图片
    Preview: function (id) {

        //alert(id)
        //Ext.Msg.alert('您预览:', id);
    },
    aa: function () {


        //alert($('#img-preview li a img'));
        //var obj = $('#img-preview li a img');
        //for (var a in obj) {
        //    console.log(a);
        //}
        //var x = 10;
        //var y = 20;

        //$('#img-preview li a img').bb();
        /*$('#img-preview li a img').mouseout(function () {
            this.title = this.myTitle;
            $("#tooltip").remove();//移除 
        }).mousemove(function () {
            $("#tooltip")
                .css({
                    "top": (this.pageY + y) + "px",
                    "left": (this.pageX + x) + "px"
                });
        });*/


        var x = 10;
        var y = 20;
        $("#img-preview li a img").mouseover(function (e) {
            this.myTitle = this.title;
            this.title = "";
            var imgTitle = this.myTitle ? "<br/>" + this.myTitle : "";
            var tooltip = "<div id='tooltip'><img src='" + this.href + "' alt='预览图'/>" + imgTitle + "<\/div>"; //创建 div 元素
            $("body").append(tooltip);	//把它追加到文档中						 
            $("#tooltip")
                .css({
                    "top": (e.pageY + y) + "px",
                    "left": (e.pageX + x) + "px"
                }).show("fast");	  //设置x坐标和y坐标，并且显示
        }).mouseout(function () {
            this.title = this.myTitle;
            $("#tooltip").remove();	 //移除 
        }).mousemove(function (e) {
            $("#tooltip")
                .css({
                    "top": (e.pageY + y) + "px",
                    "left": (e.pageX + x) + "px"
                });
        });

    },
    /*bb: function () {
        this.myTitle = this.title;
        this.title = "";
        var imgTitle = this.myTitle ? "<br/>" + this.myTitle : "";
        var tooltip = "<div id='tooltip'><img src='" + this.href + "' alt='预览图'/>" + imgTitle + "<\/div>"; //创建 div 元素
        $("body").append(tooltip);	//把它追加到文档中						 
        $("#tooltip")
            .css({
                "top": (this.pageY + y) + "px",
                "left": (this.pageX + x) + "px"
            }).show("fast");	  //设置x坐标和y坐标，并且显示
    },*/
    //点击图片
    ClickPic: function (id) {

        //alert(id)
        Ext.Msg.alert('您选择的是:', id);

    },
    //删除图片
    DeletePic: function (id) {

        //Ext.Msg.alert('您删除的是:', id);

    },

    //获取选中的记录
    GetSelections: function () {

        var arrRecord = []

        var body = this.body.dom

        var arrInput = body.getElementsByTagName("input")

        for (var i = 0; i < arrInput.length; i++) {

            var input = arrInput[i]

            if (input.checked) {

                var record = this.store4Pic.getAt(i)

                arrRecord.push(record)

            }

        }

        return arrRecord

    },



    //渲染
    onRender: function (ct, position) {

        BeidaSoft.CMS.PictureView.superclass.onRender.apply(this, arguments);

        this.LoadData();
    }

});

Ext.reg("beidasoft.cms.pictureview", BeidaSoft.CMS.PictureView)



/*
Ext.namespace('Ext.ux');
Ext.ux.PictureView = function (config) {
    Ext.ux.PictureView.superclass.constructor.call(this, config);
    this.addEvents({
        'OnclickImage': true
    });
}

Ext.extend(Ext.ux.PictureView, Ext.Panel, {
    border: false,
    layout: "fit",
    pageSize: 20,
    frame: true,
    dataUrl: "",
    store4Pic: null,
    imageCls: "imagesCls",
    mouseOutCls: "overCls",
    bgCls: 'imagesPanelCls',
    initComponent: function () {
        //数据源
        storeLimit = this.pageSize;
        var store = new Ext.data.JsonStore({
            url: this.dataUrl,
            root: 'DataTable',
            totalProperty: 'totalCount',
            fields: [
            { name: 'id', mapping: 'id' },
            { name: 'name', mapping: 'name' },
            { name: 'smallImageSrc', mapping: 'smallImageSrc' },
            { name: 'bigImageSrc', mapping: 'bigImageSrc' }
            ],
            listeners: {
                beforeload: function (st, op) {
                    var params = {};
                    if (st.lastOptions.params != null) {
                        if (st.lastOptions.params.limit != null) {
                            params = {
                                start: st.lastOptions.params.start,
                                limit: st.lastOptions.params.limit
                            };
                        } else {
                            params = {
                                start: 0,
                                limit: storeLimit
                            };
                        }
                    } else {
                        params = {
                            start: 0,
                            limit: storeLimit
                        };
                    }
                    st.baseParams = params;
                },
                load: function () {
                    //alert(2)
                },
                loadexception: function (misc) {
                    //不符合reader格式的数据也会引发异常
                    //debugger
                    //alert(3)
                }
            }
        });
        this.store4Pic = store
        //翻页工具条
        this.bbar = new Ext.PagingToolbar({
            pageSize: this.pageSize,
            store: this.store4Pic,
            displayInfo: true,
            emptyMsg: '没有记录'
        });
        var handler4ClickPic = String.format('Ext.getCmp("{0}").ClickPic("{id}")', this.id)
        var currentObject = String.format('Ext.getCmp("{0}")', this.id)
        var template = [
        '<style>',
            'li {float:left;width:160px;height:140px}',
        '</style>',
        '<ul>',
            '<tpl for=".">',
                '<li  class=" ' + this.imageCls + '" id="{id}" onmouseout=Ext.getCmp("{0}").OnMouse("{id}",0) onmouseover=Ext.getCmp("{0}").OnMouse("{id}",1)>',
                    '<dl style="text-align:center;">',
                    '<dt>',
                    '<a target="_blank" onclick=Ext.getCmp("{0}").ClickPic("{name}","{smallImageSrc}")>',
                        '<img width="145" height="120" src="{smallImageSrc}" />',
                    '</a>',
                    '</dt>',
                    '<dd style="padding-bottom=0px ;padding-left=0px ;padding-right=0px ;padding-top=0px ;">',
                    '<label style="width:100px;">',
                   "{name}",
                   '</label>',
                    '<br>',
                    '</dd>',
                    '</dl>',
                '</li>',
            '</tpl>',
        '</ul>'
        ].join("");
        template = String.format(template, this.id)
        this.tpl4Pic = new Ext.XTemplate(template);
        this.dataview4Pic = new Ext.DataView({
            store: this.store4Pic,
            tpl: this.tpl4Pic,
            cls: this.bgCls,
            //因为有的样式是用id写的所以也这么写是不合适的
            //id: 'phones',
            itemSelector: 'li.' + this.imageCls,
            //                overClass: 'overCls',
            multiSelect: true,
            emptyText: '没有图片',
            autoScroll: true
        });

        this.items = this.dataview4Pic;
        Ext.ux.PictureView.superclass.initComponent.call(this);

    },
    //设置参数
    SetBaseParams: function (params) {
        //尚未实现
    },
    //整合数据
    LoadData: function () {
        this.store4Pic.load()
    },
    //派生类可以重写这些方法来实现特定的逻辑
    //预览图片
    Preview: function (id) {
        //alert(id)
    },
    //点击图片
    ClickPic: function (name, src) {
        this.fireEvent('OnclickImage', name, src, this);
        //            return name;
    },
    OnMouse: function (id, type) {
        if (type == "0") {
            document.getElementById(id).className = this.imageCls;
        } else {
            document.getElementById(id).className = this.mouseOutCls;
        }
    },
    //删除图片
    DeletePic: function (id) {
    },
    //获取选中的记录
    GetSelections: function () {
        var arrRecord = []
        var body = this.body.dom
        var arrInput = body.getElementsByTagName("input")
        for (var i = 0; i < arrInput.length; i++) {
            var input = arrInput[i]
            if (input.checked) {
                var record = this.store4Pic.getAt(i)
                arrRecord.push(record)
            }
        }

        return arrRecord
    },
    //渲染
    onRender: function (ct, position) {
        Ext.ux.PictureView.superclass.onRender.apply(this, arguments);
        this.LoadData();
    }
});
Ext.reg("pictureview", Ext.ux.PictureView)*/