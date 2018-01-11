/**
* Author:LuckyHu
*/
Ext.namespace("Lucky");
Lucky.CArRegister = function () {


    this.Hello = function () {

        Ext.Msg.alert('提示', 'Hello,Wolrd!');
    }

    this.formValidation = function () {

        /*
        * test
        */
        /*var strEmail = $('#Email').val();
        var strMobilePhone = $('#MobilePhone').val();
        var strPhone = $('#Phone').val();
        var strName = $('#Name').val();
        var strNickName = $('#NickName').val();
        var strSex = $("input[name='Sex']:checked").val();//选择被选中Radio的Value值
        var strPassWord = $('#PassWord').val();
        var strRePassWord = $('#RePassWord').val();*/

        var bRet = true;
        if (Helper.IsNullOrEmpty($('#Email').val())
            || Helper.IsNullOrEmpty($('#MobilePhone').val())
            //|| Helper.IsNullOrEmpty($('#Phone').val())
            || Helper.IsNullOrEmpty($('#Name').val())
            || Helper.IsNullOrEmpty($('#NickName').val())
            || Helper.IsNullOrEmpty($("input[name='Sex']:checked").val())
            || Helper.IsNullOrEmpty($('#PassWord').val())
            || Helper.IsNullOrEmpty($('#RePassWord').val())
            )

        if (!Helper.isValidEmail($('#Email').val()))
        {
            Ext.Msg.alert('提示', '邮箱格式不合法!');
            return false;
        }

        /*if (!Helper.isValidPhoneNum($('#Phone').val())) {
            Ext.Msg.alert('提示', '座机号码格式不对!');
            return false;
        }*/

        if (!Helper.isValidPhoneNum($('#MobilePhone').val())) {
            Ext.Msg.alert('提示', '手机号码格式不对!');
            return false;
        }

        if ($('#PassWord').val() != $('#RePassWord').val()) {
            Ext.Msg.alert('提示', '两次输入密码不一致!');
            return false;
        }

        return bRet;

    }

    /**
    * 创建用户账号
    */
    this.submitForm = function () {

        //表单验证
        var bRet = ArRegister.formValidation();
        if (!bRet)
            return;

        var strDomainId = Helper.GetCookie(DOMAIN_ID);

        $.ajax({
            type: 'POST',
            url: '/Ar_Register/Register',
            data: {
                /*"strId": strId,
                "strName": $('#Name').val(),
                "strNickName": $('#NickName').val(),
                "strSex": $("input[name='Sex']:checked").val(),
                "strMobilePhone": $('#MobilePhone').val(),
                "strPhone": $('#Phone').val(),
                "strAuthor": Helper.GetCookie(DOMAIN_ID)*/
                "strEmail": $('#Email').val(),
                "strCardNo": $('#CardNo').val(),
                "strMobilePhone": $('#MobilePhone').val(),
                "strPhone": $('#Phone').val(),
                "strName": $('#Name').val(),
                "strNickName": $('#NickName').val(),
                "strSex": $("input[name='Sex']:checked").val(),
                "strPassWord": $('#PassWord').val(),
                "strRePassWord": $('#RePassWord').val(),
                "strSceneryCode": $('#combo-scenery').val()
            },
            success: function (data) {
                var strNotice = Helper.bootStrapInfo(data.Notice);
                $('#notice').empty();
                $('#notice').append(strNotice);
                Ext.Msg.alert('提示', data.Notice);
            }
        });

    }

    //在这里继续写方法...



}

/**
* CArRegister 单例对象
*/
var ArRegister = new Lucky.CArRegister();