using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace PdpApi.Controllers
{
    public class TelOrderController : ApiController
    {
		public List<telecom_order> GetAll() {
			using(var db=new PDPEntities()) {
				return db.telecom_order.ToList();
			}
		}
    }
}
