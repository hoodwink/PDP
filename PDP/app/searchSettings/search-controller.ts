interface JQuery {
    jqGrid: any;
}

interface JQueryStatic {
    jgrid: any;
}

interface ISearchControllerScope extends ng.IScope {  ///new updated
    gridResul: any;                                         ///new updated
}   


module app.search {

    //export interface ISearchControllerScope extends ng.IScope {  ///new updated
    //    gridResul: any;                                         ///new updated
    //}   
   
   class SearchController {

       scope: any;
       http: ng.IHttpService;

        commodities: models.ICommodity[];
        pesticides: models.IPesticide[];
        testClasses: models.ITestClass[];
        years: models.IYear[];

        outputPreferences: models.IPreference[];
        resultsPreferences: models.IPreference[];
        //yearPreferences: models.IPreference[];

        selectedOutputPreference: models.IPreference;
        selectedResultsPreference: models.IPreference;
        //selectedYearPreference: models.IPreference;

        analyticalResults: models.IAnalyticalResult[];
        sampleResults: models.ISampleResult[];
        summaryOfNd: models.ISummaryNd[];
        summaryOfFindings: models.ISummaryOfFindings[];
        summaryOfFindingsByLod: models.ISummaryOfFindingsByLod[];
        summaryOfFindingsByCountry: models.ISummaryOfFindingsByCountry[];
        summaryOfFindingsByClaim: models.ISummaryOfFindingsByClaim[];

        showSearchPanel: boolean;
        showResultsPanel: boolean;
        showLoading: boolean;

        checkAllPesticides: boolean;
        checkSpecificTestClass: boolean;
        checkAllCommodities: boolean;
        checkAllYears: boolean;

        //static $inject = ['$scope', '$http'];

        //static AngularDependencies = ['$scope', SearchController];

        constructor($scope: ISearchControllerScope,  $http: ng.IHttpService, private SearchService: services.ISearchService) {

            //this.scope = $scope;// $scope: ng.IScope,
            //$(".loading").hide();
           this.showLoading = true;
            this.scope = $scope;
            this.http = $http;

            this.load();

            this.outputPreferences = [
                {
                    id: 1,
                    preference: 'Analytical Results'
                },
                {
                    id: 2,
                    preference: 'Sample/Results'
                },
                //{
                //    id: 3,
                //    preference: 'Summary of ND LODs'
                //},
                {
                    id: 4,
                    preference: 'Summary of Findings'
                },
                //{
                //    id: 5,
                //    preference: 'Summary Of Findings by LOD'
                //},
                {
                    id: 6,
                    preference: 'Summary of Findings by Origin'
                },
                {
                    id: 7,
                    preference: 'Summary of Findings by Claim'
                }
            ];

            this.selectedOutputPreference = this.outputPreferences[0];

            this.resultsPreferences = [
                {
                    id: 1,
                    preference: 'All Positive Detects + Non-Detects'
                },
                {
                    id: 2,
                    preference: 'Positive Detects Only'
                },
                //{
                //    id: 3,
                //    preference: 'Non-Detects Only'
                //},
                {
                    id: 4,
                    preference: 'Presumptive Tolerance Violations Only'
                }
            ];

            this.selectedResultsPreference = this.resultsPreferences[0];

            //this.yearPreferences = [
            //    {
            //        id: 1,
            //        preference: '2010'
            //    }
            //];

            //this.selectedYearPreference = this.yearPreferences[0];

            this.checkAllCommodities = true;
            this.checkAllPesticides = true;
            this.checkSpecificTestClass = false;
            this.checkAllYears = true;
            this.showLoading = false;
            this.makeSearchPanelVisible();
        }

        specificClassChange(): void {
            this.allPesticidesChange(this.checkSpecificTestClass);
        }

        allPesticidesChange(specificClass?: boolean): void {
            if (specificClass == true) {
                this.checkAllPesticides = false;
            } else {
                this.checkSpecificTestClass = false;
                for (var i = 0; i < this.testClasses.length; i++) {
                    this.testClasses[i].isChecked = false;
                }
            }

            for (var i = 0; i < this.pesticides.length; i++) {
                this.pesticides[i].isChecked = this.checkAllPesticides;
            }
        }

        allCommoditiesChange(): void {
            for (var i = 0; i < this.commodities.length; i++) {
                this.commodities[i].isChecked = this.checkAllCommodities;
            }
        }

        allYearsChange(): void {
            for (var i = 0; i < this.years.length; i++) {
                this.years[i].isChecked = this.checkAllYears;
            }
        }

