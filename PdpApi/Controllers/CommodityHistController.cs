﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace PdpApi.Controllers
{
    public class CommodityHistController : ApiController
    {
        public List<spCommodityHistory_Result> GetAll()
        {
            using (var db = new PDPEntities())
            {
                return db.spCommodityHistory().ToList();
            }
        }
    }
}
