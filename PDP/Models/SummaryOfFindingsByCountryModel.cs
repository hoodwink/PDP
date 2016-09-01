namespace PDP.Models
{
    class SummaryOfFindingsByCountryModel
    {
        public string PesticideName { get; set; }

        public string Commodity { get; set; }

        public int Origin { get; set; }

        public string Country { get; set; }

        public int SamplesNumber { get; set; }

        public int? SamplesDetects { get; set; }

        public float? SampleDetectsPercent { get; set; }

        public float? MinValue { get; set; }

        public float? MaxValue { get; set; }

        public float? AvgValue { get; set; }

        public string RangeOfLods { get; set; }

        public string UnitPp { get; set; }

        public string EPATOL { get; set; }
    }
}