        search(): void {

            //$(".loading").show();
            this.showLoading = true;
            var checkedPredicate = (item: models.IEntity) => {
                return item.isChecked;
            };
            //$sc.loading = true;
            var checkedCommodities = <models.ICommodity[]>_.filter(this.commodities, checkedPredicate);
            var checkedPesticides = <models.IPesticide[]>_.filter(this.pesticides, checkedPredicate);
            var checkedTestClasses = <models.ITestClass[]>_.filter(this.testClasses, checkedPredicate);
            var checkedYears = <models.IYear[]>_.filter(this.years, checkedPredicate);

            switch (this.selectedOutputPreference.id) {
                case 1:
                    this.getAnalyticalResults(checkedCommodities, checkedPesticides, checkedTestClasses, checkedYears, this.selectedResultsPreference.id);
                    break;
                case 2:
                    this.getSampleResults1(checkedCommodities, checkedPesticides, checkedTestClasses, checkedYears, this.selectedResultsPreference.id);
                    break;
                case 3:
                    this.getSummaryOfNdLods(checkedCommodities, checkedPesticides, checkedTestClasses, checkedYears);
                    break;
                case 4:
                    this.getSummaryOfFindings(checkedCommodities, checkedPesticides, checkedTestClasses, checkedYears);
                    break;
                case 5:
                    this.getSummaryOfFindingsByLod(checkedCommodities, checkedPesticides, checkedTestClasses, checkedYears);
                    break;
                case 6:
                    this.getSummaryOfFindingsByCountryOfOrigin(checkedCommodities, checkedPesticides, checkedTestClasses, checkedYears);
                    break;
                case 7:
                    this.getSummaryOfFindingsByClaim(checkedCommodities, checkedPesticides, checkedTestClasses, checkedYears); 
                    break;
                default:
                   // this.getAnalyticalResults(checkedCommodities, checkedPesticides, checkedTestClasses, checkedYears, this.selectedResultsPreference.id);
            }

            //$(".loading").hide();
            //this.showLoading = false;
        }

        private getAnalyticalResults(commodities: models.ICommodity[], pesticides: models.IPesticide[], testClasses: models.ITestClass[], years: models.IYear[], resultOptionId: number): void {
            this.SearchService.getAnalyticalResults(commodities, pesticides, testClasses, years, resultOptionId)
                .then((analyticalResults: models.IAnalyticalResult[]): void => {
                    this.analyticalResults = analyticalResults;

                   // this.analyticalResults = this.getAnalatycalData(commodities, pesticides, testClasses, resultOptionId);

             //this.getAnalatycalData(commodities, pesticides, testClasses, resultOptionId);
                    // , page, limit, sortBy, direction, searchString
                        //data: this.getAnalatycalData(commodities, pesticides, testClasses, resultOptionId), //"/app/services/SearchService/getAnalyticalResults",
                        //data: 'api/Info/GetAnalyticalResults/',
                    //this.showLoading = true;
                    this.showResultsPanel = true;
                    this.showSearchPanel = false;
                    
                    //$(".loading").show();
                    $.jgrid.defaults.responsive = true;
                    $.jgrid.defaults.styleUI = 'Bootstrap';
                    $("#analyticalResultsGrid").jqGrid({
                        datatype: "local",
                        data: this.analyticalResults, 
                        height: 340,
                        autowidth: true,
                        shrinkToFit: false,
                        width: 780,
                        rowNum: 100,
                        pager: "#analyticalResultsGridPager",
                        colModel: [
                            { label: 'Sample ID#', name: 'sampleId', width: 185, frozen: true },
                            { label: 'Com', name: 'commodity', width: 50 },
                            { label: 'Pest Code', name: 'pesticideCode', width: 50  },
                            { label: 'Pest Name', name: 'pesticideName', width: 140 },
                            { label: 'Tst', name: 'testClass', width: 45 },
                            { label: 'Concen', name: 'concentration', width: 75 },
                            { label: 'LOD', name: 'lod', width: 75 },
                            { label: 'pp_', name: 'pp', width: 50 },
                            { label: 'Co1', name: 'confirmationMethod', width: 50 },
                            { label: 'Co2', name: 'confirmationMethod2', width: 50 },
                            { label: 'Ann', name: 'annotate', width: 50 },
                            { label: 'Qua', name: 'quantitate', width: 50 },
                            { label: 'Mean', name: 'mean', width: 50 },
                            { label: 'Ext', name: 'extract', width: 50 },
                            { label: 'Det', name: 'determinative', width: 50 },
                            { label: 'Tol (ppm)', name: 'tol', width: 60 }
                        ],
                        viewrecords: true, 
                        toolbarfilter: true,
                        caption: "<p align='center'><b>Analytical Results</b></p>"
                    });

                });
            //$(".loading").hide();
        }

