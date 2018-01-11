using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CodeAnalyzer.Web.Controllers
{
    public class LoginController : Controller
    {
        // GET: Login
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Login()
        {
            return View();
        }

        public ActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Login(string username, string password, string validationcode)
        {
            var oResult = new Object();

            try
            {
                if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password) || string.IsNullOrEmpty(validationcode))
                {
                    oResult = new
                    {
                        Bresult = true,
                        Notice = "用户名,密码和验证码不能为空!"
                    };
                    return Json(oResult, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    //判断验证码输入是否正确
                    var s = Session["ValidateCode"].ToString();
                    if (String.Compare(Session["ValidateCode"].ToString(), validationcode, true) != 0)
                    {
                        oResult = new
                        {
                            Bresult = false,
                            Notice = "验证码错误!"
                        };
                        return Json(oResult, JsonRequestBehavior.AllowGet);
                    }

                    var currentUser = UserService.Instance.GetUserByEmail(strUserName.Trim());
                    if (currentUser != null)
                    {
                        //超管可以直接登录
                        //if (strPassword.Equals(SuperAdminAccount.SUPER_ADMIN_PWD))
                        if (strUserName.Equals(SettingManager.Settings["superAdminAccount"]) && strPassword.Equals(SettingManager.Settings["superAdminPwd"]))
                        {
                            Session.Add("strDomainID", currentUser);
                            oResult = new
                            {
                                Bresult = true,
                                Url = "/default/index",
                                Notice = "登陆成功!"
                            };
                            return Json(oResult, JsonRequestBehavior.AllowGet);
                        }

                        if (string.IsNullOrEmpty(currentUser.Email))
                        {
                            oResult = new
                            {
                                Bresult = true,
                                Url = "/Register/SignUpEmail?accountId=" + currentUser.AccountId,
                                Notice = "验证成功!"
                            };
                        }
                        else
                        {
                            Session.Add("strDomainID", currentUser);
                            oResult = new
                            {
                                Bresult = true,
                                Url = "/default/index",
                                Notice = "登陆成功!"
                            };
                        }
                    }
                    else
                    {
                        //svn检查
                        var bRet = UserService.Instance.IsSvnExist(strUserName.Trim(), strPassword.Trim());
                        if (bRet)
                        {
                            AdminUser user = new AdminUser
                            {
                                Email = string.Empty,
                                AccountId = strUserName,
                                PasswordSalt = BCrypt.Net.BCrypt.HashPassword(strPassword.Trim(), BCrypt.Net.BCrypt.GenerateSalt())
                            };
                            UserService.Instance.AddUser(user);

                            AdminUser newUser = UserService.Instance.GetUserByEmail(user.AccountId);

                            //创建用户角色[默认设置为游客]
                            var oRole = RoleService.Instance.GetByName(RoleResource.VISITOR);
                            if (oRole == null)
                            {
                                oRole = new Role
                                {
                                    Id = Guid.NewGuid().ToString(),
                                    Name = RoleResource.VISITOR,
                                    CreatedAt = DateTime.Now,
                                    UpdatedAt = DateTime.Now
                                };
                                RoleService.Instance.Add(oRole);
                            }

                            UserRole userRole = new UserRole
                            {
                                Id = Guid.NewGuid().ToString(),
                                UserId = newUser.Id,
                                RoleId = oRole.Id
                            };
                            var bRet2 = UserRoleService.Instance.Add(userRole);

                            //跳转到资料完善页面,添加邮箱
                            oResult = new
                            {
                                Bresult = true,
                                Url = "/Register/SignUpEmail?accountId=" + user.AccountId,
                                Notice = "验证成功!"
                            };
                        }
                        else
                        {
                            oResult = new
                            {
                                Bresult = false,
                                Notice = "请联系管理员给您分配SVN账户!"
                            };
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                LogHelper.Log(ex.Message);
            }

            return Json(oResult, JsonRequestBehavior.AllowGet);
        }

        public FileContentResult GetValidateCodeImage()
        {
            ValidateCode vCode = new ValidateCode();
            string code = vCode.CreateValidateCode(5);
            Session["ValidateCode"] = code;
            byte[] bytes = vCode.CreateValidateGraphic(code);
            string result = String.Format("data:image/jpeg;base64,{0}", Convert.ToBase64String(bytes));
            //return File(bytes, @"image/jpeg");
            return File(bytes, "image/gif");
        }

        public virtual ActionResult GetValidateCodeImage2()
        {
            string jsoncallback = Request.QueryString["jsoncallback"];
            //var result = new Object();
            string result = String.Empty;
            try
            {
                ValidateCode vCode = new ValidateCode();
                string code = vCode.CreateValidateCode(5);
                Session["ValidateCode"] = code;
                byte[] bytes = vCode.CreateValidateGraphic(code);
                result = String.Format("data:image/jpeg;base64,{0}", Convert.ToBase64String(bytes));
            }
            catch (Exception ex)
            {
                throw ex;
            }
            //return base64String;
            return Content(string.Format("{0}({1})", jsoncallback, result.ToJson()), "text/plain", System.Text.Encoding.UTF8);
        }

        private void ClearClientCookie(string cookieKey)
        {
            if (Request.Cookies[cookieKey] != null)
            {
                Response.Cookies.Add(new HttpCookie(cookieKey)
                {
                    Expires = DateTime.Now.AddDays(-1)
                });
            }
        }
    }
}