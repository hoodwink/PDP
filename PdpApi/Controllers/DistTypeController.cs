using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace PdpApi.Controllers
{
    public class DistTypeController : ApiController
    {
        public List<DistType_LU> GetAll()
        {
            using (var db = new PDPEntities())
            {
                return db.DistType_LU.ToList();
            }
        }
    }
}