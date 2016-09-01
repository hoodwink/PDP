var app = angular.module('app', [ //appTolerance
	'ui.grid',
	//'ui.grid.edit',
	'ui.grid.pagination',
	//'ui.grid.selection',
	'ui.grid.resizeColumns',
	'ui.grid.exporter'
]);

app.controller('MainCtrl', function ($scope, $http, uiGridConstants) {
    //var paginationOptions = {
    //    sortColumns: [],
    //    filterColumns: []
    //};

    $scope.gridTolerance = {
        enableHorizontalScrollbar: 0,
        enableFiltering: true,
        enableGridMenu: true,
        exporterMenuCsv: true,
        exporterCsvFilename: 'Tolerance.csv',
		exporterPdfFilename: 'Tolerance.pdf',
        paginationPageSize: 500,
        //useExternalPagination: true,
        // useExternalSorting: true,

        columnDefs: [
            { field: 'Report_Year', displayName: 'Report Year', width: 100 },
            { field: 'Pesticide_Code', displayName: 'Pesticide Code', width: 160 },
            { field: 'Pesticide_Name', displayName: 'Pesticide Name', width: 160 },
            { field: 'Commodity_Code', displayName: 'Commodity Code', width: 170 },
            { field: 'Commodity_Name', displayName: 'Commodity Name', width: 170 },
			{ field: 'EPA_Tolerance_Level', displayName: 'Tolerance levels', width: 160 },
			{ field: 'Unit_pp_', displayName: 'Tolerance Unit' }
        ],
        exporterAllDataFn: function () {
            return getPage()
			.then(function () {
			    $scope.gridTolerance.useExternalPagination = false;
			    $scope.gridTolerance.useExternalSorting = false;
			    getPage = null;
			});
        },
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            //$scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
            //    if (getPage) {
            //        paginationOptions.sortColumns = [];
            //        if (sortColumns.length > 0) {
            //            sortColumns.forEach(function (col) {
            //                paginationOptions.sortColumns.push(col.name + '#' + col.sort.direction);
            //            });
            //        }
            //        getPage(grid.options.paginationCurrentPage, grid.options.paginationPageSize, paginationOptions);
            //    }
            //});
            //$scope.gridApi.core.on.filterChanged($scope, function () {
            //    if (getPage) {
            //        paginationOptions.filterColumns = [];

            //        var grid = this.grid;
            //        angular.forEach(grid.columns, function (column) {
            //            var fieldName = column.field;
            //            var value = column.filters[0].term;
            //            if (value) {
            //                paginationOptions.filterColumns.push(fieldName + '#' + value)
            //            }
            //        });
            //        if (paginationOptions.filterColumns.length < 1) {
            //            //alert('should have at least one filter');
            //        }
            //        getPage();
            //    }
            //});
            //gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
            //    if (getPage) {
            //        getPage(newPage, pageSize, paginationOptions);
            //    }
            //});

            //gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
            //    editCellPut(rowEntity, colDef, newValue, oldValue);
            //    //$scope.msg = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue ;
            //    $scope.$apply();
            //});
        }
    };

    var getPage = function () {
        var url = "http://PdpApi/api/Tolerance";

        $scope.loading = true;
        $scope.msg = "";
        return $http.get(url)
		.success(function (response) {
		    $scope.gridTolerance.totalItems = response.RecordCount;
		    $scope.gridTolerance.data = response; // data.slice(firstRow, firstRow + pageSize)
		}).error(function (data) {
		    //alert('error getting data: ' + data.ExceptionMessage);
		    $scope.msg = 'error getting data: ' + data.ExceptionMessage;
		}).finally(function () {
		    $scope.loading = false;
		})
    };

    getPage();
});
