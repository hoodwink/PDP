namespace PDP.Models
{
    public class AnalyticalResultModel
    {
        public string SampleId { get; set; }

        public string Commodity { get; set; }

        public string CommodityType { get; set; }

        public string PesticideCode { get; set; }

        public string PesticideName { get; set; }

        public string TestClass { get; set; }

        public float Concentration { get; set; }

        public float Lod { get; set; }

        public string ConfirmationMethod { get; set; }

        public string ConfirmationMethod2 { get; set; }

        public string Annotate { get; set; }

        public string Quantitate { get; set; }

        public string Mean { get; set; }

        public string Extract { get; set; }

        public string Determinative { get; set; }

        public string Pp { get; set; }
        
        public string Tol { get; set; }
    }
}
