using System.Collections.Generic;

namespace PDP.Models
{
    public class FilterSettingsModel
    {
        public List<CommodityModel> Commodities { get; set; }

        public List<PesticideModel> Pesticides { get; set; }

        public List<TestClassModel> TestClasses { get; set; }

        public List<YearModel> Years { get; set; }

        public int ResultOptionId { get; set; }
    }
}
