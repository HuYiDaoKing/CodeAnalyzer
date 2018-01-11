using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodeAnalyzer.Models.DO
{
    public class AdminUser : Base
    {
        [DisplayName("账号")]
        public string Account { get; set; }

        [DisplayName("手机号")]
        public string Phone { get; set; }

        [DisplayName("邮箱")]
        public string Email { get; set; }

        [DisplayName("密码")]
        public string PasswordSalt { get; set; }

        [DisplayName("真名")]
        public string RealName { get; set; }

        [DisplayName("头像")]
        public string Avatar { get; set; }
    }
}
