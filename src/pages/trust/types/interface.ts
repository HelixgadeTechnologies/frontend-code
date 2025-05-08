import { ObservableMap } from "mobx";
export interface ITrustStore {
    isLoading: boolean,
    isSubmitting: boolean,
    isDeleting: boolean,
    selectedTrust: ITrustList | null,
    selectedTrustId: string | undefined,
    trust: ITrust,
    trustEstablishmentStatus: ITrustEstablishmentStatus,
    allTrust: ObservableMap<string, ITrustList>;
    getAllTrust(): Promise<boolean>,
    createTrust(payload: ITrustPayload): Promise<boolean>,
    updateTrust(payload: ITrustPayload): Promise<boolean>,
    getSingleTrust(trustId: string): Promise<void>,
    removeTrust(trustId: string): Promise<boolean>,
    createTrustEstablishment(payload: ITrustEstablishmentPayload): Promise<boolean>,
    getSingleTrustEstablishmentStatus(trustId: string): Promise<void>
}
export interface ITrust {
    trustId: string;
    trustName: string;
    settlorId: string;
    settlorName: string;
    nameOfOmls: string;
    userId: string;
    userFirstName: string;
    userLastName: string;
    country: string;
    state: string;
    localGovernmentArea: string;
    trustCommunities: string;
    botDetailsOneFirstName: string;
    botDetailsOneLastName: string;
    botDetailsOneEmail: string;
    botDetailsOnePhoneNumber: string;
    botDetailsTwoFirstName: string;
    botDetailsTwoLastName: string;
    botDetailsTwoEmail: string;
    botDetailsTwoPhoneNumber: string;


    totalMaleBotMembers: number;
    totalFemaleBotMembers: number;
    totalPwdBotMembers: number;
    totalMaleAdvisoryCommitteeMembers: number;
    totalFemaleAdvisoryCommitteeMembers: number;
    totalPwdAdvisoryCommitteeMembers: number;
    totalMaleManagementCommitteeMembers: number;
    totalFemaleManagementCommitteeMembers: number;
    totalPwdManagementCommitteeMembers: number;
    createAt: string;
}
export interface ITrustList {
    trustId: string;
    trustName: string;
    settlorId: string;
    settlorName: string;
    nameOfOmls: string;
    userId: string;
    userFirstName: string;
    userLastName: string;
    country: string;
    state: string;
    localGovernmentArea: string;
    trustCommunities: string;
    totalMaleBotMembers: number;
    totalFemaleBotMembers: number;
    totalPwdBotMembers: number;
    totalMaleAdvisoryCommitteeMembers: number;
    totalFemaleAdvisoryCommitteeMembers: number;
    totalPwdAdvisoryCommitteeMembers: number;
    totalMaleManagementCommitteeMembers: number;
    totalFemaleManagementCommitteeMembers: number;
    totalPwdManagementCommitteeMembers: number;
    botDetailsOneFirstName: string;
    botDetailsOneLastName: string;
    botDetailsOneEmail: string;
    botDetailsOnePhoneNumber: string;
    botDetailsTwoFirstName: string;
    botDetailsTwoLastName: string;
    botDetailsTwoEmail: string;
    botDetailsTwoPhoneNumber: string;

    createAt: string;
}

export interface ITrustPayloadData {
    trustId: string,
    trustName: string,
    settlorId: string,
    nameOfOmls: string,
    userId: string,
    country: string,
    state: string,
    localGovernmentArea: string,
    trustCommunities: string,

    botDetailsOneFirstName: string;
    botDetailsOneLastName: string;
    botDetailsOneEmail: string;
    botDetailsOnePhoneNumber: string;
    botDetailsTwoFirstName: string;
    botDetailsTwoLastName: string;
    botDetailsTwoEmail: string;
    botDetailsTwoPhoneNumber: string;

    totalMaleBotMembers: number,
    totalFemaleBotMembers: number,
    totalPwdBotMembers: number,
    totalMaleAdvisoryCommitteeMembers: number,
    totalFemaleAdvisoryCommitteeMembers: number,
    totalPwdAdvisoryCommitteeMembers: number,
    totalMaleManagementCommitteeMembers: number,
    totalFemaleManagementCommitteeMembers: number,
    totalPwdManagementCommitteeMembers: number
}


export interface ITrustPayload {
    isCreate: boolean,
    data: ITrustPayloadData
}

export interface ITrustEstablishmentPayload {
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