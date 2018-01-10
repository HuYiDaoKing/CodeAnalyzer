/**
* Author:LuckyHu
*/
/*Ext.namespace("Lucky");
Lucky.CLogin = function () {


this.Login = function () {

var winLogin = new Ext.Window({
width: 400,
height: 300,
modal: true, // 窗口弹出，其他地方不可操作  
//title: '&nbsp;登陆 ',
collapsible: false,  // 收缩按钮  
closable: false, // 是否显示关闭窗口按钮  
iconCls: 'key', // cog , database_gear  
resizable: false, // 窗体是否可以拉伸  
constrain: true,
items: [{
xtype: 'panel',
width: '100%',
height: 100,
padding: '1px',
html: "<img src='../Content/Images/login.jpg' alt='软件LOGO' height='100%' width='100%'/>"
}, {
xtype: 'form',
width: '100%',
id: 'myform',
height: 140,
//frame: true,  
padding: '2px',
buttonAlign: 'center',
items: [{
xtype: 'textfield',
id: 'username',
name: 'username',
fieldCls: 'login_account',
fieldLabel: '账&nbsp;&nbsp;号&nbsp;&nbsp;',
width: 250,
margin: '10,10,10,10',
labelAlign: 'right',
allowBlank: false,
listeners: {
specialkey: function (field, e) {
if (e.getKey() == Ext.EventObject.ENTER) {
ArLogin.LoginClick(winLogin);
}
}
}
}, {
xtype: "textfield",
id: 'password',
name: 'password',
fieldCls: 'login_password',
width: 250,
fieldLabel: '密&nbsp;&nbsp;码&nbsp;&nbsp;',
margin: '10,10,10,10',
labelAlign: 'right',
inputType: 'password',
allowBlank: false,
listeners: {
specialkey: function (field, e) {
if (e.getKey() == Ext.EventObject.ENTER) {
ArLogin.LoginClick(winLogin);
}
}
}
},{
xtype: "textfield",
name:'randCode',
id:'randCode',
width: 250,
fieldLabel: '验证码',
margin: '10,10,10,10',
//labelAlign: 'right',
//width: '100%',
bodyStyle: 'border:0'
}, {
xtype: 'panel',
width: '100%',
bodyStyle: 'border:0',
html: "<p align='right'>版权所有：博创科技有限公司</p>"
}],
buttons: [{
text: '登陆',
icon: '../../Scripts/ExtJs/ext-3.4.0/resources/images/user/登陆.png',
layout: 'fit',
type: 'submit',
handler: function () {

ArLogin.LoginClick(winLogin);
}
}, {
text: '重置',
icon: '../../Scripts/ExtJs/ext-3.4.0/resources/images/user/重置.png',
handler: function () {
Ext.getCmp('myform').form.reset();
}
}, '->', {
text: '注册',
icon: '../../Scripts/ExtJs/ext-3.4.0/resources/images/user/tick.png',
handler: function () {
//window.location = '/Ar_Register/Index';
Ext.Msg.alert('提示','建设中...');
}
}]
}],
renderTo: Ext.getBody()
});
winLogin.show();
var bd = Ext.getDom('randCode');
var bd2 = Ext.get(bd.parentNode);
bd2.createChild({tag: 'img',src: '/Login/GetValidateCodeImage',align:'absbottom'});
};

this.LoginClick = function (winLogin) {

var _username = Ext.getCmp('username').getValue();
var _password = Ext.getCmp('password').getValue();

if (_username == "") {
Ext.Msg.alert("提示", "用户名不能为空，请输入用户名");
} else if (_password == "") {
Ext.Msg.alert("提示", "密码不能为空，请输入用户名");
} else {
// 掩饰层 (遮罩效果)  
var myMask = new Ext.LoadMask(Ext.getBody(), { msg: "正在登陆，请稍后..." });
myMask.show();

Ext.Ajax.request({
//url: '/Default/Login',
url: '/Login/Login',
method: 'POST',
success: function (response, opts) {
var oRet = Ext.util.JSON.decode(response.responseText);
if (oRet.Bresult) {
myMask.hide();

winLogin.close();

//设置cookie
Helper.setCookie(DOMAIN_ID, _username, undefined);

var _domainUser = ArLogin.GetDomainUser();

var _json = JSON.stringify(_domainUser);

Helper.setCookie(DOMAIN_USER, _json, undefined);

//DefaultView.GetViewPort(_username);
window.location=oRet.Url;

} else {
myMask.hide();
Ext.Msg.alert("提示", oRet.Notice);
}
},
failure: function (response, opts) {
myMask.hide();
Ext.Msg.alert("提示", "登陆失败,请检查用户名和密码!");
},
params: {
strUserName: _username,
strPassword: _password
}
});
}

}

//测试获取后台数据
this.GetDomainUser = function () {

var oResult;
var strUrl = '/AR_Login/GetUser'

$.ajax({
url: strUrl,
async: false,
}).done(function (json) {
oResult = json;
});

return oResult;
}

//在这里继续写方法...

    
}
var Login = new Lucky.CLogin();*/