        private getAnalatycalData(commodities: models.ICommodity[], pesticides: models.IPesticide[], testClasses: models.ITestClass[], years: models.IYear[], resultOptionId: number): void {
            this.SearchService.getAnalyticalResults(commodities, pesticides, testClasses, years, resultOptionId)
                .then((analyticalResults: models.IAnalyticalResult[]): void => {
                    this.analyticalResults = analyticalResults;
                    //return this.analyticalResults;
                    //return analyticalResults;
                });
            //return this.analyticalResults;
        }
            
        private getSampleResults1(commodities: models.ICommodity[], pesticides: models.IPesticide[], testClasses: models.ITestClass[], years: models.IYear[], resultOptionId: number): void {
            
            this.showResultsPanel = true;
            this.showSearchPanel = false;
             
            var paginationOptions = {
                sortColumns: [],
                filterColumns: []
            };

            //this.$scope.gridResul = {};

           //(<any>$('#grid1')).uiGrid({
            //alert((<any>$('#grid1')).grid);
            this.scope.gridResul = {
                //enableHorizontalScrollbar: 0,
                enableFiltering: true,
                enableGridMenu: true,
                exporterMenuCsv: true,
                paginationPageSize: 500,
                useExternalPagination: true,
                useExternalSorting: true,

                columnDefs: [
                    { field: 'PDP_Sample_ID', displayName: 'Sample Id', visible: false, enableSorting: false },
                    { field: 'PdpYear', displayName: 'Pdp Yr', filter: { term: '2014' }, width: 80 },
                    { field: 'Com', width: 70 },
                    { field: 'Pest_Code', width: 105 },
                    { field: 'Pesticide_Name', displayName: 'Pest Name', width: 100 },
                    { field: 'Concen', width: 80 },
                    { field: 'LOD', visible: false },
                    { field: 'pp_' },
                    { field: 'Ann', visible: false, enableSorting: false, enableFiltering: false },
                    { field: 'Qua' },
                    { field: 'Mean', enableFiltering: false },
                    { field: 'Type', enableFiltering: false },
                    { field: 'Variety', width: 75 },
                    { field: 'Clm', enableSorting: false, enableFiltering: false },
                    { field: 'Fac', enableSorting: false, enableFiltering: false },
                    { field: 'Origin', visible: false, enableSorting: false, enableFiltering: false },
                    { field: 'Country', enableSorting: false, enableFiltering: false },
                    { field: 'State', enableSorting: false, enableFiltering: false },
                    { field: 'Qty', enableSorting: false, enableFiltering: false },
                    { field: 'Tol_ppm', enableSorting: false, enableFiltering: false }
                ],
                exporterAllDataFn: function () {
                    return getPage(1, this.scope.gridResul.totalItems, paginationOptions)
                        .then(function () {
                            //$scope.gridResul.useExternalPagination = false;
                            //$scope.gridResul.useExternalSorting = false;
                            getPage = null;
                        });
                },
                onRegisterApi: function (gridApi) {
                    this.scope.gridApi = gridApi;
                    this.scope.gridApi.core.on.sortChanged(this.scope, function (grid, sortColumns) {
                        if (getPage) {
                            paginationOptions.sortColumns = [];
                            if (sortColumns.length > 0) {
                                sortColumns.forEach(function (col) {
                                    paginationOptions.sortColumns.push(col.name + '#' + col.sort.direction);
                                });
                            }
                            getPage(grid.options.paginationCurrentPage, grid.options.paginationPageSize, paginationOptions);
                        }
                    });
                    this.scope.gridApi.core.on.filterChanged(this.scope, function () {
                        if (getPage) {
                            paginationOptions.filterColumns = [];

                            var grid = this.grid;
                            angular.forEach(grid.columns, function (column) {
                                var fieldName = column.field;
                                var value = column.filters[0].term;
                                if (value) {
                                    paginationOptions.filterColumns.push(fieldName + '#' + value)
                                }
                            });
                            if (paginationOptions.filterColumns.length < 1) {
                                //alert('should have at least one filter');
                            }
                            getPage(grid.options.paginationCurrentPage, grid.options.paginationPageSize, paginationOptions);
                        }
                    });
                    gridApi.pagination.on.paginationChanged(this.scope, function (newPage, pageSize) {
                        if (getPage) {
                            getPage(newPage, pageSize, paginationOptions);
                        }
                    });

                    gridApi.edit.on.afterCellEdit(this.scope, function (rowEntity, colDef, newValue, oldValue) {
                        editCellPut(rowEntity, colDef, newValue, oldValue);
                        //$scope.msg = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue ;
                        this.scope.apply();
                    });
                },
                gridMenuCustomItems: [{
                    title: 'Export Filtered Data As CSV',
                    order: 100,
                    action: function ($event) {
                        //var sUrl = "http://PdpApi/api/ResDataStream?Filter=" + encodeURIComponent(paginationOptions.filterColumns);
                        //window.open(sUrl, '_blank', '');
                    }
                }]
            };

            var getPage = function (curPage, pageSize, paginationOptions) {
                var firstRow = (curPage - 1) * pageSize;
                var url = "http://PdpApi/api/ResultsData?FirstRow=" + firstRow + "&PageSize=" + pageSize;
                if (paginationOptions.filterColumns) {
                    //alert(sortColumns + '+' + encodeURIComponent(sortColumns));
                    url += "&Filter=" + encodeURIComponent(paginationOptions.filterColumns);
                }
                if (paginationOptions.sortColumns) {
                    //alert(sortColumns + '+' + encodeURIComponent(sortColumns));
                    url += "&Sort=" + encodeURIComponent(paginationOptions.sortColumns);
                }

                var _scope = this.scope;
                //$(".loading").show();
                //this.scope.loading = true;
                //this.scope.msg = "";
                return this.http.get(url)
                    .success(function (response) {
                        this.$scope.gridResul.totalItems = response.RecordCount;
                        this.scope.gridResul.data = response.Data; // data.slice(firstRow, firstRow + pageSize)
                    }).error(function (data) {
                        alert('error getting data: ' + data.ExceptionMessage);
                    }).finally(function () {
                        //this.scope.loading = false;
                        //$(".loading").hide();
                    })
            };

            var editCellPut = function (rowEntity, colDef, newValue, oldValue) {
                if (newValue == oldValue) {
                    this.$scope.msg = "Value did not change";
                    return;
                }
                //SAMPLE_PK int, PESTCODE string, PDP_YEAR short, COMMOD string
                var sKey = rowEntity.SamplePK + "|" + rowEntity.Pest_Code + "|" + rowEntity.PdpYear + "|" + rowEntity.Com;
                this.$scope.loading = true;
                return this.$http.put("http://PdpApi/api/ResultsData", { rowkey: sKey, col: colDef.name, val: newValue })
                    .success(function (response) {
                        this.$scope.msg = "successfully updated  row key:" + sKey + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
                    }).error(function (data) {
                        alert('error updating data: ' + (data.ExceptionMessage ? data.ExceptionMessage : data.Message));
                    }).finally(function () {
                        this.$scope.loading = false;
                    })
            };
          
            function init() {
                paginationOptions.filterColumns.push('PdpYear#2013');
                getPage(1, 500, paginationOptions); //this.scope.gridResul.paginationPageSize
            }            
                       
           //init();

        }
        
