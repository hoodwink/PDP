var app = angular.module('app', [ //appCommHist
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

    $scope.gridCommHist = {
        enableHorizontalScrollbar: 1,
        //enableVerticalScrollbar: 1,
        enableFiltering: true,
        enableGridMenu: true,
        exporterMenuCsv: true,
        exporterCsvFilename: 'CommodityHistory.csv',
        exporterPdfFilename: 'CommodityHistory.pdf',
        paginationPageSize: 500,
        //useExternalPagination: true,
        // useExternalSorting: true,

        columnDefs: [
			{ field: 'Commodity_Name', displayName: 'Commodity Name', width: 175 },
            { field: 'Code', displayName: 'Code', width: 75 },
			{ field: 'C2014', displayName: '2014', width: 75 },
            { field: 'C2013', displayName: '2013', width: 75 },
            { field: 'C2012', displayName: '2012', width: 75 },
            { field: 'C2011', displayName: '2011', width: 75 },
            { field: 'C2010', displayName: '2010', width: 75 },
            { field: 'C2009', displayName: '2009', width: 75 },
            { field: 'C2008', displayName: '2008', width: 75 },
            { field: 'C2007', displayName: '2007', width: 75 },
            { field: 'C2006', displayName: '2006', width: 75 },
            { field: 'C2005', displayName: '2005', width: 75 },
            { field: 'C2004', displayName: '2004', width: 75 },
            { field: 'C2003', displayName: '2003', width: 75 },
            { field: 'C2002', displayName: '2002', width: 75 },
            { field: 'C2001', displayName: '2001', width: 75 },
            { field: 'C2000', displayName: '2000', width: 75 },
            { field: 'C1999', displayName: '1999', width: 75 },
            { field: 'C1998', displayName: '1998', width: 75 },
            { field: 'C1997', displayName: '1997', width: 75 },
            { field: 'C1996', displayName: '1996', width: 75 },
            { field: 'C1995', displayName: '1995', width: 75 },
            { field: 'C1994', displayName: '1994', width: 75 }
        ],
        exporterAllDataFn: function () {
            return getPage()
			.then(function () {
			    $scope.gridCommHist.useExternalPagination = false;
			    $scope.gridCommHist.useExternalSorting = false;
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
        var url = "http://PdpApi/api/CommodityHist";

        $scope.loading = true;
        $scope.msg = "";
        return $http.get(url)
		.success(function (response) {
		    $scope.gridCommHist.totalItems = response.RecordCount;
		    $scope.gridCommHist.data = response; // data.slice(firstRow, firstRow + pageSize)
		}).error(function (data) {
		    //alert('error getting data: ' + data.ExceptionMessage);
		    $scope.msg = 'error getting data: ' + data.ExceptionMessage;
		}).finally(function () {
		    $scope.loading = false;
		})
    };

    getPage();
});
