module app.services {
    'use strict'

    export interface ISearchService {
        getPesticides(): ng.IPromise<models.IPesticide[]>;
        getCommodities(): ng.IPromise<models.ICommodity[]>;
        getTestClasses(): ng.IPromise<models.ITestClass[]>;
        getYears(): ng.IPromise<models.IYear[]>;
        getAnalyticalResults(commodities: models.ICommodity[], pesticides: models.IPesticide[], testClasses: models.ITestClass[], years: models.IYear[], resultOptionId: number): ng.IPromise<models.IAnalyticalResult[]>; //, page: number, limit: number, sortBy: string, direction: string, searchString: string
        getSampleResults(commodities: models.ICommodity[], pesticides: models.IPesticide[], testClasses: models.ITestClass[], years: models.IYear[], resultOptionId: number): ng.IPromise<models.ISampleResult[]>;
        getSummaryOfNdLods(commodities: models.ICommodity[], pesticides: models.IPesticide[], testClasses: models.ITestClass[], years: models.IYear[]): ng.IPromise<models.ISummaryNd[]>;
        getSummaryOfFindings(commodities: models.ICommodity[], pesticides: models.IPesticide[], testClasses: models.ITestClass[], years: models.IYear[]): ng.IPromise<models.ISummaryOfFindings[]>;
        getSummaryOfFindingsByLod(commodities: models.ICommodity[], pesticides: models.IPesticide[], testClasses: models.ITestClass[], years: models.IYear[]): ng.IPromise<models.ISummaryOfFindingsByLod[]>;
        getSummaryOfFindingsByCountryOfOrigin(commodities: models.ICommodity[], pesticides: models.IPesticide[], testClasses: models.ITestClass[], years: models.IYear[]): ng.IPromise<models.ISummaryOfFindingsByCountry[]>;
        getSummaryOfFindingsByClaim(commodities: models.ICommodity[], pesticides: models.IPesticide[], testClasses: models.ITestClass[], years: models.IYear[]): ng.IPromise<models.ISummaryOfFindingsByClaim[]>;
    }

    class SearchService implements ISearchService {
        constructor(private $http: ng.IHttpService) {
        }

        getPesticides(): ng.IPromise<models.IPesticide[]> {
            return this.$http
                .get('/api/Info/GetPesticides/')
                .then((response: ng.IHttpPromiseCallbackArg<models.IPesticide[]>): models.IPesticide[]=> {
                    return response.data;
                });
        };

        getCommodities(): ng.IPromise<models.ICommodity[]> {
            return this.$http
                .get('/api/Info/GetCommodities/')
                .then((response: ng.IHttpPromiseCallbackArg<models.ICommodity[]>): models.ICommodity[]=> {
                    return response.data;
                });
        };

        getTestClasses(): ng.IPromise<models.ITestClass[]> {
            return this.$http
                .get('/api/Info/GetTestClasses/')
                .then((response: ng.IHttpPromiseCallbackArg<models.ITestClass[]>): models.ITestClass[]=> {
                    return response.data;
                });
        };

        getYears(): ng.IPromise<models.IYear[]> {
            return this.$http
                .get('/api/Info/GetYears/')
                .then((response: ng.IHttpPromiseCallbackArg<models.IYear[]>): models.IYear[]=> {
                    return response.data;
                });
        };

        //, page: number, limit: number, sortBy: string, direction: string, searchString: string
        getAnalyticalResults(commodities: models.ICommodity[], pesticides: models.IPesticide[], testClasses: models.ITestClass[], years: models.IYear[], resultOptionId: number): ng.IPromise<models.IAnalyticalResult[]> {
            return this.$http
                .post('/api/Info/GetAnalyticalResults/', {
                    commodities: commodities,
                    pesticides: pesticides,
                    testClasses: testClasses,
                    years: years,
                    resultOptionId: resultOptionId
                })
                .then((response: ng.IHttpPromiseCallbackArg<models.IAnalyticalResult[]>): models.IAnalyticalResult[]=> {
                    return response.data;
                });
        }

