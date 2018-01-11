using CodeAnalyzer.Models.DO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CodeAnalyzer.Web.Filters
{
    //类和方法都使用时，加上这个特性，此时都其作用，不加，只方法起作用  
    [AttributeUsage(AttributeTargets.All, AllowMultiple = true, Inherited = true)]
    public class LoginFilter : ActionFilterAttribute, IActionFilter
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var currentAdminUser = filterContext.HttpContext.Session["CURRENT_ADMIN_USER"] as AdminUser;
            if (currentAdminUser == null)
            {
                filterContext.Result = new RedirectResult("/User/Login");
            }
        }
    }
}