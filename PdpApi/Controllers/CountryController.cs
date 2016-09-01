using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace PdpApi.Controllers
{
    public class CountryController : ApiController
    {

        //public CountryController()
        //{

        //}

        public List<Country_LU> GetAll()
        {
            using (var db = new PDPEntities())
            {
                db.Configuration.ProxyCreationEnabled = false;
                return db.Country_LU.ToList();
            }
        }
    }
}