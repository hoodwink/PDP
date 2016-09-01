using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PdpApi.Models {
	public class PdpResModel {
		public string PDP_Sample_ID { get; set; }
		public int SamplePK { get; set; }
		public short PdpYear { get; set; }
		public string Com { get; set; }
		public string Pest_Code { get; set; }
		public string Pesticide_Name { get; set; }
		public double? Concen  { get; set; }
		public double? LOD { get; set; }
		public string pp_  { get; set; }
		public string Ann  { get; set; }
		public string Qua  { get; set; }
		public string Mean  { get; set; }
		public string Type  { get; set; }
		public string Variety  { get; set; }
		public string Clm  { get; set; }
		public string Fac  { get; set; }
		public string Origin  { get; set; }
		public string Country  { get; set; }
		public string State { get; set; }
		public short? Qty  { get; set; }
		public string Tol_ppm  { get; set; }
	}
}