using PDP.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace PDP.Db
{
    internal class Repository : IDisposable
    {
        private string _connectionString;
        private SqlConnection _connection;

        public Repository()
        {
            _connectionString = ConfigurationManager.ConnectionStrings["PDPConnection"].ConnectionString;
            _connection = new SqlConnection(_connectionString);
        }

        public async Task<IEnumerable<CommodityModel>> GetCommoditiesAsync()
        {
            List<CommodityModel> commodities = new List<CommodityModel>();

            //string sql = "select * from CommodityRef order by commod_name";
            string sql = "select * from Commod_LU order by Descript";

            SqlCommand command = new SqlCommand(sql);
            command.Connection = _connection;

            _connection.Open();

            var reader = await command.ExecuteReaderAsync(CommandBehavior.CloseConnection);

            DataTable table = new DataTable();
            table.Load(reader);

            foreach (DataRow row in table.Rows)
            {
                CommodityModel commodity = new CommodityModel
                {
                    IsChecked = true,
                    Commodity = row["COMMOD"].ToString(),
                    CommodityName = row["Descript"].ToString()
                };

                commodities.Add(commodity);
            }

            return commodities;
        }

        public async Task<IEnumerable<PesticideModel>> GetPesticidesAsync()
        {
            List<PesticideModel> pesticides = new List<PesticideModel>();

            //string sql = "select * from PesticideRef order by pest_name";
            string sql = "select * from Pestcode_LU  order by Descrip";

            SqlCommand command = new SqlCommand(sql);
            command.Connection = _connection;

            _connection.Open();

            var reader = await command.ExecuteReaderAsync(CommandBehavior.CloseConnection);

            DataTable table = new DataTable();
            table.Load(reader);

            foreach (DataRow row in table.Rows)
            {
                PesticideModel pesticide = new PesticideModel
                {
                    IsChecked = true,
                    PesticideCode = row["PESTCODE"].ToString(),
                    PesticideName = row["Descrip"].ToString(),
                    TestClass = row["TESTCLASS"].ToString()
                };

                pesticides.Add(pesticide);
            }

            return pesticides;
        }

        public async Task<IEnumerable<TestClassModel>> GetTestClassesAsync()
        {
            List<TestClassModel> classes = new List<TestClassModel>();

            string sql = "select * from TestClassRef order by test_class_desc";

            SqlCommand command = new SqlCommand(sql);
            command.Connection = _connection;

            _connection.Open();

            var reader = await command.ExecuteReaderAsync(CommandBehavior.CloseConnection);

            DataTable table = new DataTable();
            table.Load(reader);

            foreach (DataRow row in table.Rows)
            {
                TestClassModel testClass = new TestClassModel
                {
                    Description = row["TEST_CLASS_DESC"].ToString(),
                    TestClass = row["TESTCLASS"].ToString()
                };

                classes.Add(testClass);
            }

            return classes;
        }

        public async Task<IEnumerable<YearModel>> GetYearsAsync()
        {
            List<YearModel> years = new List<YearModel>();

            string sql = "select distinct PDP_Year from ResultsData order by PDP_Year desc";

            SqlCommand command = new SqlCommand(sql);
            command.Connection = _connection;

            _connection.Open();

            var reader = await command.ExecuteReaderAsync(CommandBehavior.CloseConnection);

            DataTable table = new DataTable();
            table.Load(reader);

            foreach (DataRow row in table.Rows)
            {
                YearModel year = new YearModel
                {
                    IsChecked = true,
                    Year = row["PDP_Year"].ToString(),
                    YearName = row["PDP_Year"].ToString()
                };

                years.Add(year);
            }

            return years;
        }

        public async Task<IEnumerable<AnalyticalResultModel>> GetAnalyticalResultsAsync(IEnumerable<CommodityModel> commodities,
                                                                                        IEnumerable<PesticideModel> pesticides,
                                                                                        IEnumerable<TestClassModel> testClasses,
                                                                                        IEnumerable<YearModel> years,
                                                                                        int resultOptionId)
        {
            var results = new List<AnalyticalResultModel>();

            string resultOptionCondition = string.Empty;

            switch (resultOptionId)
            {
                case 1:
                    break;
                case 2:
                    resultOptionCondition = "AND CONCEN > 0";
                    break;
                case 4:
                    //resultOptionCondition = "AND CONCEN > 0 AND Annotate IN ('C','QC','QV','V','X','QX')";
                    resultOptionCondition = "AND CONCEN > 0 AND Annotate IN ('QV','V','X','QX')";
                    break;
                default:
                    break;
            }

            string pesticidesCondition = string.Empty;
            if (testClasses.Any())
            {
                pesticidesCondition = string.Format("[ResultsData].testclass in ('{0}')", string.Join("', '", testClasses.Select(c => c.TestClass)));
            }
            else
            {
                pesticidesCondition = string.Format("[ResultsData].pestcode in ('{0}')", string.Join("', '", pesticides.Select(c => c.PesticideCode)));
            }

            string commoditiesCondition = string.Format("[ResultsData].commod in ('{0}')", string.Join("', '", commodities.Select(c => c.Commodity)));

            string yearsCondition = string.Format("[ResultsData].PDP_Year in ('{0}')", string.Join("', '", years.Select(c => c.Year)));

            string sql = string.Format(@"SELECT top 100000 [SampleData].STATE +[SampleData].YEAR + [SampleData].MONTH + [SampleData].DAY +
              [SampleData].SITE +  [ResultsData].COMMOD + [ResultsData].LAB + rtrim([SampleData].SOURCE_ID) as SampleID, 
              [ResultsData].COMMOD,[ResultsData].PESTCODE, [ResultsData].[TESTCLASS],  [ResultsData].CONCEN, [ResultsData].LOD, 
              [ResultsData].CONUNIT, [ResultsData].CONFMETHOD, [ResultsData].CONFMETHOD2, [ResultsData].ANNOTATE, 
              [ResultsData].QUANTITATE, [ResultsData].MEAN, [ResultsData].EXTRACT, [ResultsData].DETERMIN,
              [PestCode_LU].[Descrip] as [Pest_Name], [EPATOL]
              FROM ResultsData
              INNER JOIN [PDP].[dbo].[SampleData] on [PDP].[dbo].[ResultsData].[SAMPLE_PK] = [PDP].[dbo].[SampleData].[SAMPLE_PK]
	          INNER JOIN [PDP].[dbo].[PestCode_LU] on [PDP].[dbo].[ResultsData].[PESTCODE] = [PDP].[dbo].[PestCode_LU].[PESTCODE]
	          LEFT JOIN [PDP].[dbo].[Tolerance_LU] ON [PDP].[dbo].[ResultsData].[PDP_YEAR] = [PDP].[dbo].[Tolerance_LU].[PDP_YEAR] AND 
              [PDP].[dbo].[ResultsData].[PESTCODE] = [PDP].[dbo].[Tolerance_LU].[PESTCODE] AND 
              [PDP].[dbo].[ResultsData].[COMMOD] = [PDP].[dbo].[Tolerance_LU].[COMMOD] where {0} and {1} and {2} {3}", commoditiesCondition, pesticidesCondition, yearsCondition, resultOptionCondition);

            SqlCommand command = new SqlCommand(sql);

            try
            {
                command.Connection = _connection;

                _connection.Open();

                var reader = await command.ExecuteReaderAsync(CommandBehavior.CloseConnection);

                DataTable table = new DataTable();
                table.Load(reader);

                foreach (DataRow row in table.Rows)
                {
                    AnalyticalResultModel analyticalResult = new AnalyticalResultModel
                    {
                        SampleId = row["SampleID"].ToString(),
                        Commodity = row["COMMOD"].ToString(),
                        PesticideCode = row["PESTCODE"].ToString(),
                        PesticideName = row["PEST_NAME"].ToString(),
                        TestClass = row["TESTCLASS"].ToString(),
                        Concentration = float.Parse(row["CONCEN"].ToString()),
                        Lod = float.Parse(row["LOD"].ToString()),
                        Pp = row["CONUNIT"].ToString(),
                        ConfirmationMethod = row["CONFMETHOD"].ToString(),
                        ConfirmationMethod2 = row["CONFMETHOD2"].ToString(),
                        Annotate = row["ANNOTATE"].ToString(),
                        Quantitate = row["QUANTITATE"].ToString(),
                        Mean = row["MEAN"].ToString(),
                        Extract = row["EXTRACT"].ToString(),
                        Determinative = row["DETERMIN"].ToString(),
                        Tol = row["EPATOL"].ToString()
                    };

                    results.Add(analyticalResult);
                }
            }
            catch (Exception ex)
            {
                throw;
            }

            return results;
        }

        public async Task<IEnumerable<SampleResultModel>> GetSampleResultsAsync(IEnumerable<CommodityModel> commodities,
                                                                                        IEnumerable<PesticideModel> pesticides,
                                                                                        IEnumerable<TestClassModel> testClasses,
                                                                                         IEnumerable<YearModel> years,
                                                                                        int resultOptionId)
        {
            var results = new List<SampleResultModel>();

            string resultOptionCondition = string.Empty;

            switch (resultOptionId)
            {
                case 1:
                    break;
                case 2:
                    resultOptionCondition = "AND CONCEN > 0";
                    break;
                case 4:
                    //resultOptionCondition = "AND CONCEN > 0 AND Annotate IN ('C','QC','QV','V','X','QX')";
                    resultOptionCondition = "AND CONCEN > 0 AND Annotate IN ('QV','V','X','QX')";
                    break;
                default:
                    break;
            }

            string pesticidesCondition = string.Empty;
            if (testClasses.Any())
            {
                pesticidesCondition = string.Format("[ResultsData].testclass in ('{0}')", string.Join("', '", testClasses.Select(c => c.TestClass)));
            }
            else
            {
                pesticidesCondition = string.Format("[ResultsData].pestcode in ('{0}')", string.Join("', '", pesticides.Select(c => c.PesticideCode)));
            }

            string commoditiesCondition = string.Format("[ResultsData].commod in ('{0}')", string.Join("', '", commodities.Select(c => c.Commodity)));

            string yearsCondition = string.Format("[ResultsData].PDP_Year in ('{0}')", string.Join("', '", years.Select(c => c.Year)));


            string sql = string.Format(@"SELECT  [SampleData].STATE +[SampleData].YEAR + [SampleData].MONTH + [SampleData].DAY + [SampleData].SITE  +  [ResultsData].COMMOD + [ResultsData].LAB + rtrim([SampleData].SOURCE_ID) as SampleID , [ResultsData].COMMOD, [ResultsData].PESTCODE,  [PDP].[dbo].[PestCode_LU].[Descrip] as [Pesticide Name], [ResultsData].CONCEN, [ResultsData].LOD, [ResultsData].CONUNIT, [ResultsData].ANNOTATE, 
      [ResultsData].[QUANTITATE], [ResultsData].MEAN, SampleData.COMMTYPE, SampleData.VARIETY, SampleData.CLAIM, 
      SampleData.DISTTYPE, SampleData.ORIGIN,   
      [PDP].[dbo].[Country_LU].[DESCRIP] As [Country], [ORIGST] As [State], 
      SampleData.QUANTITY,  [EPATOL] FROM ResultsData
      
      INNER JOIN SampleData ON [ResultsData].SAMPLE_PK = [SampleData].SAMPLE_PK 
      
      INNER JOIN [PDP].[dbo].[PestCode_LU] on [PDP].[dbo].[ResultsData].[PESTCODE] = [PDP].[dbo].[PestCode_LU].[PESTCODE]
      LEFT JOIN [PDP].[dbo].[Country_LU] on [PDP].[dbo].[SampleData].[COUNTRY] = [PDP].[dbo].[Country_LU].[COUNTRY]
	  LEFT JOIN [PDP].[dbo].[Tolerance_LU] ON [PDP].[dbo].[ResultsData].[PDP_YEAR] = [PDP].[dbo].[Tolerance_LU].[PDP_YEAR] AND [PDP].[dbo].[ResultsData].[PESTCODE] = [PDP].[dbo].[Tolerance_LU].[PESTCODE] AND [PDP].[dbo].[ResultsData].[COMMOD] = [PDP].[dbo].[Tolerance_LU].[COMMOD]
      where {0} and {1} and {2} {3}", commoditiesCondition, pesticidesCondition, yearsCondition, resultOptionCondition);

            SqlCommand command = new SqlCommand(sql);

            try
            {
                command.Connection = _connection;

                _connection.Open();

                var reader = await command.ExecuteReaderAsync(CommandBehavior.CloseConnection);

                DataTable table = new DataTable();
                table.Load(reader);

                foreach (DataRow row in table.Rows)
                {
                    SampleResultModel sampleResult = new SampleResultModel
                    {
                        SampleId = row["SampleID"].ToString(),
                        Commodity = row["COMMOD"].ToString(),
                        Pestcode = row["PESTCODE"].ToString(),
                        PesticideName = row["Pesticide Name"].ToString(),
                        Concentration = float.Parse(row["CONCEN"].ToString()),
                        Lod = float.Parse(row["LOD"].ToString()),
                        Pp = row["CONUNIT"].ToString(),
                        Annotate = row["ANNOTATE"].ToString(),
                        Quantitate = row["QUANTITATE"].ToString(),
                        Mean = row["MEAN"].ToString(),
                        CommodityType = row["COMMTYPE"].ToString(),
                        Variety = row["VARIETY"].ToString(),
                        CommodityClaim = row["CLAIM"].ToString(),
                        FacilityType = row["DISTTYPE"].ToString(),
                        Origin = row["ORIGIN"].ToString(),
                        Country = row["Country"].ToString(),
                        State = row["STATE"].ToString(),
                        Quantity = row["QUANTITY"].ToString(),
                        Tol = row["EPATOL"].ToString()
                    };

                    results.Add(sampleResult);
                }
            }
            catch (Exception ex)
            {
                throw;
            }

            return results;
        }

        public async Task<IEnumerable<SummaryNdLoadModel>> GetSummaryOfNdLodsAsync(IEnumerable<CommodityModel> commodities,
                                                                                        IEnumerable<PesticideModel> pesticides,
                                                                                        IEnumerable<TestClassModel> testClasses,
                                                                                         IEnumerable<YearModel> years)
        {
            var results = new List<SummaryNdLoadModel>();

            string pesticidesCondition = string.Empty;
            if (testClasses.Any())
            {
                pesticidesCondition = string.Format("[ResultsData].testclass in ('{0}')", string.Join("', '", testClasses.Select(c => c.TestClass)));
            }
            else
            {
                pesticidesCondition = string.Format("[ResultsData].pestcode in ('{0}')", string.Join("', '", pesticides.Select(c => c.PesticideCode)));
            }

            string commoditiesCondition = string.Format("[ResultsData].commod in ('{0}')", string.Join("', '", commodities.Select(c => c.Commodity)));

            string yearsCondition = string.Format("[ResultsData].PDP_Year in ('{0}')", string.Join("', '", years.Select(c => c.Year)));


            string sql = string.Format(@"SELECT top 100000 ResultsData.PESTCODE as PESTCODE, ResultsData.COMMOD as COMMOD, ResultsData.LAB as LAB, ResultsData.LOD as LOD, 
                      ResultsData.CONUNIT as CONUNIT, Count(*) AS RowCnt,
                      PestCode_LU].[Descrip] as [Pesticide Name], [Commod_LU].[Descript] AS [Commodity Name],                    
                      FROM ResultsData
                      --LEFT JOIN CountryRef ON SampleData.COUNTRY = CountryRef.COUNTRY_CODE;
                      INNER JOIN CommodityRef ON ResultsData.COMMOD = CommodityRef.COMMOD
                      INNER JOIN PesticideRef ON ResultsData.PESTCODE = PesticideRef.PESTCODE
                      where {0} and {1} AND (MEAN Not In ('O','A','R'))
                      GROUP BY ResultsData.PESTCODE, ResultsData.COMMOD, ResultsData.LAB, ResultsData.LOD, ResultsData.CONUNIT, PesticideRef.pest_name, CommodityRef.commod_name
                      ORDER BY ResultsData.PESTCODE, ResultsData.COMMOD, LAB, LOD", commoditiesCondition, pesticidesCondition, yearsCondition);

            SqlCommand command = new SqlCommand(sql);

            try
            {
                command.Connection = _connection;

                _connection.Open();

                var reader = await command.ExecuteReaderAsync(CommandBehavior.CloseConnection);

                DataTable table = new DataTable();
                table.Load(reader);

                foreach (DataRow row in table.Rows)
                {
                    SummaryNdLoadModel entry = new SummaryNdLoadModel
                    {
                        Commodity = row["COMMOD_NAME"].ToString(),
                        PesticideName = row["PEST_NAME"].ToString(),
                        TestLab = row["LAB"].ToString(),
                        ReportedLod = float.Parse(row["LOD"].ToString()),
                        UnitPp = row["CONUNIT"].ToString(),
                        NumberOfSamples = int.Parse(row["RowCnt"].ToString())
                    };

                    results.Add(entry);
                }
            }
            catch (Exception ex)
            {
                throw;
            }

            return results;
        }

        public async Task<IEnumerable<SummaryOfFindingsModel>> GetSummaryOfFindingsAsync(IEnumerable<CommodityModel> commodities,
                                                                                        IEnumerable<PesticideModel> pesticides,
                                                                                        IEnumerable<TestClassModel> testClasses,
                                                                                         IEnumerable<YearModel> years)
        {
            var results = new List<SummaryOfFindingsModel>();

            string pesticidesCondition = string.Empty;
            if (testClasses.Any())
            {
                pesticidesCondition = string.Format("[ResultsData].testclass in ('{0}')", string.Join("', '", testClasses.Select(c => c.TestClass)));
            }
            else
            {
                pesticidesCondition = string.Format("[ResultsData].pestcode in ('{0}')", string.Join("', '", pesticides.Select(c => c.PesticideCode)));
            }

            string commoditiesCondition = string.Format("[ResultsData].commod in ('{0}')", string.Join("', '", commodities.Select(c => c.Commodity)));

            string yearsCondition = string.Format("[ResultsData].PDP_Year in ('{0}')", string.Join("', '", years.Select(c => c.Year)));


            //string sql = string.Format(@"SELECT top 100000
            //            PesticideRef.PEST_NAME,
            //            CommodityRef.COMMOD_NAME, q2.SampCnt,
            //            q1.HitsCnt, Round([HitsCnt]/[SampCnt]*100,1) AS PctHits, 
            //            q1.MinConcen, q1.MaxConcen, 
            //            q1.AvgConcen,
            //            LTRIM(str([MinLOD], 5, 3)) + ' - ' + LTRIM(str([MaxLOD], 5, 3)) AS LODRange,
            //            q2.MinCONUNIT AS CONUNIT
            //            FROM 

            //            (SELECT top 100000 ResultsData.PESTCODE, ResultsData.COMMOD,  
            //            Count(*) AS HitsCnt,
            //            Min(CONCEN) AS MinConcen, Max(CONCEN) AS MaxConcen,
            //            Round(Avg(CONCEN),4) AS AvgConcen
            //            FROM ResultsData
            //            where {0} and {1} AND [ResultsData].CONCEN > 0
            //            GROUP BY PESTCODE, COMMOD) q1

            //            right join

            //            (SELECT top 100000 ResultsData.PESTCODE, ResultsData.COMMOD,  
            //            Count(*) AS SampCnt,
            //            Min(LOD) AS MinLOD, Max(LOD) AS MaxLOD, Min(CONUNIT) AS MinCONUNIT 
            //            FROM ResultsData
            //            where {0} and {1}
            //            GROUP BY PESTCODE, COMMOD) q2

            //            on q1.COMMOD = q2.COMMOD and q1.PESTCODE = q2.pestcode

            //          INNER JOIN CommodityRef ON q2.COMMOD = CommodityRef.COMMOD
            //          INNER JOIN PesticideRef ON q2.PESTCODE = PesticideRef.PESTCODE
            //          ORDER BY PEST_NAME, COMMOD_NAME", commoditiesCondition, pesticidesCondition, yearsCondition);


            string sql = string.Format(@"SELECT Distinct top 100000  [PDP].[dbo].[PestCode_LU].[Descrip] as [PEST_NAME], [PDP].[dbo].[Commod_LU].[Descript] AS [COMMOD_NAME], 
		Count([CONCEN]) As [#_of_Samples_Analyzed], COUNT(CASE WHEN [CONCEN]>0 THEN 1 END) As [#_of_Samples_w/Detects],
		CASE WHEN COUNT(CASE WHEN [CONCEN]>0 THEN 1 END) > 0 THEN LTrim(Str(CONVERT(decimal(5,1), COUNT(CASE WHEN [CONCEN]>0 THEN 1 END)) / CONVERT(decimal(5,1), Count([CONCEN])) * 100, 5,1)) END AS [%_of_Samples_w/Detects], 
		Min(NULLIF ([CONCEN], 0)) As [Min_Detect], Max(NULLIF ([CONCEN], 0)) As [Max_Detect], 
		CASE WHEN Min([LOD])= MAX([LOD]) THEN CAST(MIN([LOD]) AS Varchar(10)) ELSE CAST(MIN([LOD]) AS Varchar(10)) + ' - ' + CAST(MAX([LOD]) AS Varchar(10)) END As [Range_of_LODs], Min([CONUNIT]) AS [Unit_pp_],
		CASE WHEN MAX([EPATOL]) in ('NT','NA','NR','SU','EX','EX2','EX3') and MIN([EPATOL]) NOT IN ('NT','NA','NR','SU','EX','EX2','EX3') THEN MIN([EPATOL]) ELSE MAX([EPATOL]) END As [EPATOL]
        FROM [PDP].[dbo].[ResultsData] 
        INNER JOIN [PDP].[dbo].[PestCode_LU] on [PDP].[dbo].[ResultsData].[PESTCODE] = [PDP].[dbo].[PestCode_LU].[PESTCODE]	
        INNER JOIN [PDP].[dbo].[Commod_LU] ON [PDP].[dbo].[ResultsData].[COMMOD] = [PDP].[dbo].[Commod_LU].[COMMOD]
        LEFT JOIN [PDP].[dbo].[Tolerance_LU] ON [PDP].[dbo].[ResultsData].[PDP_YEAR] = [PDP].[dbo].[Tolerance_LU].[PDP_YEAR] AND [PDP].[dbo].[ResultsData].[PESTCODE] = [PDP].[dbo].[Tolerance_LU].[PESTCODE] AND [PDP].[dbo].[ResultsData].[COMMOD] = [PDP].[dbo].[Tolerance_LU].[COMMOD]
        WHERE {0} and {1} and {2} 
        GROUP BY [PDP].[dbo].[PestCode_LU].[Descrip], [PDP].[dbo].[Commod_LU].[Descript]
        ORDER BY [PDP].[dbo].[PestCode_LU].[Descrip], [PDP].[dbo].[Commod_LU].[Descript]", commoditiesCondition, pesticidesCondition, yearsCondition);
            SqlCommand command = new SqlCommand(sql);

            try
            {
                command.Connection = _connection;

                _connection.Open();

                var reader = await command.ExecuteReaderAsync(CommandBehavior.CloseConnection);

                DataTable table = new DataTable();
                table.Load(reader);

                foreach (DataRow row in table.Rows)
                {
                    SummaryOfFindingsModel entry = new SummaryOfFindingsModel
                    {
                        PesticideName = row["PEST_NAME"].ToString(),
                        Commodity = row["COMMOD_NAME"].ToString(),
                        SamplesDetects = int.Parse(row["#_of_Samples_w/Detects"].ToString()),
                        SamplesNumber = int.Parse(row["#_of_Samples_Analyzed"].ToString()),
                        //AvgValue = string.IsNullOrEmpty(row["AVGCONCEN"].ToString()) ? (float?)null : float.Parse(row["AVGCONCEN"].ToString()),
                        MaxValue = string.IsNullOrEmpty(row["Max_Detect"].ToString()) ? (float?)null : float.Parse(row["Max_Detect"].ToString()),
                        MinValue = string.IsNullOrEmpty(row["Min_Detect"].ToString()) ? (float?)null : float.Parse(row["Min_Detect"].ToString()),
                        RangeOfLods = row["Range_of_LODs"].ToString(),
                        //SamplesDetects = string.IsNullOrEmpty(row["HitsCnt"].ToString()) ? (int?)null : int.Parse(row["HitsCnt"].ToString()),
                        SampleDetectsPercent = string.IsNullOrEmpty(row["%_of_Samples_w/Detects"].ToString()) ? (float?)null : float.Parse(row["%_of_Samples_w/Detects"].ToString()),
                        UnitPp = row["Unit_pp_"].ToString(),
                        EPATOL = row["EPATOL"].ToString()
                    };

                    results.Add(entry);
                }
            }
            catch (Exception ex)
            {
                throw;
            }

            return results;
        }

        public async Task<IEnumerable<SummaryOfFindingsByLodModel>> GetSummaryOfFindingsByLodAsync(IEnumerable<CommodityModel> commodities,
                                                                                        IEnumerable<PesticideModel> pesticides,
                                                                                        IEnumerable<TestClassModel> testClasses,
                                                                                         IEnumerable<YearModel> years)
        {
            var results = new List<SummaryOfFindingsByLodModel>();

            string pesticidesCondition = string.Empty;
            if (testClasses.Any())
            {
                pesticidesCondition = string.Format("[ResultsData].testclass in ('{0}')", string.Join("', '", testClasses.Select(c => c.TestClass)));
            }
            else
            {
                pesticidesCondition = string.Format("[ResultsData].pestcode in ('{0}')", string.Join("', '", pesticides.Select(c => c.PesticideCode)));
            }

            string commoditiesCondition = string.Format("[ResultsData].commod in ('{0}')", string.Join("', '", commodities.Select(c => c.Commodity)));

            string yearsCondition = string.Format("[ResultsData].PDP_Year in ('{0}')", string.Join("', '", years.Select(c => c.Year)));

            string sql = string.Format(@"SELECT top 100000
                        PesticideRef.PEST_NAME,
                        CommodityRef.COMMOD_NAME, q2.SampCnt,
                        q2.LOD, q2.CONUNIT,
                        q1.HitsCnt, Round([HitsCnt]/[SampCnt]*100,1) AS PctHits, 
                        q1.MinConcen, q1.MaxConcen, 
                        q1.AvgConcen
                        FROM 

                        (SELECT top 100000 PESTCODE, COMMOD, LOD, CONUNIT, Count(*) AS HitsCnt,  
                        Min(CONCEN) AS MinConcen, Max(CONCEN) AS MaxConcen,
                        Round(Avg(CONCEN),4) AS AvgConcen
                        FROM ResultsData
                        where {0} and {1} AND [ResultsData].CONCEN > 0
                        GROUP BY PESTCODE, COMMOD, LOD, CONUNIT) q1

                        right join

                        (SELECT top 100000 ResultsData.PESTCODE, ResultsData.COMMOD, LOD, CONUNIT, 
                        Count(*) AS SampCnt
                        FROM ResultsData
                        where {0} and {1}
                        GROUP BY PESTCODE, COMMOD, LOD, CONUNIT) q2

                        on q1.COMMOD = q2.COMMOD and q1.PESTCODE = q2.pestcode and
                        q1.LOD = q2.LOD and q1.CONUNIT = q2.CONUNIT

                      INNER JOIN CommodityRef ON q2.COMMOD = CommodityRef.COMMOD
                      INNER JOIN PesticideRef ON q2.PESTCODE = PesticideRef.PESTCODE
                      ORDER BY PEST_NAME, COMMOD_NAME", commoditiesCondition, pesticidesCondition, yearsCondition);

            SqlCommand command = new SqlCommand(sql);

            try
            {
                command.Connection = _connection;

                _connection.Open();

                var reader = await command.ExecuteReaderAsync(CommandBehavior.CloseConnection);

                DataTable table = new DataTable();
                table.Load(reader);

                foreach (DataRow row in table.Rows)
                {
                    SummaryOfFindingsByLodModel entry = new SummaryOfFindingsByLodModel
                    {
                        PesticideName = row["PEST_NAME"].ToString(),
                        Commodity = row["COMMOD_NAME"].ToString(),
                        SamplesNumber = int.Parse(row["SampCnt"].ToString()),
                        AvgValue = string.IsNullOrEmpty(row["AVGCONCEN"].ToString()) ? (float?)null : float.Parse(row["AVGCONCEN"].ToString()),
                        MaxValue = string.IsNullOrEmpty(row["MAXCONCEN"].ToString()) ? (float?)null : float.Parse(row["MAXCONCEN"].ToString()),
                        MinValue = string.IsNullOrEmpty(row["MINCONCEN"].ToString()) ? (float?)null : float.Parse(row["MINCONCEN"].ToString()),
                        SamplesDetects = string.IsNullOrEmpty(row["HitsCnt"].ToString()) ? (int?)null : int.Parse(row["HitsCnt"].ToString()),
                        SampleDetectsPercent = string.IsNullOrEmpty(row["PctHits"].ToString()) ? (float?)null : float.Parse(row["PctHits"].ToString()),
                        UnitPp = row["CONUNIT"].ToString(),
                        DistinctLod = float.Parse(row["LOD"].ToString())
                    };

                    results.Add(entry);
                }
            }
            catch (Exception ex)
            {
                throw;
            }

            return results;
        }

        public async Task<IEnumerable<SummaryOfFindingsByCountryModel>> GetSummaryOfFindingsByCountryOfOriginAsync(IEnumerable<CommodityModel> commodities,
                                                                                        IEnumerable<PesticideModel> pesticides,
                                                                                        IEnumerable<TestClassModel> testClasses,
                                                                                         IEnumerable<YearModel> years)
        {
            var results = new List<SummaryOfFindingsByCountryModel>();

            string pesticidesCondition = string.Empty;
            if (testClasses.Any())
            {
                pesticidesCondition = string.Format("[ResultsData].testclass in ('{0}')", string.Join("', '", testClasses.Select(c => c.TestClass)));
            }
            else
            {
                pesticidesCondition = string.Format("[ResultsData].pestcode in ('{0}')", string.Join("', '", pesticides.Select(c => c.PesticideCode)));
            }

            string commoditiesCondition = string.Format("[ResultsData].commod in ('{0}')", string.Join("', '", commodities.Select(c => c.Commodity)));

            string yearsCondition = string.Format("[ResultsData].PDP_Year in ('{0}')", string.Join("', '", years.Select(c => c.Year)));


            string sql = string.Format(@"SELECT Distinct [PDP].[dbo].[PestCode_LU].[Descrip] as [PEST_NAME], [PDP].[dbo].[Commod_LU].[Descript] AS [COMMOD_NAME], [ORIGIN] As [Origin],
		    CASE WHEN [ORIGIN] = 1 THEN 'U.S.' ELSE [PDP].[dbo].[Country_LU].[DESCRIP] END As [Country],  
		    Count([CONCEN]) As [#_of_Samples_Analyzed], COUNT(CASE WHEN [CONCEN]>0 THEN 1 END) As [#_of_Samples_w/Detects],
		    CASE WHEN COUNT(CASE WHEN [CONCEN]>0 THEN 1 END) > 0 THEN LTrim(Str(CONVERT(decimal(5,1), COUNT(CASE WHEN [CONCEN]>0 THEN 1 END)) / CONVERT(decimal(5,1), Count([CONCEN])) * 100, 5,1)) END AS [%_of_Samples_w/Detects], 
		    Min(NULLIF ([CONCEN], 0)) As [Min_Detect], Max(NULLIF ([CONCEN], 0)) As [Max_Detect], 
		    CASE WHEN Min([LOD])= MAX([LOD]) THEN CAST(MIN([LOD]) AS Varchar(10)) ELSE CAST(MIN([LOD]) AS Varchar(10)) + ' - ' + CAST(MAX([LOD]) AS Varchar(10)) END As [Range_of_LODs], Min([CONUNIT]) AS [Unit_pp_],
		    CASE WHEN MAX([EPATOL]) in ('NT','NA','NR','SU','EX','EX2','EX3') and MIN([EPATOL]) NOT IN ('NT','NA','NR','SU','EX','EX2','EX3') THEN MIN([EPATOL]) ELSE MAX([EPATOL]) END As [EPATOL]
            FROM [PDP].[dbo].[ResultsData] 
            INNER JOIN [PDP].[dbo].[SampleData] on [PDP].[dbo].[ResultsData].[SAMPLE_PK] = [PDP].[dbo].[SampleData].[SAMPLE_PK]	
            INNER JOIN [PDP].[dbo].[PestCode_LU] on [PDP].[dbo].[ResultsData].[PESTCODE] = [PDP].[dbo].[PestCode_LU].[PESTCODE]	
            INNER JOIN [PDP].[dbo].[Commod_LU] ON [PDP].[dbo].[ResultsData].[COMMOD] = [PDP].[dbo].[Commod_LU].[COMMOD]
            LEFT JOIN [PDP].[dbo].[Country_LU] on [PDP].[dbo].[SampleData].[COUNTRY] = [PDP].[dbo].[Country_LU].[COUNTRY]
            LEFT JOIN [PDP].[dbo].[Tolerance_LU] ON [PDP].[dbo].[ResultsData].[PDP_YEAR] = [PDP].[dbo].[Tolerance_LU].[PDP_YEAR] AND [PDP].[dbo].[ResultsData].[PESTCODE] = [PDP].[dbo].[Tolerance_LU].[PESTCODE] AND [PDP].[dbo].[ResultsData].[COMMOD] = [PDP].[dbo].[Tolerance_LU].[COMMOD]
            WHERE  {0} and {1} and {2} 
            GROUP BY [PDP].[dbo].[PestCode_LU].[Descrip], [PDP].[dbo].[Commod_LU].[Descript], [ORIGIN], CASE WHEN [ORIGIN] = 1 THEN 'U.S.' ELSE [PDP].[dbo].[Country_LU].[DESCRIP] END
            ORDER BY [PDP].[dbo].[PestCode_LU].[Descrip], [PDP].[dbo].[Commod_LU].[Descript], [ORIGIN], CASE WHEN [ORIGIN] = 1 THEN 'U.S.' ELSE [PDP].[dbo].[Country_LU].[DESCRIP] END
            ", commoditiesCondition, pesticidesCondition, yearsCondition);

            SqlCommand command = new SqlCommand(sql);

            try
            {
                command.Connection = _connection;

                _connection.Open();

                var reader = await command.ExecuteReaderAsync(CommandBehavior.CloseConnection);

                DataTable table = new DataTable();
                table.Load(reader);

                foreach (DataRow row in table.Rows)
                {
                    SummaryOfFindingsByCountryModel entry = new SummaryOfFindingsByCountryModel
                    {
                        PesticideName = row["PEST_NAME"].ToString(),
                        Origin = int.Parse(row["ORIGIN"].ToString()),
                        Country = row["COUNTRY"].ToString(),
                        Commodity = row["COMMOD_NAME"].ToString(),
                        SamplesNumber = int.Parse(row["#_of_Samples_Analyzed"].ToString()),
                        //AvgValue = string.IsNullOrEmpty(row["AVGCONCEN"].ToString()) ? (float?)null : float.Parse(row["AVGCONCEN"].ToString()),
                        MaxValue = string.IsNullOrEmpty(row["Max_Detect"].ToString()) ? (float?)null : float.Parse(row["Max_Detect"].ToString()),
                        MinValue = string.IsNullOrEmpty(row["Min_Detect"].ToString()) ? (float?)null : float.Parse(row["Min_Detect"].ToString()),
                        RangeOfLods = row["Range_of_LODs"].ToString(),
                        SamplesDetects = string.IsNullOrEmpty(row["#_of_Samples_w/Detects"].ToString()) ? (int?)null : int.Parse(row["#_of_Samples_w/Detects"].ToString()),
                        SampleDetectsPercent = string.IsNullOrEmpty(row["%_of_Samples_w/Detects"].ToString()) ? (float?)null : float.Parse(row["%_of_Samples_w/Detects"].ToString()),
                        UnitPp = row["Unit_pp_"].ToString(),
                        EPATOL = row["EPATOL"].ToString()
                    };

                    results.Add(entry);
                }
            }
            catch (Exception ex)
            {
                throw;
            }

            return results;
        }

        public async Task<IEnumerable<SummaryOfFindingsByClaimModel>> GetSummaryOfFindingsByClaimAsync(IEnumerable<CommodityModel> commodities,
                                                                                        IEnumerable<PesticideModel> pesticides,
                                                                                        IEnumerable<TestClassModel> testClasses,
                                                                                         IEnumerable<YearModel> years)
        {
            var results = new List<SummaryOfFindingsByClaimModel>();

            string pesticidesCondition = string.Empty;
            if (testClasses.Any())
            {
                pesticidesCondition = string.Format("[ResultsData].testclass in ('{0}')", string.Join("', '", testClasses.Select(c => c.TestClass)));
            }
            else
            {
                pesticidesCondition = string.Format("[ResultsData].pestcode in ('{0}')", string.Join("', '", pesticides.Select(c => c.PesticideCode)));
            }

            string commoditiesCondition = string.Format("[ResultsData].commod in ('{0}')", string.Join("', '", commodities.Select(c => c.Commodity)));

            string yearsCondition = string.Format("[ResultsData].PDP_Year in ('{0}')", string.Join("', '", years.Select(c => c.Year)));


            string sql = string.Format(@"SELECT Distinct [PDP].[dbo].[PestCode_LU].[Descrip] as [PEST_NAME], [PDP].[dbo].[Commod_LU].[Descript] AS [COMMOD_NAME], 
		[PDP].[dbo].[Claim_LU].[DESCRIP] As [CLAIM],  
		Count([CONCEN]) As [#_of_Samples_Analyzed], COUNT(CASE WHEN [CONCEN]>0 THEN 1 END) As [#_of_Samples_w/Detects],
		CASE WHEN COUNT(CASE WHEN [CONCEN]>0 THEN 1 END) > 0 THEN LTrim(Str(CONVERT(decimal(5,1), COUNT(CASE WHEN [CONCEN]>0 THEN 1 END)) / CONVERT(decimal(5,1), Count([CONCEN])) * 100, 5,1)) END AS [%_of_Samples_w/Detects], 
		Min(NULLIF ([CONCEN], 0)) As [Min_Detect], Max(NULLIF ([CONCEN], 0)) As [Max_Detect], 
		CASE WHEN Min([LOD])= MAX([LOD]) THEN CAST(MIN([LOD]) AS Varchar(10)) ELSE CAST(MIN([LOD]) AS Varchar(10)) + ' - ' + CAST(MAX([LOD]) AS Varchar(10)) END As [Range_of_LODs], Min([CONUNIT]) AS [Unit_pp_],
		CASE WHEN MAX([EPATOL]) in ('NT','NA','NR','SU','EX','EX2','EX3') and MIN([EPATOL]) NOT IN ('NT','NA','NR','SU','EX','EX2','EX3') THEN MIN([EPATOL]) ELSE MAX([EPATOL]) END As [EPATOL]
        FROM [PDP].[dbo].[ResultsData] 
        INNER JOIN [PDP].[dbo].[SampleData] on [PDP].[dbo].[ResultsData].[SAMPLE_PK] = [PDP].[dbo].[SampleData].[SAMPLE_PK]	
        INNER JOIN [PDP].[dbo].[PestCode_LU] on [PDP].[dbo].[ResultsData].[PESTCODE] = [PDP].[dbo].[PestCode_LU].[PESTCODE]	
        INNER JOIN [PDP].[dbo].[Commod_LU] ON [PDP].[dbo].[ResultsData].[COMMOD] = [PDP].[dbo].[Commod_LU].[COMMOD]
        INNER JOIN [PDP].[dbo].[Claim_LU] ON [PDP].[dbo].[SampleData].[CLAIM] = [PDP].[dbo].[Claim_LU].[CLAIM]
        LEFT JOIN [PDP].[dbo].[Tolerance_LU] ON [PDP].[dbo].[ResultsData].[PDP_YEAR] = [PDP].[dbo].[Tolerance_LU].[PDP_YEAR] AND [PDP].[dbo].[ResultsData].[PESTCODE] = [PDP].[dbo].[Tolerance_LU].[PESTCODE] AND [PDP].[dbo].[ResultsData].[COMMOD] = [PDP].[dbo].[Tolerance_LU].[COMMOD]
        WHERE {0} and {1} and {2}  
        GROUP BY [PDP].[dbo].[PestCode_LU].[Descrip], [PDP].[dbo].[Commod_LU].[Descript], [PDP].[dbo].[Claim_LU].[DESCRIP] 
        ORDER BY [PDP].[dbo].[PestCode_LU].[Descrip], [PDP].[dbo].[Commod_LU].[Descript], [PDP].[dbo].[Claim_LU].[DESCRIP]
        ", commoditiesCondition, pesticidesCondition, yearsCondition);

            SqlCommand command = new SqlCommand(sql);

            try
            {
                command.Connection = _connection;

                _connection.Open();

                var reader = await command.ExecuteReaderAsync(CommandBehavior.CloseConnection);

                DataTable table = new DataTable();
                table.Load(reader);

                foreach (DataRow row in table.Rows)
                {
                    SummaryOfFindingsByClaimModel entry = new SummaryOfFindingsByClaimModel
                    {
                        PesticideName = row["PEST_NAME"].ToString(),
                        Claim = row["CLAIM"].ToString(),
                        Commodity = row["COMMOD_NAME"].ToString(),
                        SamplesNumber = int.Parse(row["#_of_Samples_Analyzed"].ToString()),
                        //AvgValue = string.IsNullOrEmpty(row["AVGCONCEN"].ToString()) ? (float?)null : float.Parse(row["AVGCONCEN"].ToString()),
                        MaxValue = string.IsNullOrEmpty(row["Max_Detect"].ToString()) ? (float?)null : float.Parse(row["Max_Detect"].ToString()),
                        MinValue = string.IsNullOrEmpty(row["Min_Detect"].ToString()) ? (float?)null : float.Parse(row["Min_Detect"].ToString()),
                        RangeOfLods = row["Range_of_LODs"].ToString(),
                        SamplesDetects = string.IsNullOrEmpty(row["#_of_Samples_w/Detects"].ToString()) ? (int?)null : int.Parse(row["#_of_Samples_w/Detects"].ToString()),
                        SampleDetectsPercent = string.IsNullOrEmpty(row["%_of_Samples_w/Detects"].ToString()) ? (float?)null : float.Parse(row["%_of_Samples_w/Detects"].ToString()),
                        UnitPp = row["Unit_pp_"].ToString(),
                        EPATOL = row["EPATOL"].ToString()
                    };

                    results.Add(entry);
                }
            }
            catch (Exception ex)
            {
                throw;
            }

            return results;
        }

        public void Dispose()
        {
            _connection.Dispose();
            _connection = null;
        }
    }
}