        private getSampleResults(commodities: models.ICommodity[], pesticides: models.IPesticide[], testClasses: models.ITestClass[], years: models.IYear[], resultOptionId: number): void {
            this.SearchService.getSampleResults(commodities, pesticides, testClasses, years, resultOptionId)
                .then((sampleResults: models.ISampleResult[]): void => {
                    this.sampleResults = sampleResults;

                    this.showResultsPanel = true;
                    this.showSearchPanel = false;

                    $.jgrid.defaults.responsive = true;
                    $.jgrid.defaults.styleUI = 'Bootstrap';
                    $("#sampleResultsGrid").jqGrid({
                        datatype: "local",
                        data: this.sampleResults,
                        height: 340,
                        autowidth: true,
                        shrinkToFit: false,
                        width: 780,
                        rowNum: 1000,
                        rowList: [100, 500, 1000],
                        pager: "#sampleResultsGridPager",
                        colModel: [
                            { label: 'Sample ID#', name: 'sampleId', width: 175 },
                            { label: 'Com', name: 'commodity', width: 50 },
                            //{ label: 'Pest Code', name: 'Pestcode', width: 100 },
                            { label: 'Pesticide Name', name: 'pesticideName', width: 140  },
                            { label: 'Concen', name: 'concentration', width: 75 },
                            { label: 'LOD', name: 'lod', width: 75 },
                            { label: 'pp_', name: 'pp', width: 35 },
                            { label: 'Ann', name: 'annotate', width: 45 },
                            //{ label: 'Qua', name: 'quantitate', width: 40 },
                            { label: 'Mean', name: 'mean', width: 50 },
                            { label: 'Type', name: 'commodityType', width: 50  },
                            { label: 'Variety', name: 'variety', width: 75 },
                            { label: 'Clm', name: 'commodityClaim', width: 40  },
                            { label: 'Fac', name: 'facilityType', width: 40  },
                            { label: 'Origin', name: 'origin', width: 40 },
                            { label: 'Country', name: 'country', width: 55 },
                            { label: 'State', name: 'state', width: 40  },
                            { label: 'Qty', name: 'quantity', width: 40 },
                            { label: 'Tol (ppm)]', name: 'tol', width: 60 }
                        ],
                        viewrecords: true, // show the current page, data rang and total records on the toolbar
                        gridview: true,
                        //scroll: 1, 
                        //emptyrecords: 'Scroll to bottom to retrieve new page',
                        caption: "<p align='center'><b>Sample/Results</b></p>"
                    });
                });
        }

