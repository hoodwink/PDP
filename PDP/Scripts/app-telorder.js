var app = angular.module('app', [ //appTel
	'ui.grid',
	'ui.grid.grouping',
	'ui.grid.resizeColumns'
]);

app.controller('MainCtrl', function ($scope, $http, uiGridConstants) {
	$scope.gridTelOrder = {
		enableHorizontalScrollbar: 0,
		enableFiltering: true,
		enableGridMenu: true,

		columnDefs: [
			{ field: 'Request_Number', displayName: 'Request No', width:130},
			{ field: 'Order_Date', displayName: 'Order Date', width:110},
			{ field: 'Fiscal_Year', width:70},
			{ field: 'Submitter' },
			{ field: 'Location', displayName: 'Pest Name' },
			{ field: 'Program'},
			{ field: 'Branch' },
			{ field: 'Group'},
			{ field: 'Option'},
			{ field: 'Status'}
		],
		onRegisterApi: function (gridApi) {
			$scope.gridApi = gridApi;
		}
	};

	//Fisacl Year, Program, Group
	$scope.GroupByFiscalYear = function () {
		$scope.gridApi.grouping.clearGrouping();
		$scope.gridApi.grouping.groupColumn('Fiscal_Year');
	};
	$scope.GroupByProgram = function () {
		$scope.gridApi.grouping.clearGrouping();
		$scope.gridApi.grouping.groupColumn('Program');
	};
	$scope.GroupByGroup = function () {
		$scope.gridApi.grouping.clearGrouping();
		$scope.gridApi.grouping.groupColumn('Group');
	};
	$scope.GroupByNone = function () {
		$scope.gridApi.grouping.clearGrouping();
	};
	var getPage = function () {
		var url = "/PdpApi/api/TelOrder";

		$scope.loading = true;
		$scope.msg = "";
		return $http.get(url)
		.success(function (response) {
			$scope.gridTelOrder.data = response;
		}).error(function (data) {
			$scope.msg='error getting data: ' + data.ExceptionMessage;
		}).finally(function () {
			$scope.loading = false;
		})
	};

	getPage();
});
