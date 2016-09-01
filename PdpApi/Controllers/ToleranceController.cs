using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace PdpApi.Controllers
{
    public class ToleranceController : ApiController
    {
        public List<spToleranceLevel_Result> GetAll()
        {
            using (var db = new PDPEntities())
            {
                return db.spToleranceLevel().ToList();
            }
        }
    }
}