        private getSummaryOfNdLods(commodities: models.ICommodity[], pesticides: models.IPesticide[], testClasses: models.ITestClass[], years: models.IYear[]): void {
            this.SearchService.getSummaryOfNdLods(commodities, pesticides, testClasses, years)
                .then((summaryOfNd: models.ISummaryNd[]): void => {
                    this.summaryOfNd = summaryOfNd;

                    this.showResultsPanel = true;
                    this.showSearchPanel = false;

                    $.jgrid.defaults.responsive = true;
                    $.jgrid.defaults.styleUI = 'Bootstrap';
                    $("#summaryOfNdGrid").jqGrid({
                        datatype: "local",
                        data: this.summaryOfNd,
                        height: 250,
                        autowidth: true,
                        rowNum: 100,
                        pager: "#summaryOfNdGridPager",
                        colModel: [
                            { label: 'Pesticide Name', name: 'pesticideName'/*, width: 250 */ },
                            { label: 'Commodity', name: 'commodity'/*, width: 250 */ },
                            { label: 'Test Lab', name: 'testLab'/*, width: 250*/ },
                            { label: 'Reported LOD', name: 'reportedLod'/*, width: 250*/ },
                            { label: 'Unit pp_', name: 'unitPp'/*, width: 250 */ },
                            { label: 'Number of Samples', name: 'numberOfSamples'/*, width: 250 */ }
                        ],
                        viewrecords: true, // show the current page, data rang and total records on the toolbar
                        caption: "Summary of LODs for Non-Detects"
                    });
                });
        }

        private getSummaryOfFindings(commodities: models.ICommodity[], pesticides: models.IPesticide[], testClasses: models.ITestClass[], years: models.IYear[]): void {
            this.SearchService.getSummaryOfFindings(commodities, pesticides, testClasses, years)
                .then((summaryOfFindings: models.ISummaryOfFindings[]): void => {
                    this.summaryOfFindings = summaryOfFindings;

                    this.showResultsPanel = true;
                    this.showSearchPanel = false;

                    $.jgrid.defaults.responsive = true;
                    $.jgrid.defaults.styleUI = 'Bootstrap';
                    $("#summaryOfFindingsGrid").jqGrid({
                        datatype: "local",
                        data: this.summaryOfFindings,
                        height: 340,
                        autowidth: true,
                        shrinkToFit: false,
                        width: 780,
                        rowNum: 100,
                        pager: "#summaryOfFindingsGridPager",
                        colModel: [
                            { label: 'Pesticide Name', name: 'pesticideName', width: 175  },
                            { label: 'Commodity', name: 'commodity', width: 175  },
                            { label: '# of Samples Analyzed', name: 'samplesNumber', width: 105 },
                            { label: '# of Samples W/Detects', name: 'samplesDetects', width: 105 },
                            { label: '% of Samples W/Detects', name: 'sampleDetectsPercent', width: 110 },
                            { label: 'Min Detect', name: 'minValue', width: 75  },
                            { label: 'Max Detect', name: 'maxValue', width: 75  },
                            //{ label: 'Avg Value', name: 'avgValue', width: 55  },
                            { label: 'Range of LODs', name: 'rangeOfLods', width: 115 },
                            { label: 'Unit pp_', name: 'unitPp', width: 75 },
                            { label: 'Tol (ppm)', name: 'epatol', width: 55 },
                        ],
                        viewrecords: true, // show the current page, data rang and total records on the toolbar
                        caption: "<p align='center'><b>Summary of Findings</b></p>"
                    });
                });
        }

