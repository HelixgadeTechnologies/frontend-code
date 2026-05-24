import { ObservableMap } from "mobx";

export interface IEconomicImpactStore {
    isLoading: boolean;
    isSubmitting: boolean;
    isDeleting: boolean;
    isAddModelOpen: boolean;
    isDashboardLoading: boolean;
    activeUploadTab: number;
    uploadErrorCount: number;
    isValidate: boolean;
    isBulkUploadMode: boolean;
    uploadValidationResult: IEconomicImpactUploadValidationResponse;
    uploadResponse: IEconomicImpactUploadResponse;
    selectedEconomicImpact: IEconomicImpactView | null;
    economicImpact: IEconomicImpactView;
    allEconomicImpacts: ObservableMap<string, IEconomicImpactView>;
    economicImpactsByTrust: ObservableMap<string, IEconomicImpactView>;
    impactOptionOne: ObservableMap<number, IImpactOptionOne>;
    impactOptionTwo: ObservableMap<number, IImpactOptionTwo>;
    dashboardData: IEconomicImpactDashboardData | null;
    getEconomicImpact(): Promise<boolean>;
    createEconomicImpact(payload: IEconomicImpactPayload): Promise<boolean>;
    updateEconomicImpact(payload: IEconomicImpactPayload): Promise<boolean>;
    deleteEconomicImpact(economicImpactId: string): Promise<boolean>;
    getEconomicImpactByTrustId(trustId: string): Promise<boolean>;
    extractDashboardData(dashboard: IEconomicImpactDashboard): IEconomicImpactDashboardData;
    getEconomicImpactDashboardByTrustId(trustId: string, selectedYear:number,selectedState:string,settlor:string): Promise<void>;
    getEconomicImpactByEconomicImpactId(economicImpactId: string): Promise<boolean>;
    getImpactOptionOne(): Promise<boolean>;
    getImpactOptionTwo(): Promise<boolean>;
    validateEconomicImpactExcel(file: File): Promise<void>;
    saveValidatedEconomicImpactData(records: any[]): Promise<boolean>;
}

export interface IEconomicImpactPayloadData {
    economicImpactId?: string;
    businessGrowth?: number | null;
    incomeIncrease?: number | null;
    livelihoodImprove?: number | null;
    accessAmenities?: number | null;
    communityPeaceAndSecurity?: number | null;
    trustId?: string | null;
}
export interface IEconomicImpactPayload {
    isCreate: boolean;
    data: IEconomicImpactPayloadData
}

export interface IEconomicImpact {
    economicImpactId: string;
    businessGrowth?: number | null;
    incomeIncrease?: number | null;
    livelihoodImprove?: number | null;
    accessAmenities?: number | null;
    communityPeaceAndSecurity?: number | null;
    trustId?: string | null;
}
interface BaseItem {
    id: string;
}
export interface IEconomicImpactView extends BaseItem {
    economicImpactId: string;
    businessGrowth?: number | null;
    incomeIncrease?: number | null;
    livelihoodImprove?: number | null;
    businessGrowthStatus?: string | null;
    incomeIncreaseStatus?: string | null;
    livelihoodImproveStatus?: string | null;
    accessAmenities?: number | null;
    accessAmenitiesStatus?: string | null;
    communityPeaceAndSecurity?: number | null;
    communityPeaceAndSecurityStatus?: string | null;
    trustId?: string | null;
    trustName?: string | null;
    createAt?: string | null;
}

export interface IImpactOptionOne {
    impactOptionOneId: number;
    impactOptionOne: string;
}

export interface IImpactOptionTwo {
    impactOptionTwoId: number;
    impactOptionTwo: string;
}

export interface IEconomicImpactDashboardData {
    businessGrowth: number[];
    incomeIncrease: number[];
    livelihoodImprove: number[];
    communityPeaceAndSecurity: number[];
    accessAmenities: number[];
}
interface IEconomicImpactDashboardOptionOneResponse {
    "VERY TRUE": string,
    "SLIGHTLY": string,
    "NOT TRUE": string
}
interface IEconomicImpactDashboardOptionTwoResponse {
    "HEALTHCARE": string,
    "EDUCATION": string,
    "PORTABLE WATER": string,
    "ELECTRICITY": string,
    "GOOD ROADS": string,
    "MARKET": string,
    "FAVORABLE BUSINESS ENVIRONMENT": string
}

interface IEconomicImpactDashboardOptionOneData {
    QUESTION: string,
    RESPONSE: IEconomicImpactDashboardOptionOneResponse,
    "VALUE TYPE": string
}
interface IEconomicImpactDashboardOptionTwoData {
    QUESTION: string,
    RESPONSE: IEconomicImpactDashboardOptionTwoResponse,
    "VALUE TYPE": string
}
export interface IEconomicImpactDashboard {
    businessGrowth: Array<IEconomicImpactDashboardOptionOneData>;
    incomeIncrease: Array<IEconomicImpactDashboardOptionOneData>;
    livelihoodImprove: Array<IEconomicImpactDashboardOptionOneData>;
    communityPeaceAndSecurity: Array<IEconomicImpactDashboardOptionOneData>;
    accessAmenities: Array<IEconomicImpactDashboardOptionTwoData>;
}

export interface IEconomicImpactUploadValidationResponse {
    totalRecords: number;
    totalInvalid: number;
    allEconomicImpactData: any[];
    validationSummary: IEconomicImpactValidationSummary[];
}

export interface IEconomicImpactValidationSummary {
    rowNumber: number;
    message: string;
    field: string;
    value: any;
}

export interface IEconomicImpactUploadResponse {
    totalRecords: number;
    totalInserted: number;
    totalFailed: number;
    failed: any[];
}
