using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Json;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;

namespace CodeAnalyzer.Common.Utility
{
    public class FileHelper
    {
        private static FileHelper _Instance = null;

        public static FileHelper Instance
        {
            get
            {
                if (_Instance == null)
                    _Instance = new FileHelper();
                return _Instance;
            }
        }

        private FileHelper()
        {

        }

        #region Winservice

        /*
　　     Windows服务在系统安装后会在注册表的 "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\[ServiceName]"下以服务的ServiceName建1个目录，目录中会有"ImagePath"节，这里保存的就是该服务的安装路径。
       */
        /// <summary>
        /// 获取本机指定服务的安装路径
        /// </summary>
        /// <param name="ServiceName">服务名称</param>
        /// <returns></returns>
        public string GetWindowsServiceInstallPath(string ServiceName)
        {
            string serviceInstallpath = string.Empty;
            try
            {
                string key = @"SYSTEM\CurrentControlSet\Services\" + ServiceName;
                string path = Registry.LocalMachine.OpenSubKey(key).GetValue("ImagePath").ToString();

                //替换掉双引号   
                path = path.Replace("\"", string.Empty);
                FileInfo fi = new FileInfo(path);
                serviceInstallpath = fi.Directory.ToString();
                //return fi.Directory.ToString();
            }
            catch (Exception ex)
            {
                string msg = string.Format("{0}服务在本机不存在!跳过!异常:{1}", ServiceName, ex.Message);
                Log4Helper.Error(this.GetType(), msg, ex);
            }
            return serviceInstallpath;
        }

        /// <summary>
        /// 启动 windows服务
        /// </summary>
        /// <param name="serviceName"></param>
        /// <param name="timeoutMilliseconds"></param>
        public bool StartService(string serviceName, int timeoutMilliseconds)
        {
            var bRet = true;
            ServiceController service = new ServiceController(serviceName);
            try
            {
                if (IsServiceControllerStart(service))
                    return true;

                TimeSpan timeout = TimeSpan.FromMilliseconds(timeoutMilliseconds);

                service.Start();
                service.WaitForStatus(ServiceControllerStatus.Running, timeout);
            }
            catch (Exception ex)
            {
                bRet = false;
                Log4Helper.Error(this.GetType(), String.Format("启动{0}服务失败,异常:{1}", serviceName, ex.Message), ex);
            }
            return bRet;
        }

        /// <summary>
        /// 停止服务
        /// </summary>
        /// <param name="serviceName"></param>
        /// <param name="timeoutMilliseconds"></param>
        public bool StopService(string serviceName, int timeoutMilliseconds)
        {
            bool bRet = true;
            ServiceController service = new ServiceController(serviceName);
            try
            {
                if (!IsServiceControllerStart(service))
                    return true;

                TimeSpan timeout = TimeSpan.FromMilliseconds(timeoutMilliseconds);

                service.Stop();
                service.WaitForStatus(ServiceControllerStatus.Stopped, timeout);
            }
            catch (Exception ex)
            {
                bRet = false;
                string msg = string.Format("停止{0}服务失败", serviceName);
                Log4Helper.Error(this.GetType(), msg, ex);
            }
            return bRet;
        }