LoginWindow = Ext.extend(Ext.Window, {
    title: '登陆系统',
    width: 265,
    height: 170,
    closeAction: 'hide',
    closable: false,
    collapsible: true,
    listeners: {
        "hide": function () { },
        "show": function (LoginWindow) { LoginWindow.findByType("textfield")[3].getEl().dom.src = "/Login/GetValidateCodeImage"; }
    },
    defaults: {
        border: false
    },
    buttonAlign: 'center',
    createFormPanel: function () {
        return new Ext.form.FormPanel({
            bodyStyle: 'padding-top:10px',
            defaultType: 'textfield',
            labelAlign: 'right',
            labelWidth: 55,
            labelPad: 0,
            frame: true,
            defaults: {
                allowBlank: false,
                width: 158
            },
            items: [{
                cls: 'user',
                name: 'username',
                id: 'username',
                fieldLabel: '帐号',
                blankText: '帐号不能为空'

            }, {
                cls: 'key',
                name: 'password',
                id: 'password',
                fieldLabel: '密码',
                blankText: '密码不能为空',
                inputType: 'password'
            }, {
                fieldLabel: "验证",
                xtype: "panel",
                baseCls: "x-plain",
                layout: "column",
                defaultType: "textfield",
                items: [{ columnWidth: .65,
                    xtype: "textfield",
                    cls: 'code',
                    name: 'validateCode',
                    id: 'validatecode',
                    blankText: '验证码不能为空',
                    allowBlank: false,
                    style: 'background-color:#FFFFFF;font-weight:bold;color:#000033;padding-left:20px;'
                },

        { columnWidth: .04, xtype: "panel", baseCls: "x-plain" },

         { columnWidth: .31,
             layout: "form",
             inputType: "image",
             height: 18,
             width: 50,
             id: 'verify_code',
             name: 'verify_code',
             listeners: {

                 "focus": function () {
                     this.ownerCt.ownerCt.findByType("textfield")[2].focus();
                     this.ownerCt.ownerCt.findByType("textfield")[3].getEl().dom.src = "/Login/GetValidateCodeImage?t=" + new Date();
                 }
             }
         }]
            }]
        });
    },
    login: function () {
        if (this.fp.form.isValid()) {
            var _username = Ext.getCmp('username').getValue();
            var _password = Ext.getCmp('password').getValue();
            var _validecode = Ext.getCmp('validatecode').getValue();

            if (_username == "") {
                Ext.Msg.alert("提示", "用户名不能为空，请输入用户名");
            } else if (_password == "") {
                Ext.Msg.alert("提示", "密码不能为空，请输入密码");
            } else if (_validecode == "") {
                Ext.Msg.alert("提示", "验证码不能为空，请输入验证码");
            }
             else {
                // 掩饰层 (遮罩效果)  
                var myMask = new Ext.LoadMask(Ext.getBody(), { msg: "正在登陆，请稍后..." });
                myMask.show();

                Ext.Ajax.request({
                    url: '/Login/Login',
                    method: 'POST',
                    success: function (response, opts) {
                        var oRet = Ext.util.JSON.decode(response.responseText);
                        if (oRet.Bresult) {
                            myMask.hide();
                            window.location.href = oRet.Url;

                        } else {
                            myMask.hide();
                            Ext.Msg.alert("提示", oRet.Notice);
                        }
                    },
                    failure: function (response, opts) {
                        myMask.hide();
                        Ext.Msg.alert("提示", "登陆失败,请检查用户名和密码!");
                    },
                    params: {
                        strUserName: _username,
                        strPassword: _password,
                        strValideCode: _validecode
                    }
                });
            }
        }
    },
    initComponent: function () {
        this.keys = {
            key: Ext.EventObject.ENTER,
            fn: this.login,
            scope: this
        };
        LoginWindow.superclass.initComponent.call(this);
        this.fp = this.createFormPanel();
        this.add(this.fp);
        this.addButton('登陆', this.login, this);
        this.addButton('重置', function () { this.fp.form.reset(); }, this);
    }
});