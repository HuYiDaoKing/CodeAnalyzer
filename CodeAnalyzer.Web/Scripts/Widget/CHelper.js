/**
* Author:LuckyHu
* Date:2013-03-28
*/
Ext.namespace("Lucky");
Lucky.CHelper = function () {

    //属性
    this.name = "LuckyHu";

    //方法
    this.Message = function () {
        alert("CHelper");
    }

    this.Ajax = function (strUrl, strParams, oDelegteSuccess, oDelegateFailure) {

        Ext.Ajax.request({
            url: strUrl,
            params: strParams,
            timeout: 90000,
            method: 'POST',
            success: oDelegteSuccess,
            failure: oDelegateFailure
        });

    }

    //返回成功的Ajax
    this.oDelegteSuccess = function (response, options) {
        Ext.MessageBox.alert('成功', '从服务端获取结果: ' + response.responseText);
    }

    //返回失败的Ajax
    this.oDelegateFailure = function (response, options) {
        Ext.MessageBox.alert('失败', '请求超时或网络故障,错误编号：' + response.status);
    }

    /**
    * ajax同步请求
    *获取用例对象
    */
    this.GetoCaseDemo = function () {

        var obj;
        var value;
        var strParamer = "1";
        var strUrl = '../ExtJsAjacCall/GetoPeopeles?strParamer=' + strParamer;

        if (window.ActiveXObject)
            obj = new ActiveXObject('Microsoft.XMLHTTP');
        else if (window.XMLHttpRequest)
            obj = new XMLHttpRequest;

        obj.open('POST', strUrl, false);
        obj.setRequestHeader('Contnent-Type', 'application/', 'application/x-www-form-urlencoded');
        obj.send(null);
        var oResult = Ext.util.JSON.decode(obj.responseText);

        return oResult;
    }

    /**
    * 移除JS数组中相同的元素
    */
    this.DistinctArr = function (arr) {

        var dealedArry = arr.join(",").match(/([^,]+)(?!.*,\1(,|$))/ig);
        return dealedArry;

    }

    /*
    * 获取URL参数
    * 用于ajax传递
    * 将参数数组按照分隔符分割成字符串参数
    * @Param {array} arrParameter 参数数组
    * 备注:后台可以使用不常见的"囧"作为分隔符
    * 再strig.solit().ToList();即可
    * return strParameters 字符串参数
    */
    this.GetUrlParameters = function (arrParameter) {

        var strDyFormFieldsParamers = "";

        for (var iIndex = 0; iIndex < arrParameter.length; iIndex++) {

            //这里自定义分隔符作为区分
            //strDyFormFieldsParamers += arrParameter[iIndex] + "#$";
            strDyFormFieldsParamers += arrParameter[iIndex] + "囧";
        }

        //去除最后一个自定义的分隔符
        //var strLastIndex = strDyFormFieldsParamers.lastIndexOf("#$");
        var strLastIndex = strDyFormFieldsParamers.lastIndexOf("囧");
        strDyFormFieldsParamers = strDyFormFieldsParamers.substring(0, strLastIndex);

        return strDyFormFieldsParamers;
    }

    /**
    * 设置Cookie
    * @Param 
    * {string} strKey-传入Cookie的Key
    * {string} strValue-传入Cookie的value
    * {object} oExpireData-传入Cookie的过期时间
    */
    this.setCookie = function (strKey, strValue, oExpireData) {

        var oNow = new Date();

        if (undefined == oExpireData) {
            oExpireData = new Date(oNow.getFullYear() + 1, oNow.getMonth() + 1, oNow.getDate());
            //var expiry = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
            oExpireData = new Date(oNow.getTime() + 60 * 1000)
        }

        Ext.util.Cookies.set(strKey, strValue, oExpireData);
    }

    /**
    * 清除cookie
    * @Param 
    * {string} strKey-传入Cookie的Key
    */
    this.clearCookie = function (strKey) {

        Ext.util.Cookies.clear(strKey);

    }

    /**
    * 获取指定key的cookie的值
    * @param
    * {string} strKey-传入Cookie的Key
    *  return {string} Return 返回cookie中指定value
    * 潜规则:确认一下,没有难道是null??
    */
    this.GetCookie = function (strKey) {
        return Ext.util.Cookies.get(strKey);
    }

    /*
    * 判断是对象是否空
    */
    this.IsNullOrEmpty = function (obj) {

        var bRes = false;
        if (obj == '' || obj == null || obj == undefined)
            bRes = true;

        return bRes;
    }

    /**
    * Email验证
    */
    this.isValidEmail = function (strEmail) {

        var bRet = false;
        var reMail = /^(?:[a-zA-Z0-9]+[_\-\+\.]?)*[a-zA-Z0-9]+@(?:([a-zA-Z0-9]+[_\-]?)*[a-zA-Z0-9]+\.)+([a-zA-Z]{2,})+$/;
        bRet = reMail.test(strEmail);
        return bRet;
    }

    /**
    * 手机号/电话号码验证
    */
    this.isValidPhoneNum = function (strPhoneNum) {

        var bRet = false;
        var rePhone = /(^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$)|(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;
        bRet = rePhone.test(strPhoneNum);
        return bRet;
    }

    /**
    * 删除左右两端的空格
    */
    this.Trim = function (str) {
        //return str.replace(/(^\s*)|(\s*$)/g, "");
        return $.trim(str);
    }

    /**
    * ajax处理html字符串
    */
    this.ajax_encode = function (str) {
        str = str.replace(/%/g, "{@bai@}");
        str = str.replace(/ /g, "{@kong@}");
        str = str.replace(/</g, "{@zuojian@}");
        str = str.replace(/>/g, "{@youjian@}");
        str = str.replace(/&/g, "{@and@}");
        str = str.replace(/\"/g, "{@shuang@}");
        str = str.replace(/\'/g, "{@dan@}");
        str = str.replace(/\t/g, "{@tab@}");
        str = str.replace(/\+/g, "{@jia@}");

        return str;
    }

    /**
    * 获取模型字段列表
    */
    this.GetLstField = function () {

        var strUrl = '/AR_Models/GetLstFields';

        function AjaxSuccess(response, options) {

            //var lstFields = Ext.util.JSON.decode(response.responseText);
            global_LstFields = Ext.util.JSON.decode(response.responseText);

        }

        Helper.Ajax(strUrl, null, AjaxSuccess, Helper.oDelegateFailure);
    }

    /**
    * 查找列表中是否存在当前值
    * strKey:关键词
    * lstStr:字符串数组
    */
    this.SearchKey = function (strKey, lstStr) {

        var bRet = false;
        for (i = 0; i < lstStr.length; i++) {
            if (strKey == lstStr[i]) {
                bRet = true;
                break;
            }
        }

        return bRet;
    }

    /**
    * html页面接受url参数
    */
    this.GetUrlParams = function () {

        var tmpArr, QueryString;  //声明变量
        var URL = document.location.toString(); //获得整个地址，如：http://localhost:51994/web/TestAccess2007.aspx?isbn=1234567&id=2
        if (URL.lastIndexOf("?") != -1) {  //如果地址上包含有参数的话
            QueryString = URL.substring(URL.lastIndexOf("?") + 1, URL.length); //将地址栏的全部参数串获取出来。如：isbn=1234567&id=2
            tmpArray = QueryString.split("&");   //以"&"进行分割，以获得参数数组
            for (i = 0; i < tmpArray.length; i++) {
                try {
                    var valueArray = (tmpArray[i] + "").split("=");  // 获得每个参数的名称和它的值
                    alert(valueArray[0] + "参数的值是：" + valueArray[1]);
                }
                catch (e) {
                    alert("捕获到有异常:" + e);
                }
            }
        }
        else {
            QueryString = "";  //地址栏没有参数
        }
    };

    /**
    * 获取url参数
    */
    this.getQueryString = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        //if (r != null) return unescape(r[2]); return null;
        if (r != null) return unescape(r[2]); return '';
    }

    /**
    *验证输入是否是正整数   add by rui.li 2014-03-21
    */
    this.isNum = function (s) {
        if (s != null) {
            var r, re;
            re = /\d*/i; //\d表示数字,*表示匹配多个数字
            r = s.match(re);
            return (r == s) ? true : false;
        }
        return false;
    }

    /**
    * 判断相等
    */
    this.IsEqual = function (s1, s2) {
        var bRet = s1 == s2;
        return bRet;
    }

    /**
    * 获取用户角色列表
    */
    this.GetUserRoles = function () {

        if (Helper.IsNullOrEmpty(Helper.GetCookie(DOMAIN_ID))) {
            Ext.Msg.alert('提示', '对不起,你还没有登陆!');
            window.location = '/Ar_Login/Index';
            return;
        }

        var strUrl = '/UserAdmin/GetUserRoles?strEmail=' + Helper.GetCookie(DOMAIN_ID);

        if (window.ActiveXObject)
            obj = new ActiveXObject('Microsoft.XMLHTTP');
        else if (window.XMLHttpRequest)
            obj = new XMLHttpRequest;

        obj.open('GET', strUrl, false);
        obj.setRequestHeader('Contnent-Type', 'application/', 'application/x-www-form-urlencoded');
        obj.send(null);
        var oResult = Ext.util.JSON.decode(obj.responseText);

        return oResult;
    }

    this.GetCurrentUserRoles = function () {

        var result = new Object();

        //ajax同步
        $.ajax({
            url: '/Default/GetCurrentUserRoles',
            type: 'GET',
            async: false, //使用同步的方式,true为异步方式
            //data: { 'act': 'addvideo', 'videoname': videoname },//这里使用json对象
            success: function (data) {
                //code here...
                result = data;
            },
            fail: function () {
                //code here...
            }
        });
        return result;
    }

    /**
    * 用户是否有写权限
    */
    this.HasPermission = function (arrUserRoleNames) {

        var isPermission = true;
        if (!(arrUserRoleNames.contains(SUPER_ADMINISTRATOR) || arrUserRoleNames.contains(ADMINISTRATOR))) {
            Ext.Msg.alert('提示', '对不起,你没有权限!');
            isPermission = false;
        }
        return isPermission;
    }


    /**
    * Js数组的扩展
    */
    Array.prototype.contains = function (item) {
        return RegExp(item).test(this);
    };

    /**
    * 字符串包含
    * str:目标串
    * substr:子串
    * isIgnoreCase:大小写是否够敏感
    */
    this.isStrContains = function (str, substr, isIgnoreCase) {
        if (isIgnoreCase) {
            str = str.toLowerCase();
            substr = substr.toLowerCase();
        }
        var bRet = new RegExp(substr).test(str);
        return new RegExp(substr).test(str);
    }

    /**
    * Js计算字符串长度(包括中文和英文)
    */
    this.countCharacters = function (str) {
        var totalCount = 0;
        for (var i = 0; i < str.length; i++) {
            var c = str.charCodeAt(i);
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
                totalCount++;
            }
            else {
                totalCount += 2;
            }
        }
        return totalCount;
    }

    /**
    * bootStrap风格提示
    */
    this.bootStrapInfo = function (strNotice) {
        var strMessage = '<div class="alert alert-info">';
        strMessage += '<a class="close" data-dismiss="alert">×</a>';
        strMessage += '<strong>提示:</strong>' + strNotice + '</div>';
        return strMessage;
    }

    this.bootStrapSuccess = function (strNotice) {

        var strMessage = '<div class="alert alert-success">';
        strMessage += '<a class="close" data-dismiss="alert">×</a>';
        strMessage += '<strong>提示:</strong>' + strNotice + '</div>';
        return strMessage;
    }

    this.bootStrapAlert = function (strNotice) {

        var strMessage = '<div class="alert">';
        strMessage += '<a class="close" data-dismiss="alert">×</a>';
        strMessage += '<strong>提示:</strong>' + strNotice + '</div>';
        return strMessage;
    }

    /**
    * CheckBox有效性检查
    */
    this.CheckValidation = function () {

        var selections = Ext.getCmp(ID_DY_GRID_PANEL).getSelectionModel().getSelections();
        if (selections.length == 0) {
            Ext.Msg.alert('提示', '请选择要操作的项!');
            return false;
        }

        /*if (selections.length > 1) {
            Ext.Msg.alert('提示', '请单选!');
            return false;
        }*/
        return true;
    }

    /**
    * 遮罩效果
    */
    this.LoadMask = function (msg) {
        var loadMask = new Ext.LoadMask(Ext.getBody(), {
            msg: msg,
            removeMask: true
        });
        loadMask.show();
        return loadMask;
    }

    //在这里继续写方法...
}

/**
* CHelper 单例对象
*/
var Helper = new Lucky.CHelper();