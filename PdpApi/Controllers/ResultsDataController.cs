using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using PdpApi;
using PdpApi.Models;
using PdpApi.BL;
using log4net;

namespace PdpApi.Controllers {
	public class ResultsDataController : ApiController {
		internal static readonly ILog Logger = LogManager.GetLogger(typeof(ResultsDataController));

		// GET: api/ResultsData
		//public IQueryable<ResultsData> GetResultsDatas(int MaxRecordCount=1000)
		public CountedDbResult GetResultsDatas(int FirstRow = 0, int PageSize = 1000, string Filter=null, string Sort=null) {
			//return db.ResultsDatas.Take(MaxRecordCount);
			//return db.get_pdp_result_tbl(FirstRow, PageSize);
			return new ResDataManager().GetResultsDatas(FirstRow, PageSize, Filter, Sort);
		}

		public IHttpActionResult PutCellEdit([FromBody] EditCellReq req) {
			if (string.IsNullOrEmpty(req.rowkey)){
				return BadRequest("req.rowkey is empty");
			}
			using (var db = new PDPEntities()) {
				short iPdpYear;
				int iSamplePk;
				double dVal;
				var asRowId = req.rowkey.Split('|');
				if (asRowId.Length != 4) return BadRequest("Invalid number of columns in the key: " + asRowId.Length);
				//SAMPLE_PK int, PESTCODE string, PDP_YEAR short, COMMOD string
				if (!int.TryParse(asRowId[0], out iSamplePk)) return BadRequest("Invalid value for SamplePK:" + asRowId[0]);
				if (!short.TryParse(asRowId[2], out iPdpYear)) return BadRequest("Invalid value for Pdp year:" + asRowId[2]);
				
				var foundRec = db.ResultsDatas.Find(new object[] { iSamplePk, asRowId[1], iPdpYear , asRowId[3]});
				if (null == foundRec) {
					return BadRequest("record with the key {0} was not found");
				}
				switch (req.col) {
					case "Concen":
						if (!double.TryParse(req.val, out dVal)) return BadRequest("Value of CONCEN can't be " + req.val);
						foundRec.CONCEN = dVal; break;
					case "LOD":
						if (!double.TryParse(req.val, out dVal)) return BadRequest("Value of LOD can't be " + req.val);
						foundRec.LOD = dVal; break;
					case "pp_":
						foundRec.CONUNIT = req.val; break;
					default: return BadRequest("can't edit column " + req.col);
				}
				try {
					db.SaveChanges();
				}catch(Exception ex) {
					Logger.Error(ex);
					while (null != ex.InnerException) ex=ex.InnerException;
					return InternalServerError(ex);
				}
			}
			return Ok();
		}
	}
}