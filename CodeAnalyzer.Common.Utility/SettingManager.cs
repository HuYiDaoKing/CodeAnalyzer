using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace CodeAnalyzer.Common.Utility
{
    public class SettingManager : Dictionary<string, string>
    {
        //客户端相对路径
        //private const string CONFIG_PATH_WEB = @"bin\Config\ConnectionStrConfig.xml";
        //private const string CONFIG_PATH_WINFRM = @"Config\ConnectionStrConfig.xml";
        //public static string SettingPath { get; set; }
        private static string _SettingPath;
        public static void Init(string settingPath)
        {
            _SettingPath = settingPath;
        }
        private static SettingManager _Settings = null;
        public static SettingManager Settings
        {
            get
            {
                if (_Settings == null)
                    _Settings = new SettingManager();
                return _Settings;
            }
        }

        private SettingManager()
        {
            try
            {
                XElement xelement = XElement.Load(_SettingPath);
                var connectioinstrings = from c in xelement.Elements("db")
                                         select c;
                foreach (var connection in connectioinstrings)
                {
                    var key = connection.Attribute("name").Value;
                    var value = connection.Value;
                    if (!this.Keys.Contains(key))
                        this.Add(key, value);
                }
            }
            catch (Exception ex)
            {
                Log4Helper.Error(this.GetType(), "Error", ex);
            }
        }

        public string this[string key]
        {
            get
            {
                if (!this.ContainsKey(key))
                    return String.Empty;
                return base[key];
            }
            set
            {
                base[key] = value;
            }
        }

        public static bool GetBoolValue(string key)
        {
            bool value = false;
            bool.TryParse(Settings[key], out value);
            return value;
        }

        public static int GetIntValue(string key)
        {
            int value = 0;
            int.TryParse(Settings[key], out value);
            return value;
        }
    }
}
