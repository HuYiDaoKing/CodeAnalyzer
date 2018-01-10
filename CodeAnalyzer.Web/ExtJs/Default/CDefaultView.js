/**
* Author:LuckyHu
* Date:2013-03-29
*/
Ext.namespace("Lucky");
Lucky.CDefaultView = function () {

    /**
    * 20140805 修改布局为面向对象
    */
    this.GetPnNorth = function () {

        //用户管理菜单 
        var userAdminMenu = new Ext.menu.Menu({
            items: [{
                text: '用户管理',
                iconCls: 'icon-admin',
                handler: function () {
                    Ext.Msg.alert('提示', '暂不开放!');
                }
            }, {
                text: '角色管理',
                iconCls: 'icon-admin',
                handler: function () {
                    Ext.Msg.alert('提示', '暂不开放!');
                }
            }, {
                text: '权限管理',
                iconCls: 'icon-admin',
                hidden: true,
                handler: function () {
                    Ext.Msg.alert('提示', '该功能尚未实现!');
                }
            }]
        });

        var tbar = new Ext.Toolbar({
            buttonAlign: 'center',
            items: [{
                xtype: 'combo',
                hidden: true,
                store: new Ext.data.SimpleStore({
                    fields: ['chinese', 'english'],
                    data: [['蓝色', 'blue'], ['浅灰色', 'gray'], ['对比色', 'access']]
                }),
                displayField: 'english',
                mode: 'local',
                emptyText: '请选择一个省 份…',
                listeners: {
                    select: function (f, r, i) {
                        var name = f.getValue();
                        setActiveStyleSheet(name);
                    }
                }
            }, {
                text: '<h1>用户管理</h1>',
                //ctCls: 'f-c',
                menu: userAdminMenu
            }]
        });
        /// <reference path="../../../Content/Images/bg.png" />

        //-----上(北)-----
        var pnNorth = new Ext.Panel({
            id: 'pnNorth',
            // autoWidth: true,
            frame: true,
            region: 'north',
            //style: tbarStyle_no_padding,
            baseCls: 'my-panel-no-border',
            html: '<div style="font-size:20px;color:white">CACodeReview代码审核系统</div>',
            bodyStyle: 'background:#000000;padding:20px',
            //bodyStyle: 'background:url(../../../Content/Images/bg.png) no-repeat;padding:20px',
            //bodyStyle: 'padding:20px',
            height: 60,
            region: 'north',
            split: false
            //tbar: tbar
        });

        return pnNorth;
    }

    this.GetPnSouth = function () {

        var strBottom = '<div style="text-align: right;float:left; margin: 10px auto 0 auto;"><p><b style="color: #F00">资源下载:</b><a href="http://ar.1trip.com//Content/CHRY_Chrome_non_defaultV5.rar">Google浏览器</a></p></div>';
        strBottom += '<div id="foot" style="text-align: right;float:right; margin: 10px auto 0 auto;">';
        strBottom += 'CACodeReview代码审核系统&nbsp;';
        //Copyright © 2011-2014 www.wsgjp.com.cn 
        strBottom += 'Copyright © 2015-2016<b style="color: #F00;">成都任我行网络技术有限公司</b> 版权所有 </p></div>';

        //-----底(南)-----
        var pnSouth = new Ext.Panel({
            id: 'pnSouth',
            frame: true,
            region: 'south',
            //style: tbarStyle,
            height: 20,
            baseCls: 'my-panel-no-border',
            html: strBottom
        });

        return pnSouth;
    }

    //-----左(西)-----
    this.GetPnWest = function (strDomainId, oTreePanel) {

        var strLoginHtml = '<div><p><b style="font-size:14px;font-weight:bold;color:green">' + strDomainId + '</b>,已登录.</p></div';

        var pnWest = new Ext.Panel({
            id: "pnWest",
            layout: 'fit',
            resizable: true,
            width: 300,
            region: 'west',
            collapsible: true,
            animateCollapsr: false,
            animate: false,
            tbar: [
                new Ext.Toolbar.TextItem(strLoginHtml),
                  { xtype: "tbfill" },
                  {
                      text: "注销",
                      icon: '../../Scripts/ExtJs/ext-3.4.0/resources/images/user/logoff.png',
                      handler: function () {

                          Ext.MessageBox.confirm('提示', '注销,将退出系统，请确认？', function (btn) {

                              if (btn == 'yes') {

                                  //清除客户端cookie
                                  /*Helper.clearCookie(DOMAIN_ID);

                                  Ext.MessageBox.wait('<p><b style="color: #00BB00">轻轻地走正如你轻轻地来...</b></p>', '<b style="color: #AE0000">难说再见...</b>');
                                  setTimeout(msg_hide, 5000)
                                  function msg_hide() {
                                  Ext.MessageBox.hide();
                                  window.location.reload();//刷新整个页面
                                  }*/
                                  $.ajax({
                                      type: 'POST',
                                      url: '/Default/Logout',
                                      data: null,
                                      async: false,
                                      success: function (data) {

                                          //do nothing
                                      }
                                  });
                                  //Ext.MessageBox.wait('<p><b style="color: #00BB00">轻轻地走正如你轻轻地来...</b></p>', '<b style="color: #AE0000">难说再见...</b>');
                                  Ext.MessageBox.wait('轻轻地走正如你轻轻地来...');
                                  setTimeout(msg_hide, 5000)
                                  function msg_hide() {
                                      Ext.MessageBox.hide();
                                      window.location.reload(); //刷新整个页面
                                  }
                              }
                          });
                      }
                  }],
            items: [oTreePanel]
        });

        return pnWest;
    }

    //-----中(中)-----
    var pnCenter = new Ext.TabPanel({
        region: 'center',
        baseCls: 'my-panel-no-border',
        activeTab: 0
    });

    /**
    * 获取布局
    */
    this.GetViewPort = function (strDomainId) {

        var roles = Helper.GetCurrentUserRoles();
        for (var i = 0; i < roles.length; i++) {
            if (roles[i] == SUPER_ADMINISTRATOR) {
                bHiddenSuper = false;
                bHiddenMid = false;
            }
            if (roles[i] == ADMINISTRATOR) {
                bHiddenMid = false;
            }
        }
        //2015.04.09
        var oTreePanel = DefaultWest.CreatTreePanel();
        DefaultWest.TreeClick(pnCenter, oTreePanel);

        var src = '../Content/Welcome.html';

        //2014.02.26 新增首页图片
        pnCenter.add({
            title: '首页',
            layout: 'fit',
            closable: true, //是否可关闭
            autoScroll: false,
            frame: true,
            border: false,
            html: '<iframe src="' + src + '" width="100%" height="100%" frameborder="0" scrolling="auto"></iframe>'//改变iframe,解决跨域问题
        });

        var pnWest = this.GetPnWest(strDomainId, oTreePanel);
        var pnNorth = this.GetPnNorth();
        var pnSouth = this.GetPnSouth();

        var vp = new Ext.Viewport({
            layout: "border",
            items: [pnNorth, pnWest, pnCenter, pnSouth]
        });

        return vp;

    }

    /**
    * 在pnCenterPanel中添加子页面
    */
    this.AddSonPageInPnCenter = function (strSrc, strTitle, strFrameId) {

        var tab = pnCenter.getComponent(strFrameId);

        if (!tab) {
            pnCenter.add({
                title: strTitle,
                id: strFrameId,
                //autoHeight: true,
                layout: 'fit',
                closable: true, //是否可关闭
                autoScroll: false,
                frame: true,
                border: false,
                html: '<iframe id="' + strFrameId + '" src="' + strSrc + '" width="100%" height="100%" frameborder="0" scrolling="auto"></iframe>'//改变iframe,解决跨域问题
            });

            pnCenter.setActiveTab(strFrameId);
        } else {

            //刷新
            var currentTab = Ext.getCmp(strFrameId);

            //1.从队列中移除当前tab
            pnCenter.remove(currentTab);

            //2.添加新tab
            pnCenter.add({
                title: strTitle,
                id: strFrameId,
                layout: 'fit',
                closable: true, //是否可关闭
                autoScroll: false,
                frame: true,
                html: '<iframe  id="' + strFrameId + '" src="' + strSrc + '" width="100%" height="100%" frameborder="0" scrolling="auto"></iframe>'//改变iframe,解决跨域问题
            });

            pnCenter.setActiveTab(strFrameId);
        }
    }

    //在这里继续写方法...    
}

/**
* CDefaultView 单例对象
*/
var DefaultView = new Lucky.CDefaultView();