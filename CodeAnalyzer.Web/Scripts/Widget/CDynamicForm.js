/**
* Author:LuckyHu
*/
Ext.namespace("Lucky");
Lucky.CDynamicForm = function () {

    //初始化
    //HeaderForm
    this.headerForm = new Object();
    var headerForm = new Object();

    //bodyForm
    this.bodyForm = new Object();

    /**
    * 获取动态表单元素
    */
    this.GetDynamicFormItems = function (strFormType) {

        var strUrl = "/Article/GetDynamicFormItems";

        switch (strFormType) {
            case "Article":
                Helper.Ajax(strUrl, { strFormType: strFormType }, this.oDelegteHeaderFormSuccess, Helper.oDelegateFailure);
                break;
            case "Body":
                Helper.Ajax(strUrl, { strFormType: strFormType }, this.oDelegteBodyFormSuccess, Helper.oDelegateFailure);
                break;
        }
    }

    /**
    * 调用Ajax成功返回的方法
    */
    this.oDelegteHeaderFormSuccess = function (response, options) {

        var strTemplate = response.responseText;

        var tempItems = Ext.util.JSON.decode(response.responseText);

        this.headerForm = new Ext.form.FormPanel({
            //defaultType: 'textfield',
            labelAlign: 'right',
            title: '文章详细表单',
            renderTo: 'headerForm',
            labelWidth: 60,
            frame: true,
            autoHeigth: true,
            autoWidth: true,
            items: tempItems
        });

        headerForm = this.headerForm;
    }

    /**
    * 调用Ajax成功返回的方法
    */
    this.oDelegteBodyFormSuccess = function (response, options) {

        var strTemplate = response.responseText;

        var tempItems = Ext.util.JSON.decode(response.responseText);

        this.bodyForm = new Ext.form.FormPanel({
            //defaultType: 'textfield',
            labelAlign: 'right',
            title: '文章详细表单',
            renderTo: 'bodyForm',
            labelWidth: 40,
            frame: true,
            items: tempItems
        });
    }

    /**
    * 顶部工具条
    */
    this.GetTbar = function () {

        var saveButton = new Ext.Button({
            id: 'savBtn',
            text: '保存',
            type: 'button',
            handler: function () {

                //1.一次性获取表单数据
                //var oValues = headerForm.getForm().getValues();
                //var strId = headerForm.getForm().findField('Atid');


                var strUrl = '/Article/GetLstFields';

                function AjaxSuccess(response, options) {

                    var lstFields = Ext.util.JSON.decode(response.responseText);

                    var strParameters = "";
                    for (var i = 0; i < lstFields.length; i++) {

                        strParameters += Ext.getCmp(lstFields[i]).getValue() + "@";
                    }

                    //去除最后一个@号
                    var lastIndex = strParameters.lastIndexOf('@');
                    if (lastIndex > -1)
                        strParameters = strParameters.substring(0, lastIndex) + strParameters.substring(lastIndex + 1, strParameters.length);

                    DynamicForm.SaveFormValues(strParameters);

                }

                Helper.Ajax(strUrl, null, AjaxSuccess, Helper.oDelegateFailure);


            },
            renderTo: 'savBtn'
        });

        return saveButton;
    }

    /**
    * 数据提交和保存
    */
    this.SaveFormValues = function (strParameters) {

        var strUrl = '/Article/Update';

        function AjaxSuccess(response, options) {

            var oRes = Ext.util.JSON.decode(response.responseText);

            if (oRes == true)
                Ext.Msg.alert("提示", "操作成功!");
            else
                Ext.Msg.alert("提示", "操作失败!");
        }

        Helper.Ajax(strUrl, { strParameters: strParameters }, AjaxSuccess, Helper.oDelegateFailure);

    }
}

/**
* CDynamicForm 单例对象
*/
var DynamicForm = new Lucky.CDynamicForm();