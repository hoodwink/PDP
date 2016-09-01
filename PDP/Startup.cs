using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(PDP.Startup))]

namespace PDP
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
        }
    }
}
