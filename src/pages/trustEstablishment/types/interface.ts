import { ObservableMap } from "mobx";
import { IUploadPayload } from "../../project/types/interface";
import { HCDTRequestResponse } from "../../../infrastructure/HCDTRequestResponse";

export interface ITrustEstablishmentStore {
    isLoading: boolean;
    isSubmitting: boolean;
    pageSwitch: number;
    isDashboardLoading: boolean;
    isDeleting: boolean;
    operationCount: ObservableMap<string, number>;
    trustEstablishmentStatus: ITrustEstablishmentStatus | null;
    dashboardData: IFinishedDashboard | null;
    createTrustEstablishment(payload: ITrustEstablishmentPayload): Promise<boolean>;
    calculateTrustEstablishmentCompletion(data: ITrustEstablishmentPayload): number;
    getSingleTrustEstablishmentStatus(trustId: string): Promise<void>;
    uploadFile(payload: IUploadPayload): Promise<HCDTRequestResponse>;
    destroyCACDocument(url: string, trustEstablishmentId: string): Promise<void>;
    destroyMatrixDocument(url: string, trustEstablishmentId: string): Promise<void>;
    transformDashboard(data: IEstablishmentDashboard): IFinishedDashboard;
    getEstablishmentDashboardByTrustId(trustId: string): Promise<void>;
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
    yearOfFundsReceivedByTrust: number,
    totalFundsReceivedByTrust: number,
    capitalExpenditure: number,
    reserve: number,
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
    yearOfFundsReceivedByTrust?: number | null;
    totalFundsReceivedByTrust?: number | null;
    capitalExpenditure?: number | null;
    reserve?: number | null;
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
}

export interface IFinishedDashboard {
    TOTAL_FUNDS: number,
    CAPITAL_EXPENDITURE: number,
    RESERVE: number,
    CAC_STATUS: number,
    CAC_DOCUMENT: string,
    YEAR_START: number,
    YEAR_EXPIRED: number,
    YEAR_NEEDS: number,
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
}