        private getSummaryOfFindingsByLod(commodities: models.ICommodity[], pesticides: models.IPesticide[], testClasses: models.ITestClass[], years: models.IYear[]): void {
            this.SearchService.getSummaryOfFindingsByLod(commodities, pesticides, testClasses, years)
                .then((summaryOfFindingsByLod: models.ISummaryOfFindingsByLod[]): void => {
                    this.summaryOfFindingsByLod = summaryOfFindingsByLod;

                    this.showResultsPanel = true;
                    this.showSearchPanel = false;

                    $.jgrid.defaults.responsive = true;
                    $.jgrid.defaults.styleUI = 'Bootstrap';
                    $("#summaryOfFindingsByLodGrid").jqGrid({
                        datatype: "local",
                        data: this.summaryOfFindingsByLod,
                        height: 250,
                        autowidth: true,
                        rowNum: 100,
                        pager: "#summaryOfFindingsByLodGridPager",
                        colModel: [
                            { label: 'Pesticide Name', name: 'pesticideName'/*, width: 250 */ },
                            { label: 'Commodity', name: 'commodity'/*, width: 250 */ },
                            { label: 'Distinct LOD', name: 'distinctLod'/*, width: 250 */ },
                            { label: 'Unit pp_', name: 'unitPp'/*, width: 250 */ },
                            { label: '# of Samples Analyzed', name: 'samplesNumber'/*, width: 250*/ },
                            { label: '# of Samples Detects', name: 'samplesDetects'/*, width: 250*/ },
                            { label: '% of Samples Detects', name: 'sampleDetectsPercent'/*, width: 250*/ },
                            { label: 'Min Value', name: 'minValue'/*, width: 250 */ },
                            { label: 'Max Value', name: 'maxValue'/*, width: 250 */ },
                            { label: 'Avg Value', name: 'avgValue'/*, width: 250 */ },
                        ],
                        viewrecords: true, // show the current page, data rang and total records on the toolbar
                        caption: "Summary of Findings by LOD"
                    });
                });
        }

        private getSummaryOfFindingsByCountryOfOrigin(commodities: models.ICommodity[], pesticides: models.IPesticide[], testClasses: models.ITestClass[], years: models.IYear[]): void {
            this.SearchService.getSummaryOfFindingsByCountryOfOrigin(commodities, pesticides, testClasses, years)
                .then((summaryOfFindingsByCountry: models.ISummaryOfFindingsByCountry[]): void => {
                    this.summaryOfFindingsByCountry = summaryOfFindingsByCountry;

                    this.showResultsPanel = true;
                    this.showSearchPanel = false;

                    $.jgrid.defaults.responsive = true;
                    $.jgrid.defaults.styleUI = 'Bootstrap';
                    $("#summaryOfFindingsByCountryGrid").jqGrid({
                        datatype: "local",
                        data: this.summaryOfFindingsByCountry,
                        height: 340,
                        autowidth: true,
                        shrinkToFit: false,
                        width: 780,
                        rowNum: 100,
                        pager: "#summaryOfFindingsByCountryGridPager",
                        colModel: [
                            { label: 'Pesticide Name', name: 'pesticideName', width: 140  },
                            { label: 'Commodity', name: 'commodity', width: 125  },
                            { label: 'Origin', name: 'origin', width: 55 },
                            { label: 'Country', name: 'country', width: 120 },
                            { label: '# of Samples Analyzed', name: 'samplesNumber', width: 100 },
                            { label: '# of Samples W/Detects', name: 'samplesDetects', width: 100 },
                            { label: '% of Samples W/Detects', name: 'sampleDetectsPercent', width: 100 },
                            { label: 'Min Detect', name: 'minValue', width: 75  },
                            { label: 'Max Detect', name: 'maxValue', width: 75  },
                            //{ label: 'Avg Value', name: 'avgValue', width: 55  },
                            { label: 'Range of LODs', name: 'rangeOfLods', width: 75  },
                            { label: 'Unit pp_', name: 'unitPp', width: 50 },
                            { label: 'Tol (ppm)', name: 'epatol', width: 55 }
                        ],
                        viewrecords: true, // show the current page, data rang and total records on the toolbar
                        caption: "<p align='center'><b>Summary of Findings by Country of ORIGIN</b></p>"
                    });
                });
        }

