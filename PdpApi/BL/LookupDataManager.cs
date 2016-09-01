using PdpApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PdpApi.BL
{
    public class LookupDataManager : IDisposable
    {
        private PDPEntities db = new PDPEntities();

        public CountedDbResult GetLookupDatas(int FirstRow = 0, int PageSize = 1000, string Filter = null, string Sort = null)
        {
            CountedDbResult resOut = new CountedDbResult();
            var qry = GetFilteredQuery(Filter);

            resOut.RecordCount = qry.Count();
            if (string.IsNullOrWhiteSpace(Sort))
            {
                qry = qry.OrderBy(s => s.PdpYear);
            }
            else
            {
                string[] asSort = (Sort ?? string.Empty).Split(',');
                foreach (string sColSort in asSort)
                {
                    string[] asColSort = sColSort.Split('#');
                    if (asColSort.Length != 2) throw new ApplicationException("invalid sort specification");
                    if (string.Compare(asColSort[1], "desc", true) == 0)
                    {
                        switch (asColSort[0])
                        {
                            case "Com": qry = qry.OrderByDescending(s => s.Com); break;
                            case "PdpYear": qry = qry.OrderByDescending(s => s.PdpYear); break;
                            case "Pesticide_Name": qry = qry.OrderByDescending(s => s.Pesticide_Name); break;
                            case "Pest_Code": qry = qry.OrderByDescending(s => s.Pest_Code); break;
                            case "Variety": qry = qry.OrderByDescending(s => s.Variety); break;
                            case "Concen": qry = qry.OrderByDescending(s => s.Concen); break;
                            case "LOD": qry = qry.OrderByDescending(s => s.LOD); break;
                            case "pp_": qry = qry.OrderByDescending(s => s.pp_); break;
                            case "Qua": qry = qry.OrderByDescending(s => s.Qua); break;
                            case "Mean": qry = qry.OrderByDescending(s => s.Mean); break;
                            case "Type": qry = qry.OrderByDescending(s => s.Type); break;
                        }
                    }
                    else
                    {
                        switch (asColSort[0])
                        {
                            case "Com": qry = qry.OrderBy(s => s.Com); break;
                            case "PdpYear": qry = qry.OrderBy(s => s.PdpYear); break;
                            case "Pesticide_Name": qry = qry.OrderBy(s => s.Pesticide_Name); break;
                            case "Pest_Code": qry = qry.OrderBy(s => s.Pest_Code); break;
                            case "Variety": qry = qry.OrderBy(s => s.Variety); break;
                            case "Concen": qry = qry.OrderBy(s => s.Concen); break;
                            case "LOD": qry = qry.OrderBy(s => s.LOD); break;
                            case "pp_": qry = qry.OrderBy(s => s.pp_); break;
                            case "Qua": qry = qry.OrderBy(s => s.Qua); break;
                            case "Mean": qry = qry.OrderBy(s => s.Mean); break;
                            case "Type": qry = qry.OrderBy(s => s.Type); break;
                        }
                    }
                }
            }
            resOut.Data = qry.Skip(FirstRow).Take(PageSize);
            return resOut;
        }

        internal IQueryable<PdpResModel> GetFilteredQuery(string sFilter)
        {
            var qry = from rd in db.ResultsDatas
                      join sd in db.SampleDatas
                         on rd.SAMPLE_PK equals sd.SAMPLE_PK
                      join pc in db.PestCode_LU
                         on rd.PESTCODE equals pc.PESTCODE
                      join t in db.Tolerance_LU
                         on new { rd.PDP_YEAR, rd.PESTCODE, rd.COMMOD } equals new { t.PDP_YEAR, t.PESTCODE, t.COMMOD } into gt
                      from subTl in gt.DefaultIfEmpty()
                      select new PdpResModel()
                      {
                          PDP_Sample_ID = sd.STATE + sd.YEAR + sd.MONTH + sd.DAY + sd.SITE + sd.COMMOD + rd.LAB + sd.SOURCE_ID,
                          SamplePK = rd.SAMPLE_PK,
                          PdpYear = rd.PDP_YEAR,
                          Com = rd.COMMOD,
                          Pest_Code = rd.PESTCODE,
                          Pesticide_Name = pc.DESCRIP,
                          Concen = rd.CONCEN,
                          LOD = rd.LOD,
                          pp_ = rd.CONUNIT,
                          Ann = rd.ANNOTATE,
                          Qua = rd.QUANTITATE,
                          Mean = rd.MEAN,
                          Type = sd.COMMTYPE,
                          Variety = sd.VARIETY,
                          Clm = sd.CLAIM,
                          Fac = sd.DISTTYPE,
                          Origin = sd.ORIGIN,
                          Country = (null == sd.Country_LU) ? null : sd.Country_LU.DESCRIP,
                          State = sd.ORIGST,
                          Qty = sd.QUANTITY,
                          Tol_ppm = subTl.EPATOL
                      };
            string[] asFilter = (sFilter ?? string.Empty).Split(',');
            foreach (string sColFilter in asFilter)
            {
                if (string.IsNullOrEmpty(sColFilter)) continue;
                string[] asColFilter = sColFilter.Split('#');
                if (asColFilter.Length != 2) throw new ApplicationException("invalid filter specification");
                string sTerm = asColFilter[1];
                switch (asColFilter[0])
                {
                    case "Com": qry = qry.Where(s => s.Com == sTerm); break;
                    case "PdpYear":
                        short iYear;
                        if (short.TryParse(sTerm, out iYear))
                        {
                            qry = qry.Where(s => s.PdpYear == iYear);
                        }
                        break;
                    case "Pesticide_Name": qry = qry.Where(s => s.Pesticide_Name.Contains(sTerm)); break;
                    case "Pest_Code": qry = qry.Where(s => s.Pest_Code == sTerm); break;
                    case "pp_": qry = qry.Where(w => w.pp_ == sTerm); break;
                    case "LOD":
                        double dLod;
                        if (double.TryParse(sTerm, out dLod))
                        {
                            qry = qry.Where(w => w.LOD == dLod);
                        }
                        break;
                    case "Qua": qry = qry.Where(w => w.Qua == sTerm); break;
                    case "Variety": qry = qry.Where(s => null != s.Variety && s.Variety.Contains(sTerm)); break;
                }
            }
            return qry;
        }

        protected void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
        }

        public void Dispose()
        {
            Dispose(true);
        }
    }
}