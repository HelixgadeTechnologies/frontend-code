import { ObservableMap } from "mobx";
import { IUploadPayload } from "../../project/types/interface";
import { HCDTRequestResponse } from "../../../infrastructure/HCDTRequestResponse";
import { IBotInauguration } from "../../dashboard/types/interface";

export interface ITrustEstablishmentStore {
    isLoading: boolean;
    isSubmitting: boolean;
    pageSwitch: number;
    isDashboardLoading: boolean;
    isDeleting: boolean;
    summarySwitch: boolean;
    operationCount: ObservableMap<string, number>;
    fundsDashboardData: IFundsDashboardData;
    trustEstablishmentStatus: ITrustEstablishmentStatus | null;
    dashboardData: IFinishedDashboard | null;
    selectedYear: number;
    fundsStatusDashboard: Array<IFundsStatusDashboardData>;
    createTrustEstablishment(payload: ITrustEstablishmentPayload): Promise<boolean>;
    calculateTrustEstablishmentCompletion(data: ITrustEstablishmentPayload): number;
    getSingleTrustEstablishmentStatus(trustId: string): Promise<void>;
    uploadFile(payload: IUploadPayload): Promise<HCDTRequestResponse>;
    destroyCACDocument(url: string, trustEstablishmentId: string): Promise<void>;
    destroyMatrixDocument(url: string, trustEstablishmentId: string): Promise<void>;
    transformDashboard(data: IEstablishmentDashboard): IFinishedDashboard;
    getEstablishmentDashboardByTrustId(trustId: string): Promise<void>;
    getFundsDashboardByTrustIdAndYear(trustId: string, year: number): Promise<void>;
}
interface BaseCompletionItem {
    completionStatus?: number;
}
export interface ITrustEstablishmentPayload extends BaseCompletionItem {
    trustEstablishmentStatusId: string,
    trustId: string,
    trustRegisteredWithCAC: number,
    cscDocument: string,
    cscDocumentMimeType: string,
    yearIncorporated: number,
    botConstitutedAndInaugurated: number,
    managementCommitteeConstitutedAndInaugurated: number,
    advisoryCommitteeConstitutedAndInaugurated: number,
    isTrustDevelopmentPlanReadilyAvailable: number,
    isTrustDevelopmentPlanBudgetReadilyAvailable: number,
    yearDeveloped: number,
    yearExpired: number,
    developmentPlanDocument: string,
    developmentPlanDocumentMimeType: string,
    developmentPlanBudgetDocument: string,
    developmentPlanBudgetDocumentMimeType: string,
    fundsReceive: Array<IFundsReceived>,
    admin: string,
    yearOfNeedsAssessment: number,
    statusOfNeedAssessment: number,
    communityWomenConsulted: number,
    pwDsConsulted: number,
    communityYouthsConsulted: number,
    communityLeadershipConsulted: number,
    attendanceSheet: number,
    distributionMatrixDevelopedBySettlor: boolean,
    trustDistributionMatrixDocument: string,
    trustDistributionMatrixDocumentMimeType: string,
    settlorOperationalExpenditures: Array<IOperationalExpenditure>
}
export interface IFundsReceived {
    fundsReceivedByTrustId?: string;
    yearReceived?: number;
    reserveReceived?: number;
    capitalExpenditureReceived?: number;
    totalFundsReceived?: number;
    paymentCheck?: number;
    trustEstablishmentStatusId?: string;
}
export interface IFundsDashboardData {
    totalFundsReceived: number,
    capitalExpenditureReceived: number,
    reserveReceived: number,
    capitalPercentage: number,
    reservePercentage: number
}
export interface IFundsStatusDashboardData{
    yearReceived: number,
    paymentCheck: number

}
export interface IFundsStatusDashboard {
    FINANCIAL_SUMMARY: Array<IFundsStatusDashboardData>
}
export interface IFundsDashboard {
    FINANCIAL_SUMMARY: Array<IFundsDashboardData>
}
export interface IOperationalExpenditure {
    OperationalExpenditureId?: string;
    settlorOperationalExpenditureYear?: number;
    settlorOperationalExpenditure?: number;
    trustEstablishmentStatusId?: string;
}

