using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace PdpApi.Controllers
{
    public class ConUnitController : ApiController
    {
        public List<ConUnit_LU> GetAll()
        {
            using (var db = new PDPEntities())
            {
                return db.ConUnit_LU.ToList();
            }
        }
    }
}