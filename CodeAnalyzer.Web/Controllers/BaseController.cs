using CodeAnalyzer.Web.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CodeAnalyzer.Web.Controllers
{
    [LoginFilter]
    public class BaseController : Controller
    {
        // GET: Base
        //public ActionResult Index()
        //{
        //    return View();
        //}
    }
}