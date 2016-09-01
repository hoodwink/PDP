using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PdpApi.Models {
	public class CountedDbResult {
		public int RecordCount { get; set; }
		public IQueryable Data { get; set; }
	}
}