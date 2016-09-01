var app = angular.module('app', [ //appTestClass
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

    $scope.gridTestClass = {
        enableHorizontalScrollbar: 0,
        enableFiltering: true,
        enableGridMenu: true,
        exporterMenuCsv: true,
        exporterCsvFilename: 'TestClass.csv',
		exporterPdfFilename: 'TestClass.pdf',
        paginationPageSize: 500,
        //useExternalPagination: true,
        // useExternalSorting: true,

        columnDefs: [
			{ field: 'TESTCLASS', displayName: 'Test Class code', width: 225 },
			{ field: 'DESCRIP', displayName: 'Description' },
        ],
        exporterAllDataFn: function () {
            return getPage()
			.then(function () {
			    $scope.gridTestClass.useExternalPagination = false;
			    $scope.gridTestClass.useExternalSorting = false;
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
        var url = "http://PdpApi/api/TestClass";

        $scope.loading = true;
        $scope.msg = "";
        return $http.get(url)
		.success(function (response) {
		    $scope.gridTestClass.totalItems = response.RecordCount;
		    $scope.gridTestClass.data = response; // data.slice(firstRow, firstRow + pageSize)
		}).error(function (data) {
		    //alert('error getting data: ' + data.ExceptionMessage);
		    $scope.msg = 'error getting data: ' + data.ExceptionMessage;
		}).finally(function () {
		    $scope.loading = false;
		})
    };

    getPage();
});
