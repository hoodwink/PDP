using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using PdpApi;

namespace PdpApi.Controllers
{
    public class PestCodeController : ApiController
    {
        private PDPEntities db = new PDPEntities();

        // GET: api/PestCode
        public IQueryable<PestCode_LU> GetPestCode_LU()
        {
            return db.PestCode_LU;
        }

        // GET: api/PestCode/5
        [ResponseType(typeof(PestCode_LU))]
        public IHttpActionResult GetPestCode_LU(string id)
        {
            PestCode_LU pestCode_LU = db.PestCode_LU.Find(id);
            if (pestCode_LU == null)
            {
                return NotFound();
            }

            return Ok(pestCode_LU);
        }

        // PUT: api/PestCode/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutPestCode_LU(string id, PestCode_LU pestCode_LU)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != pestCode_LU.PESTCODE)
            {
                return BadRequest();
            }

            db.Entry(pestCode_LU).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PestCode_LUExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/PestCode
        [ResponseType(typeof(PestCode_LU))]
        public IHttpActionResult PostPestCode_LU(PestCode_LU pestCode_LU)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.PestCode_LU.Add(pestCode_LU);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (PestCode_LUExists(pestCode_LU.PESTCODE))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = pestCode_LU.PESTCODE }, pestCode_LU);
        }

        // DELETE: api/PestCode/5
        [ResponseType(typeof(PestCode_LU))]
        public IHttpActionResult DeletePestCode_LU(string id)
        {
            PestCode_LU pestCode_LU = db.PestCode_LU.Find(id);
            if (pestCode_LU == null)
            {
                return NotFound();
            }

            db.PestCode_LU.Remove(pestCode_LU);
            db.SaveChanges();

            return Ok(pestCode_LU);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool PestCode_LUExists(string id)
        {
            return db.PestCode_LU.Count(e => e.PESTCODE == id) > 0;
        }
    }
}