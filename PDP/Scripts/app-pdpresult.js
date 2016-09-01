var app = angular.module('app', [ //appPdp
	'ui.grid',
	'ui.grid.edit',
	'ui.grid.pagination',
	'ui.grid.selection',
	'ui.grid.resizeColumns',
	'ui.grid.exporter'
]);

app.controller('MainCtrl', function ($scope, $http, uiGridConstants) {
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
			{ field: 'PDP_Sample_ID', displayName: 'Sample Id', visible : false, enableSorting: false},
			{ field: 'PdpYear', displayName: 'Pdp Yr', filter: { term: '2014' }, width: 80 },
			{ field: 'Com', width:70},
			{ field: 'Pest_Code', width: 105 },
			{ field: 'Pesticide_Name', displayName: 'Pest Name', width: 100 },
			{ field: 'Concen', width: 80 },
			{ field: 'LOD', visible: false },
			{ field: 'pp_'},
			{ field: 'Ann', visible: false, enableSorting: false, enableFiltering: false },
			{ field: 'Qua'},
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
				var sUrl = "http://PdpApi/api/ResDataStream?Filter=" + encodeURIComponent(paginationOptions.filterColumns);
				window.open(sUrl, '_blank', '');
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
		paginationOptions.filterColumns.push('PdpYear#2014');
		getPage(1, $scope.gridResul.paginationPageSize, paginationOptions);
	}
	
	init();
});
