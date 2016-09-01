var app;
(function (app) {
    var services;
    (function (services) {
        'use strict';
        var SearchService = (function () {
            function SearchService($http) {
                this.$http = $http;
            }
            SearchService.prototype.getPesticides = function () {
                return this.$http
                    .get('/api/Info/GetPesticides/')
                    .then(function (response) {
                    return response.data;
                });
            };
            ;
            SearchService.prototype.getCommodities = function () {
                return this.$http
                    .get('/api/Info/GetCommodities/')
                    .then(function (response) {
                    return response.data;
                });
            };
            ;
            SearchService.prototype.getTestClasses = function () {
                return this.$http
                    .get('/api/Info/GetTestClasses/')
                    .then(function (response) {
                    return response.data;
                });
            };
            ;
            SearchService.prototype.getYears = function () {
                return this.$http
                    .get('/api/Info/GetYears/')
                    .then(function (response) {
                    return response.data;
                });
            };
            ;
            //, page: number, limit: number, sortBy: string, direction: string, searchString: string
            SearchService.prototype.getAnalyticalResults = function (commodities, pesticides, testClasses, years, resultOptionId) {
                return this.$http
                    .post('/api/Info/GetAnalyticalResults/', {
                    commodities: commodities,
                    pesticides: pesticides,
                    testClasses: testClasses,
                    years: years,
                    resultOptionId: resultOptionId
                })
                    .then(function (response) {
                    return response.data;
                });
            };
            SearchService.prototype.getSampleResults = function (commodities, pesticides, testClasses, years, resultOptionId) {
                return this.$http
                    .post('/api/Info/GetSampleResults/', {
                    commodities: commodities,
                    pesticides: pesticides,
                    testClasses: testClasses,
                    years: years,
                    resultOptionId: resultOptionId
                })
                    .then(function (response) {
                    return response.data;
                });
            };
            SearchService.prototype.getSummaryOfNdLods = function (commodities, pesticides, testClasses, years) {
                return this.$http
                    .post('/api/Info/GetSummaryOfNdLods/', {
                    commodities: commodities,
                    pesticides: pesticides,
                    testClasses: testClasses,
                    years: years
                })
                    .then(function (response) {
                    return response.data;
                });
            };
            SearchService.prototype.getSummaryOfFindings = function (commodities, pesticides, testClasses, years) {
                return this.$http
                    .post('/api/Info/GetSummaryOfFindings/', {
                    commodities: commodities,
                    pesticides: pesticides,
                    testClasses: testClasses,
                    years: years
                })
                    .then(function (response) {
                    return response.data;
                });
            };
            SearchService.prototype.getSummaryOfFindingsByLod = function (commodities, pesticides, testClasses, years) {
                return this.$http
                    .post('/api/Info/GetSummaryOfFindingsByLod/', {
                    commodities: commodities,
                    pesticides: pesticides,
                    testClasses: testClasses,
                    years: years
                })
                    .then(function (response) {
                    return response.data;
                });
            };
            SearchService.prototype.getSummaryOfFindingsByCountryOfOrigin = function (commodities, pesticides, testClasses, years) {
                return this.$http
                    .post('/api/Info/GetSummaryOfFindingsByCountryOfOrigin/', {
                    commodities: commodities,
                    pesticides: pesticides,
                    testClasses: testClasses,
                    years: years
                })
                    .then(function (response) {
                    return response.data;
                });
            };
            SearchService.prototype.getSummaryOfFindingsByClaim = function (commodities, pesticides, testClasses, years) {
                return this.$http
                    .post('/api/Info/GetSummaryOfFindingsByClaim/', {
                    commodities: commodities,
                    pesticides: pesticides,
                    testClasses: testClasses,
                    years: years
                })
                    .then(function (response) {
                    return response.data;
                });
            };
            return SearchService;
        })();
        function factory($http) {
            return new SearchService($http);
        }
        angular
            .module('app.services')
            .factory('app.services.SearchService', [
            '$http', factory
        ]);
    })(services = app.services || (app.services = {}));
})(app || (app = {}));