export interface ITrustEstablishmentStatus {
    trustEstablishmentStatusId: string;
    trustRegisteredWithCAC?: number | null;
    cscDocument?: string | null;
    cscDocumentMimeType?: string | null;
    yearIncorporated?: number | null;
    botConstitutedAndInaugurated?: number | null;
    managementCommitteeConstitutedAndInaugurated?: number | null;
    advisoryCommitteeConstitutedAndInaugurated?: number | null;
    isTrustDevelopmentPlanReadilyAvailable?: number | null;
    isTrustDevelopmentPlanBudgetReadilyAvailable?: number | null;
    yearDeveloped?: number | null;
    yearExpired?: number | null;
    developmentPlanDocument?: string | null;
    developmentPlanDocumentMimeType?: string | null;
    developmentPlanBudgetDocument?: string | null;
    developmentPlanBudgetDocumentMimeType?: string | null;
    fundsReceive: Array<IFundsReceived>
    admin?: string | null;
    yearOfNeedsAssessment?: number | null;
    statusOfNeedAssessment?: number | null;
    communityWomenConsulted?: number | null;
    pwDsConsulted?: number | null;
    communityYouthsConsulted?: number | null;
    communityLeadershipConsulted?: number | null;
    attendanceSheet?: number | null;
    distributionMatrixDevelopedBySettlor?: boolean | null;
    trustDistributionMatrixDocument?: string | null;
    trustDistributionMatrixDocumentMimeType?: string | null;
    settlorOperationalExpenditures?: Array<IOperationalExpenditure>;
    trustId?: string;
    createAt?: Date | null;
    updateAt?: Date | null;
}

export interface ISubFields {
    totalFundsReceivedByTrust: number,
    capitalExpenditure: number,
    reserve: number,
    trustRegisteredWithCAC: number,
    cscDocument: string,
    yearIncorporated: number,
    yearDeveloped: number,
    yearExpired: number,
    communityLeadershipConsulted: number,
    communityYouthsConsulted: number,
    communityWomenConsulted: number,
    pwDsConsulted: number,
    yearOfNeedsAssessment: number,
    trustDistributionMatrixDocument: string,
    completionStatus: number,
    updateAt: string,
    statusOfNeedAssessment: number,
}

export interface ITrends {
    settlorOperationalExpenditureYear: number,
    settlorOperationalExpenditure: number
}

export interface IOperationYear {
    trustDevPlanProgress: number
}
export interface IEstablishmentDashboard {
    SUB_FIELDS: Array<ISubFields>,
    OPERATION_YEAR: Array<IOperationYear>,
    TRENDS: Array<ITrends>,
    BOT_INAUGURATION_CHECK: IBotInauguration[]
}

export interface IFinishedDashboard {
    TOTAL_FUNDS: number,
    CAPITAL_EXPENDITURE: number,
    RESERVE: number,
    CAC_STATUS: number,
    CAC_DOCUMENT: string,
    CAC_YEAR: number,
    YEAR_START: number,
    YEAR_EXPIRED: number,
    YEAR_NEEDS: number,
    STATUS_OF_NEED_ASSESSMENT: number,
    LEADER_CONSULTED: number,
    YOUTH_CONSULTED: number,
    WOMEN_CONSULTED: number,
    PWD_CONSULTED: number,
    DISTRIBUTION_MATRIX: string,
    DEVELOP_PLAN_AND_BUDGET_PERCENTAGE: number,
    TRENDS_YEAR: Array<string>,
    TRENDS_AMOUNT: Array<string>,
    COMPLETION_STATUS: number,
    DATE_UPDATED?: String,
    BOT_INAUGURATION_CHECK: IBotInauguration
}

