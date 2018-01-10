using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(CodeAnalyzer.Web.Startup))]
namespace CodeAnalyzer.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