        /// <summary>
        /// 判断某个Windows服务是否启动
        /// </summary>
        /// <returns></returns>
        private bool IsServiceControllerStart(ServiceController psc)
        {
            bool bStartStatus = false;

            try
            {
                if (!psc.Status.Equals(ServiceControllerStatus.Stopped))
                {
                    bStartStatus = true;
                }

                return bStartStatus;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public bool IsServiceControllerStart(string serviceName)
        {
            ServiceController service = new ServiceController(serviceName);
            if (IsServiceControllerStart(service))
                return true;
            else
                return false;
        }

        /// <summary>
        /// 判断window服务是否存在
        /// </summary>
        /// <param name="serviceName"></param>
        /// <returns></returns>
        public bool ServiceIsExisted(string serviceName)
        {
            ServiceController[] services = ServiceController.GetServices();
            foreach (ServiceController s in services)
            {
                if (s.ServiceName == serviceName)
                {
                    return true;
                }
            }
            return false;
        }

        #endregion

        /// <summary>
        /// 文件目录整体对比
        /// </summary>
        /// <param name="dir1">目录1</param>
        /// <param name="dir2">目录2</param>
        /// <returns></returns>
        public bool CompareDirs(string fileHolder1, string fileHolder2)
        {
            bool isEqual = false;
            try
            {
                DirectoryInfo dir1 = new DirectoryInfo(fileHolder1);
                DirectoryInfo dir2 = new DirectoryInfo(fileHolder2);

                // Take a snapshot of the file system.
                IEnumerable<FileInfo> fileInfolist1 = dir1.GetFiles("*.*", SearchOption.AllDirectories);
                IEnumerable<FileInfo> fileInfolist2 = dir2.GetFiles("*.*", SearchOption.AllDirectories);

                //1.对比文件名和数量是否一致
                List<string> filelist1 = new List<string>();
                List<string> filelist2 = new List<string>();

                //To List with Relative Path. 把文件相对路径添加到list
                foreach (System.IO.FileInfo file in fileInfolist1)
                {
                    string filepathone = file.DirectoryName.Replace(fileHolder1, "") + "\\" + file.Name;
                    filelist1.Add(filepathone);
                }

                //To List with Relative Path. 把文件相对路径添加到list
                foreach (System.IO.FileInfo file in fileInfolist2)
                {
                    string filepathtwo = file.DirectoryName.Replace(fileHolder2, "") + "\\" + file.Name;
                    filelist2.Add(filepathtwo);
                }

                //check Is Same 两个文件夹下文件数量、名字完全相同，把文件列表放到listbox 控件里
                bool areIdentical = filelist1.SequenceEqual(filelist2);
                if (!areIdentical)
                {
                    string msg = string.Format("1.目录{0}和目录{1}文件名或者数量不一致!2.请检查App路径和发布机上路径是否一致(如多了一个下划线)!", fileHolder1, fileHolder2);
                    Log4Helper.Error(this.GetType(), msg);
                    return false;
                }

                //2.对比hash是否一致
                foreach (string file in filelist1)
                {
                    string file1path = fileHolder1 + file;//目录1
                    string file2path = fileHolder2 + file;//目录2
                    string file1Hash = FileHash.GetFileSha1(file1path);
                    string file2Hash = FileHash.GetFileSha1(file2path);
                    if (!file1Hash.Equals(file2Hash))
                    {
                        string msg = string.Format("文件{0}和文件{1}Hash值不一致!", file1path, file2path);
                        Log4Helper.Error(this.GetType(), msg);
                        return false;
                    }
                }

                isEqual = true;
            }
            catch (Exception ex)
            {
                isEqual = false;
                string msg = string.Format("目录{0}和目录{1}对比失败!异常:{2}", fileHolder1, fileHolder2, ex.Message);
                Log4Helper.Error(this.GetType(), msg);
            }
            return isEqual;
        }


        /// <summary>
        /// Copy文件夹
        /// </summary>
        /// <param name="sPath">源文件夹路径</param>
        /// <param name="dPath">目的文件夹路径</param>
        /// <returns>完成状态：success-完成；其他-报错</returns>
        public bool CopyFolder(string sPath, string dPath)
        {
            bool bRet = true;
            try
            {
                // 创建目的文件夹
                if (!Directory.Exists(dPath))
                {
                    Directory.CreateDirectory(dPath);
                }

                // 拷贝文件
                DirectoryInfo sDir = new DirectoryInfo(sPath);
                FileInfo[] fileArray = sDir.GetFiles();
                foreach (FileInfo file in fileArray)
                {
                    file.CopyTo(dPath + "\\" + file.Name, true);
                }

                // 循环子文件夹
                DirectoryInfo dDir = new DirectoryInfo(dPath);
                DirectoryInfo[] subDirArray = sDir.GetDirectories();
                foreach (DirectoryInfo subDir in subDirArray)
                {
                    CopyFolder(subDir.FullName, dPath + "//" + subDir.Name);
                }
            }
            catch (Exception ex)
            {
                Log4Helper.Error(this.GetType(), String.Format("复制文件出错:{0}", ex.Message), ex);
                bRet = false;
            }
            return bRet;
        }

        public bool IsFileExist(string file)
        {
            bool isExist = false;
            try
            {
                if (File.Exists(file))
                {
                    isExist = true;
                }
                return isExist;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public IEnumerable<DirectoryInfo> ListFolders(string fullPath)
        {
            if (!Directory.Exists(fullPath))
            {
                try
                {
                    Directory.CreateDirectory(fullPath);
                }
                catch (Exception ex)
                {
                    throw new ArgumentException(string.Format("The folder could not be created at path: {0}. {1}", fullPath,
                        ex.Message));
                }
            }

            return
                Directory.GetDirectories(fullPath)
                    .Where(s => !IsHidden(new DirectoryInfo(s)))
                    .Select(s => new DirectoryInfo(s))
                    .ToList();
        }

        public T JsonDeserialize<T>(string jsonString)
        {
            DataContractJsonSerializer ser = new DataContractJsonSerializer(typeof(T));
            MemoryStream ms = new MemoryStream(Encoding.UTF8.GetBytes(jsonString));
            T obj = (T)ser.ReadObject(ms);
            return obj;
        }

        private static bool IsHidden(FileSystemInfo di)
        {
            return (di.Attributes & FileAttributes.Hidden) != 0;
        }

        /// <summary>
        /// 删除文件夹（及文件夹下所有子文件夹和文件）
        /// </summary>
        /// <param name="directoryPath"></param>
        public void DeleteDirectory(string srcPath)
        {
            try
            {
                DirectoryInfo dir = new DirectoryInfo(srcPath);
                FileSystemInfo[] fileinfo = dir.GetFileSystemInfos();  //返回目录中所有文件和子目录
                foreach (FileSystemInfo i in fileinfo)
                {
                    if (i is DirectoryInfo)            //判断是否文件夹
                    {
                        DirectoryInfo subdir = new DirectoryInfo(i.FullName);
                        subdir.Delete(true);          //删除子目录和文件
                    }
                    else
                    {
                        File.Delete(i.FullName);      //删除指定文件
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        /// <summary>
        /// 获取文件夹大小
        /// </summary>
        /// <param name="dirPath"></param>
        /// <returns></returns>
        public long GetDirectorySize(string dirPath)
        {
            if (!System.IO.Directory.Exists(dirPath))
                return 0;
            long len = 0;
            DirectoryInfo di = new DirectoryInfo(dirPath);

            //获取di目录中所有文件的大小
            foreach (FileInfo item in di.GetFiles())
            {
                len += item.Length;
            }

            //获取di目录中所有的文件夹,并保存到一个数组中,以进行递归
            DirectoryInfo[] dis = di.GetDirectories();
            if (dis.Length > 0)
            {
                for (int i = 0; i < dis.Length; i++)
                {
                    len += GetDirectorySize(dis[i].FullName);//递归dis.Length个文件夹,得到每隔dis[i]下面所有文件的大小
                }
            }
            return len;
        }
    }
}
