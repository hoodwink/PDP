using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PdpApi.Models {
	public class EditCellReq {
		public string rowkey { get; set; }
		public string col { get; set; }
		public string val { get; set; }

	}
}