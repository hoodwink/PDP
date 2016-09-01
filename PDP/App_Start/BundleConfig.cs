using System.IO;
using System.Web;
using System.Web.Optimization;

namespace PDP
{
    public class BundleConfig
    {
        public static string AdminAppDir = "app";

        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));

            var scriptBundle = new ScriptBundle("~/adminscripts");
            var adminAppDirFullPath = HttpContext.Current.Server.MapPath(string.Format("~/{0}", AdminAppDir));
            if (Directory.Exists(adminAppDirFullPath))
            {
                scriptBundle.Include(
                    // Order matters, so get the core app setup first
                    string.Format("~/{0}/app-module.js", AdminAppDir))
                    // then get any other top level js files
                    .IncludeDirectory(string.Format("~/{0}", AdminAppDir), "*.js", false)
                    // then get all nested module js files
                    .IncludeDirectory(string.Format("~/{0}", AdminAppDir), "*-module.js", true)
                    // finally, get all the other js files
                    .IncludeDirectory(string.Format("~/{0}", AdminAppDir), "*.js", true);
            }
            bundles.Add(scriptBundle);
        }
    }
}
