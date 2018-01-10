using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace CodeAnalyzer.Common.Utility
{
    public static class FileHash
    {
        public static byte[] GetDirectoryHash(string directory)
        {
            if (!Directory.Exists(directory))
            {
                return null;
            }

            var sb = new StringBuilder();
            foreach (string file in Directory.EnumerateFiles(directory))
            {
                sb.Append(GetFileMd5(file));
            }

            foreach (string subDirectory in Directory.EnumerateDirectories(directory))
            {
                if (Path.GetFileName(subDirectory).ToLowerInvariant() == "data")
                {
                    continue;
                }

                foreach (
                    string enumerateFile in Directory.EnumerateFiles(subDirectory, "*", SearchOption.AllDirectories))
                {
                    if (Path.GetFileName(enumerateFile) == "Thumbs.db") continue;

                    sb.Append(GetFileMd5(enumerateFile));
                }
            }

            var md5 = new MD5CryptoServiceProvider();
            return md5.ComputeHash(Encoding.Default.GetBytes(sb.ToString()));
        }

        public static string GetFileMd5(string fileName)
        {
            return HashFile(fileName, "md5");
        }

        public static string GetFileSha1(string fileName)
        {
            return HashFile(fileName, "sha1");
        }

        private static string HashFile(string fileName, string algName)
        {
            if (!File.Exists(fileName))
            {
                return string.Empty;
            }

            var fileStream = new FileStream(fileName, FileMode.Open, FileAccess.Read);
            byte[] hashBytes = HashData(fileStream, algName);
            fileStream.Close();
            return BitConverter.ToString(hashBytes).Replace("-", "");
        }

        /// <summary>
        ///     计算哈希值
        /// </summary>
        /// <param name="stream">需要计算的流</param>
        /// <param name="algName">算法名称</param>
        /// <returns></returns>
        private static byte[] HashData(Stream stream, string algName)
        {
            if (string.IsNullOrWhiteSpace(algName))
            {
                throw new ArgumentNullException("algName");
            }
            if (stream == null)
            {
                throw new ArgumentNullException("stream");
            }

            HashAlgorithm algorithm;
            if (algName.Equals("sha1", StringComparison.OrdinalIgnoreCase))
            {
                algorithm = SHA1.Create();
            }
            else if (algName.Equals("md5", StringComparison.OrdinalIgnoreCase))
            {
                algorithm = MD5.Create();
            }
            else
            {
                throw new ArgumentException("不支持提供的加密算法", "algName");
            }

            return algorithm.ComputeHash(stream);
        }
    }
}
