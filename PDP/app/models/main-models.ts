module app.models {
    'use strict'

    export interface IEntity {
        isChecked: boolean;
    }

    export interface IPesticide extends IEntity {
        isChecked: boolean;
        pesticideCode: string;
        pesticideName: string;
        testClass: string;
    }

    export interface ICommodity extends IEntity {
        isChecked: boolean;
        commodity: string;
        commodityName: string;
    }

    export interface ITestClass extends IEntity {
        isChecked: boolean;
        testClass: string;
        description: string;
    }

    export interface IYear extends IEntity {
        isChecked: boolean;
        year: string;
        yearName: string;
    }

    export interface IPreference {
        id: number;
        preference: string;
    }

    export interface IAnalyticalResult {
        sampleId: number;
        commodity: string;
        commodityType: string;
        pesticideCode: string;
        testClass: string;
        concentration: number;
        lod: number;
        confirmationMethod: string;
        confirmationMethod2: string;
        annotate: string;
        quantitate: string;
        mean: string;
        extract: string;
        determinative: string;
        tol: string;
    }

    export interface ISampleResult {
        sampleId: number;
        commodity: string;
        commodityType: string;
        pesticideName: string;
        concentration: number;
        lod: number;
        pp: string;
        annotate: string;
        quantity: string;
        variety: string;
        commodityClaim: string;
        facilityType: string;
        origin: string;
        state: string;
        mean: string;
        extract: string;
        determinative: string;
        tol: string;

    }

    export interface ISummaryNd {
        commodity: string;
        pesticideName: string;
        reportedLod: number;
        unitPp: string;
        testLab: string;
        numberOfSamples: number;
    }

    export interface ISummaryOfFindings {
        commodity: string;
        pesticideName: string;
        samplesNumber: number;
        samplesDetects: number;
        sampleDetectsPercent: number;
        minValue: number;
        maxValue: number;
        avgValue: number;
        rangeOfLods: string;
        unitPp: string;
        tol: string;
    }

    export interface ISummaryOfFindingsByLod {
        commodity: string;
        pesticideName: string;
        samplesNumber: number;
        samplesDetects: number;
        sampleDetectsPercent: number;
        minValue: number;
        maxValue: number;
        avgValue: number;
        distinctLod: number;
        unitPp: string;
    }

    export interface ISummaryOfFindingsByCountry {
        commodity: string;
        pesticideName: string;
        samplesNumber: number;
        samplesDetects: number;
        sampleDetectsPercent: number;
        minValue: number;
        maxValue: number;
        avgValue: number;
        origin: number;
        rangeOfLods: string;
        country: string;
        unitPp: string;
        tol: string;
    }

    export interface ISummaryOfFindingsByClaim {
        commodity: string;
        pesticideName: string;
        samplesNumber: number;
        samplesDetects: number;
        sampleDetectsPercent: number;
        minValue: number;
        maxValue: number;
        avgValue: number;
        rangeOfLods: string;
        claim: string;
        unitPp: string;
        tol: string;
    }
}