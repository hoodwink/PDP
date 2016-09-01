using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace PdpApi.Controllers
{
    public class AnnotateController : ApiController
    {
        public List<Annotate_LU> GetAll()
        {
            using (var db = new PDPEntities())
            {
                return db.Annotate_LU.ToList();
            }
        }
    }
}