        getSampleResults(commodities: models.ICommodity[], pesticides: models.IPesticide[], testClasses: models.ITestClass[], years: models.IYear[], resultOptionId: number): ng.IPromise<models.ISampleResult[]> {
            return this.$http
                .post('/api/Info/GetSampleResults/', {
                    commodities: commodities,
                    pesticides: pesticides,
                    testClasses: testClasses,
                    years: years,
                    resultOptionId: resultOptionId
                })
                .then((response: ng.IHttpPromiseCallbackArg<models.ISampleResult[]>): models.ISampleResult[]=> {
                    return response.data;
                });
        }

        getSummaryOfNdLods(commodities: models.ICommodity[], pesticides: models.IPesticide[], testClasses: models.ITestClass[], years: models.IYear[]): ng.IPromise<models.ISummaryNd[]> {
            return this.$http
                .post('/api/Info/GetSummaryOfNdLods/', {
                    commodities: commodities,
                    pesticides: pesticides,
                    testClasses: testClasses,
                    years: years

                })
                .then((response: ng.IHttpPromiseCallbackArg<models.ISummaryNd[]>): models.ISummaryNd[]=> {
                    return response.data;
                });
        }

        getSummaryOfFindings(commodities: models.ICommodity[], pesticides: models.IPesticide[], testClasses: models.ITestClass[], years: models.IYear[]): ng.IPromise<models.ISummaryOfFindings[]> {
            return this.$http
                .post('/api/Info/GetSummaryOfFindings/', {
                    commodities: commodities,
                    pesticides: pesticides,
                    testClasses: testClasses,
                    years: years
                })
                .then((response: ng.IHttpPromiseCallbackArg<models.ISummaryOfFindings[]>): models.ISummaryOfFindings[]=> {
                    return response.data;
                });
        }

        getSummaryOfFindingsByLod(commodities: models.ICommodity[], pesticides: models.IPesticide[], testClasses: models.ITestClass[], years: models.IYear[]): ng.IPromise<models.ISummaryOfFindingsByLod[]> {
            return this.$http
                .post('/api/Info/GetSummaryOfFindingsByLod/', {
                    commodities: commodities,
                    pesticides: pesticides,
                    testClasses: testClasses,
                    years: years
                })
                .then((response: ng.IHttpPromiseCallbackArg<models.ISummaryOfFindingsByLod[]>): models.ISummaryOfFindingsByLod[]=> {
                    return response.data;
                });
        }

        getSummaryOfFindingsByCountryOfOrigin(commodities: models.ICommodity[], pesticides: models.IPesticide[], testClasses: models.ITestClass[], years: models.IYear[]): ng.IPromise<models.ISummaryOfFindingsByCountry[]> {
            return this.$http
                .post('/api/Info/GetSummaryOfFindingsByCountryOfOrigin/', {
                    commodities: commodities,
                    pesticides: pesticides,
                    testClasses: testClasses,
                    years: years
                })
                .then((response: ng.IHttpPromiseCallbackArg<models.ISummaryOfFindingsByCountry[]>): models.ISummaryOfFindingsByCountry[]=> {
                    return response.data;
                });
        }

        getSummaryOfFindingsByClaim(commodities: models.ICommodity[], pesticides: models.IPesticide[], testClasses: models.ITestClass[], years: models.IYear[]): ng.IPromise<models.ISummaryOfFindingsByClaim[]> {
            return this.$http
                .post('/api/Info/GetSummaryOfFindingsByClaim/', {
                    commodities: commodities,
                    pesticides: pesticides,
                    testClasses: testClasses,
                    years: years
                })
                .then((response: ng.IHttpPromiseCallbackArg<models.ISummaryOfFindingsByClaim[]>): models.ISummaryOfFindingsByClaim[]=> {
                    return response.data;
                });
        }
    }

    function factory($http: ng.IHttpService) {
        return new SearchService($http);
    }

    angular
        .module('app.services')
        .factory('app.services.SearchService', [
            '$http', factory
        ]);
}