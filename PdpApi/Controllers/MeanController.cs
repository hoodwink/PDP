using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace PdpApi.Controllers
{
    public class MeanController : ApiController
    {
        public List<Mean_LU> GetAll()
        {
            using (var db = new PDPEntities())
            {
                return db.Mean_LU.ToList();
            }
        }
    }
}