        private getSummaryOfFindingsByClaim(commodities: models.ICommodity[], pesticides: models.IPesticide[], testClasses: models.ITestClass[], years: models.IYear[]): void {
            this.SearchService.getSummaryOfFindingsByClaim(commodities, pesticides, testClasses, years)
                .then((summaryOfFindingsByClaim: models.ISummaryOfFindingsByClaim[]): void => {
                    this.summaryOfFindingsByClaim = summaryOfFindingsByClaim;

                    this.showResultsPanel = true;
                    this.showSearchPanel = false;

                    $.jgrid.defaults.responsive = true;
                    $.jgrid.defaults.styleUI = 'Bootstrap';
                    $("#summaryOfFindingsByClaimGrid").jqGrid({
                        datatype: "local",
                        data: this.summaryOfFindingsByClaim,
                        height: 340,
                        autowidth: true,
                        shrinkToFit: false,
                        width: 780,
                        rowNum: 100,
                        pager: "#summaryOfFindingsByClaimGridPager",
                        colModel: [
                            { label: 'Pesticide Name', name: 'pesticideName', width: 140 },
                            { label: 'Commodity', name: 'commodity', width: 100 },
                            { label: 'CLAIM on Product', name: 'claim', width: 125 },
                            { label: '# of Samples Analyzed', name: 'samplesNumber', width: 100 },
                            { label: '# of Samples W/Detects', name: 'samplesDetects', width: 100 },
                            { label: '% of Samples W/Detects', name: 'sampleDetectsPercent', width: 100},
                            { label: 'Min Detect', name: 'minValue', width: 75 },
                            { label: 'Max Detect', name: 'maxValue', width: 75 },
                            //{ label: 'Avg Value', name: 'avgValue', width: 60},
                            { label: 'Range of LODs', name: 'rangeOfLods', width: 75 },
                            { label: 'Unit pp_', name: 'unitPp', width: 40 },
                            { label: 'Tol (ppm)', name: 'epatol', width: 65 }
                        ],
                        viewrecords: true, // show the current page, data rang and total records on the toolbar
                        caption: "<p align='center'><b>Summary of Findings by Product CLAIM</b></p>"
                    });
                });
        }

        private makeSearchPanelVisible(): void {
            //this.showLoading = true;
            this.showResultsPanel = false;
            this.showSearchPanel = true;
        }

        private makeResultsPanelVisible(): void {
            this.showSearchPanel = false;
            this.showResultsPanel = true;
        }

        private loadCommodities(): void {
            this.SearchService.getCommodities()
                .then((commodities: models.ICommodity[]): void => {
                    this.commodities = commodities;
                });
        }

        private loadPesticides(): void {
            this.SearchService.getPesticides()
                .then((pesticides: models.IPesticide[]): void => {
                    this.pesticides = pesticides;
                });
        }

        private loadTestClasses(): void {
            this.SearchService.getTestClasses()
                .then((testClasses: models.ITestClass[]): void => {
                    this.testClasses = testClasses;
                });
        }

        private loadYears(): void {
            this.SearchService.getYears()
                .then((years: models.IYear[]): void => {
                    this.years = years;
                });
        }

        private load(): void {
            this.loadPesticides();
            this.loadCommodities();
            this.loadTestClasses();
            this.loadYears();
        }


    }

