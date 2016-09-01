using PDP.Db;
using PDP.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;

namespace PDP.Controllers
{
    [AllowAnonymous]
    public class InfoController : ApiController
    {
        [AllowAnonymous]
        public async Task<IHttpActionResult> GetPesticides()
        {
            using (var repo = new Repository())
            {
                return Ok(await repo.GetPesticidesAsync());
            }
        }

        public async Task<IHttpActionResult> GetTestClasses()
        {
            using (var repo = new Repository())
            {
                return Ok(await repo.GetTestClassesAsync());
            }
        }

        public async Task<IHttpActionResult> GetCommodities()
        {
            using (var repo = new Repository())
            {
                return Ok(await repo.GetCommoditiesAsync());
            }
        }

        public async Task<IHttpActionResult> GetYears()
        {
            using (var repo = new Repository())
            {
                return Ok(await repo.GetYearsAsync());
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> GetAnalyticalResults(FilterSettingsModel filters)
        {
            using (var repo = new Repository())
            {
                try
                {
                    var results = await repo.GetAnalyticalResultsAsync(filters.Commodities, filters.Pesticides, filters.TestClasses, filters.Years, filters.ResultOptionId);
                    return Ok(results);
                }
                catch
                {
                    return BadRequest();
                }
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> GetSampleResults(FilterSettingsModel filters)
        {
            using (var repo = new Repository())
            {
                try
                {
                    var results = await repo.GetSampleResultsAsync(filters.Commodities, filters.Pesticides, filters.TestClasses, filters.Years, filters.ResultOptionId);
                    return Ok(results);
                }
                catch
                {
                    return BadRequest();
                }
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> GetSummaryOfNdLods(FilterSettingsModel filters)
        {
            using (var repo = new Repository())
            {
                try
                {
                    var results = await repo.GetSummaryOfNdLodsAsync(filters.Commodities, filters.Pesticides, filters.TestClasses, filters.Years);
                    return Ok(results);
                }
                catch
                {
                    return BadRequest();
                }
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> GetSummaryOfFindings(FilterSettingsModel filters)
        {
            using (var repo = new Repository())
            {
                try
                {
                    var results = await repo.GetSummaryOfFindingsAsync(filters.Commodities, filters.Pesticides, filters.TestClasses, filters.Years);
                    return Ok(results);
                }
                catch
                {
                    return BadRequest();
                }
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> GetSummaryOfFindingsByLod(FilterSettingsModel filters)
        {
            using (var repo = new Repository())
            {
                try
                {
                    var results = await repo.GetSummaryOfFindingsByLodAsync(filters.Commodities, filters.Pesticides, filters.TestClasses, filters.Years);
                    return Ok(results);
                }
                catch
                {
                    return BadRequest();
                }
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> GetSummaryOfFindingsByCountryOfOrigin(FilterSettingsModel filters)
        {
            using (var repo = new Repository())
            {
                try
                {
                    var results = await repo.GetSummaryOfFindingsByCountryOfOriginAsync(filters.Commodities, filters.Pesticides, filters.TestClasses, filters.Years);
                    return Ok(results);
                }
                catch
                {
                    return BadRequest();
                }
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> GetSummaryOfFindingsByClaim(FilterSettingsModel filters)
        {
            using (var repo = new Repository())
            {
                try
                {
                    var results = await repo.GetSummaryOfFindingsByClaimAsync(filters.Commodities, filters.Pesticides, filters.TestClasses, filters.Years);
                    return Ok(results);
                }
                catch
                {
                    return BadRequest();
                }
            }
        }
    }
}
