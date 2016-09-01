using log4net;
using PdpApi.BL;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;
//using System.Web.Mvc;

namespace PdpApi.Controllers
{
    public class ResDataStreamController : ApiController {
		internal static readonly ILog Logger = LogManager.GetLogger(typeof(ResDataStreamController));

		// GET: ResDataStream
		public HttpResponseMessage Get(string Filter) {
			//new System.Text.UTF8Encoding().GetBytes(csv)
			//return File("App_Data/sample_data.csv", "text/csv", "Custom Report.csv");
			Logger.DebugFormat("getting linq for {0}", Filter);
			var qry=new ResDataManager().GetFilteredQuery(Filter);
			MemoryStream stream = new MemoryStream();
			StreamWriter writer = new StreamWriter(stream);
			

			HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
			result.Content = new StreamContent(stream);
			result.Content.Headers.ContentType = new MediaTypeHeaderValue("text/csv");
			result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment") { FileName = "ExportData.csv" };

			Logger.DebugFormat("writing csv");
			writer.WriteLine("PDP_Sample_ID, PdpYear, Com, Pesticide_Name, pp_, Pest_Code, Ann, Clm, Country, State, Tol_ppm");
			int iRecCount = 0;
			foreach (var rec in qry) {
				writer.WriteLine(rec.PDP_Sample_ID + "," + rec.PdpYear + "," + rec.Com + "," + rec.Pesticide_Name + "," + rec.pp_ + "," + rec.Pest_Code + "," + rec.Ann + "," + rec.Clm + ","+ rec.Country + "," + rec.State + "," + rec.Tol_ppm);
				iRecCount++;
				if (iRecCount % 10000 == 0) {
					writer.Flush();
					Logger.DebugFormat("wrote {0} records", iRecCount);
				}
			}
			
			writer.Flush();
			Logger.DebugFormat("wrote total {0} records", iRecCount);
			stream.Position = 0;
			return result;// ResponseMessage(result);
		}
	}
}