    angular
        .module('app.search', [
            'ui.grid',
            'ui.grid.edit',
            'ui.grid.pagination',
            'ui.grid.selection',
            'ui.grid.resizeColumns',
            'ui.grid.exporter'
        ])
        .controller('app.search.SearchController', ['$scope', '$http',

            'app.services.SearchService',

            SearchController
        ])
        .controller('MainCtrl', function ($scope, $http, uiGridConstants) {
            var paginationOptions = {
                sortColumns: [],
                filterColumns: []
            };

            $scope.gridResul = {
                //enableHorizontalScrollbar: 0,
                enableFiltering: true,
                enableGridMenu: true,
                exporterMenuCsv: true,
                paginationPageSize: 500,
                useExternalPagination: true,
                useExternalSorting: true,

                columnDefs: [
                    { field: 'PDP_Sample_ID', displayName: 'Sample Id', visible: false, enableSorting: false },
                    { field: 'PdpYear', displayName: 'Pdp Yr', filter: { term: '2014' }, width: 80 },
                    { field: 'Com', width: 70 },
                    { field: 'Pest_Code', width: 105 },
                    { field: 'Pesticide_Name', displayName: 'Pest Name', width: 100 },
                    { field: 'Concen', width: 80 },
                    { field: 'LOD', visible: false },
                    { field: 'pp_' },
                    { field: 'Ann', visible: false, enableSorting: false, enableFiltering: false },
                    { field: 'Qua' },
                    { field: 'Mean', enableFiltering: false },
                    { field: 'Type', enableFiltering: false },
                    { field: 'Variety', width: 75 },
                    { field: 'Clm', enableSorting: false, enableFiltering: false },
                    { field: 'Fac', enableSorting: false, enableFiltering: false },
                    { field: 'Origin', visible: false, enableSorting: false, enableFiltering: false },
                    { field: 'Country', enableSorting: false, enableFiltering: false },
                    { field: 'State', enableSorting: false, enableFiltering: false },
                    { field: 'Qty', enableSorting: false, enableFiltering: false },
                    { field: 'Tol_ppm', enableSorting: false, enableFiltering: false }
                ],
                exporterAllDataFn: function () {
                    return getPage(1, $scope.gridResul.totalItems, paginationOptions)
                        .then(function () {
                            //$scope.gridResul.useExternalPagination = false;
                            //$scope.gridResul.useExternalSorting = false;
                            getPage = null;
                        });
                },
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (getPage) {
                            paginationOptions.sortColumns = [];
                            if (sortColumns.length > 0) {
                                sortColumns.forEach(function (col) {
                                    paginationOptions.sortColumns.push(col.name + '#' + col.sort.direction);
                                });
                            }
                            getPage(grid.options.paginationCurrentPage, grid.options.paginationPageSize, paginationOptions);
                        }
                    });
                    $scope.gridApi.core.on.filterChanged($scope, function () {
                        if (getPage) {
                            paginationOptions.filterColumns = [];

                            var grid = this.grid;
                            angular.forEach(grid.columns, function (column) {
                                var fieldName = column.field;
                                var value = column.filters[0].term;
                                if (value) {
                                    paginationOptions.filterColumns.push(fieldName + '#' + value)
                                }
                            });
                            if (paginationOptions.filterColumns.length < 1) {
                                //alert('should have at least one filter');
                            }
                            getPage(grid.options.paginationCurrentPage, grid.options.paginationPageSize, paginationOptions);
                        }
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                        if (getPage) {
                            getPage(newPage, pageSize, paginationOptions);
                        }
                    });

                    gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                        editCellPut(rowEntity, colDef, newValue, oldValue);
                        //$scope.msg = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue ;
                        $scope.$apply();
                    });
                },
                gridMenuCustomItems: [{
                    title: 'Export Filtered Data As CSV',
                    order: 100,
                    action: function ($event) {
                        //var sUrl = "http://PdpApi/api/ResDataStream?Filter=" + encodeURIComponent(paginationOptions.filterColumns);
                        //window.open(sUrl, '_blank', '');
                    }
                }]
            };

            var getPage = function (curPage, pageSize, paginationOptions) {
                var firstRow = (curPage - 1) * pageSize;
                var url = "http://PdpApi/api/ResultsData?FirstRow=" + firstRow + "&PageSize=" + pageSize;
                if (paginationOptions.filterColumns) {
                    //alert(sortColumns + '+' + encodeURIComponent(sortColumns));
                    url += "&Filter=" + encodeURIComponent(paginationOptions.filterColumns);
                }
                if (paginationOptions.sortColumns) {
                    //alert(sortColumns + '+' + encodeURIComponent(sortColumns));
                    url += "&Sort=" + encodeURIComponent(paginationOptions.sortColumns);
                }

                var _scope = $scope;
                $scope.loading = true;
                $scope.msg = "";
                return $http.get(url)
                    .success(function (response) {
                        $scope.gridResul.totalItems = response.RecordCount;
                        $scope.gridResul.data = response.Data; // data.slice(firstRow, firstRow + pageSize)
                    }).error(function (data) {
                        alert('error getting data: ' + data.ExceptionMessage);
                    }).finally(function () {
                        $scope.loading = false;
                    })
            };

            var editCellPut = function (rowEntity, colDef, newValue, oldValue) {
                if (newValue == oldValue) {
                    $scope.msg = "Value did not change";
                    return;
                }
                //SAMPLE_PK int, PESTCODE string, PDP_YEAR short, COMMOD string
                var sKey = rowEntity.SamplePK + "|" + rowEntity.Pest_Code + "|" + rowEntity.PdpYear + "|" + rowEntity.Com;
                $scope.loading = true;
                return $http.put("http://PdpApi/api/ResultsData", { rowkey: sKey, col: colDef.name, val: newValue })
                    .success(function (response) {
                        $scope.msg = "successfully updated  row key:" + sKey + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
                    }).error(function (data) {
                        alert('error updating data: ' + (data.ExceptionMessage ? data.ExceptionMessage : data.Message));
                    }).finally(function () {
                        $scope.loading = false;
                    })
            };

            function init() {
                paginationOptions.filterColumns.push('PdpYear#2013');
                getPage(1, $scope.gridResul.paginationPageSize, paginationOptions);
            }

            init();
        });
}