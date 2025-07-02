export interface IDashboardStore {
    isLoading: boolean;
    dashboardData: IFinishedDashboard | null;
    selectedYear: number;
    selectedState: string;
    selectedSettlor: string;
    selectedTrust: string;
    transformDashboard(data: IGeneralDashboard): IFinishedDashboard;
    getDashboard(trustId:string,year: number, state: string, settlor: string): Promise<void>;
}
export interface IFinishedDashboard {
    FIELDS_COMPLETION: number;
    COMPLETION_STATUS: CompletionStatus;
    COMMUNITY_BENEFIT: { state: string[]; total: number[] };
    STATISTICS: Statists;
    OPERATIONAL_EXPENDITURE: OperationalExpenditure;
    QUALITY_RATINGS: QualityRating[];
    COMPLETION_OVER_MONTH: { monthName: string[]; total: number[] };
    PROJECT_DETAILS: ProjectDetail[];
    CONFLICT_RESOLUTION_OVER_TIME: ConflictResolutionOverTime[];
    CONFLICT_RESOLUTION_PERCENTAGE: ConflictStatusPercentage,
    CONFLICT_RESOLUTION_DETAILS: ConflictDetail[];
    TOTAL_WORKER_IN_PROJECT: WorkersInProject[];
    EMPLOYEE_PER_PROJECT: EmployeePerProject[];
    STATISTICS_PERCENTAGE: IStatistsPercentage;
    DISTRIBUTION_MATRIX: IDistributionMatrix;
    NEEDS_ASSESSMENT_COMMUNITY_COUNT: INeedsAssessmentCommunityCount;
    BOT_DISPLAY: { male: number[]; female: number[]; pwd: number[] };
    CONFLICT_RESOLUTION_OVER: IConflictResolutionOverTime[];
    BOT_INAUGURATION_CHECK: IBotInauguration;
    COMMUNITY_LEADERSHIP_PERCENTAGE: ICommunityLeadersP;
    NEEDS_ASSESSMENT_PERCENTAGE: INeedsAssessmentStatusP;
}

interface ConflictStatusPercentage {
    resolvedPercentage: number,
    unresolvedPercentage: number
}
interface ConflictDetail {
    causeOfConflictName: string,
    partiesInvolveName: string,
    community: string,
    conflictStatusName: string,
}
// interface ConflictDetail{
//     causeOfConflictName:string,
//     partiesInvolveName:string,
//     community:string,
//     conflictStatusName:string,
// }
export interface IGeneralDashboard {
    FIELDS_COMPLETION: FieldsCompletion[];
    COMPLETION_STATUS: CompletionStatus[];
    COMMUNITY_BENEFIT: CommunityBenefit[];
    STATISTICS: Statists[];
    OPERATIONAL_EXPENDITURE: OperationalExpenditure[];
    QUALITY_RATINGS: QualityRating[];
    COMPLETION_OVER_MONTH: CompletionOverMonth[];
    PROJECT_DETAILS: ProjectDetail[];
    CONFLICT_RESOLUTION_OVER_TIME: ConflictResolutionOverTime[];
    CONFLICT_RESOLUTION_PERCENTAGE: ConflictStatusPercentage[],
    CONFLICT_RESOLUTION_DETAILS: ConflictDetail[],
    TOTAL_WORKER_IN_PROJECT: WorkersInProject[],
    EMPLOYEE_PER_PROJECT: EmployeePerProject[];
    STATISTICS_PERCENTAGE: IStatistsPercentage[];
    DISTRIBUTION_MATRIX: IDistributionMatrix[];
    NEEDS_ASSESSMENT_COMMUNITY_COUNT: INeedsAssessmentCommunityCount[],
    BOT_DISPLAY: ICommitteeBOTMemberStats[];
    CONFLICT_RESOLUTION_OVER: IConflictResolutionOverTime[]
    BOT_INAUGURATION_CHECK: IBotInauguration[]
    COMMUNITY_LEADERSHIP_PERCENTAGE: ICommunityLeadersP[];
    NEEDS_ASSESSMENT_PERCENTAGE: INeedsAssessmentStatusP[];
}

export interface INeedsAssessmentStatusP {
    percentage_status_1: number,
    percentage_status_2: number,
    percentage_status_3: number,
}
export interface ICommunityLeadersP {
    communityLeadershipPercentage: number,
    communityYouthsPercentage: number,
    communityWomenPercentage: number,
    pwDsPercentage: number,
}
export interface IBotInauguration {
    botYesPercentage: number,
    managementYesPercentage: number,
    advisoryYesPercentage: number,
}
export interface IConflictResolutionOverTime {
    partiesInvolveId: number,
    partyName: string,
    percentage: number,
}

// Subtypes
export interface ICommitteeBOTMemberStats {
    totalMaleBotMembers: number;
    totalFemaleBotMembers: number;
    totalPwdBotMembers: number;

    totalMaleAdvisoryCommitteeMembers: number;
    totalFemaleAdvisoryCommitteeMembers: number;
    totalPwdAdvisoryCommitteeMembers: number;

    totalMaleManagementCommitteeMembers: number;
    totalFemaleManagementCommitteeMembers: number;
    totalPwdManagementCommitteeMembers: number;
}
interface INeedsAssessmentCommunityCount {
    distinct_community_count: number;
}
interface IDistributionMatrix {
    total_complete: number;
}
interface IStatistsPercentage {
    fully_received_percentage: number;
}
interface Statists {
    community_count: number;
}
interface FieldsCompletion {
    percentFullyEstablished: number;
}

interface CompletionStatus {
    totalCompleteTrust: number;
    percentFullyEstablished: number;
    totalTrust: number;
}

interface CommunityBenefit {
    state: string;
    community_count: number;
}

interface OperationalExpenditure {
    totalExpenditure: number;
}

interface QualityRating {
    qualityRating: string;
    ratingCount: number;
    percentage: number;
    color: string;
}

interface CompletionOverMonth {
    monthName: string;
    totalCompleted: number;
}

interface ProjectDetail {
    trustName: string;
    projectTitle: string;
    community: string;
    completeAt: string;
    rating: number;
}

interface ConflictResolutionOverTime {
    month: number;
    inCourt: number;
    notInCourt: number;
}

interface WorkersInProject {
    projectTitle: string;
    community: string;
    totalEmployed: number;
}

interface EmployeePerProject {
    projectTitle: string;
    numberOfMaleEmployedByContractor: number;
    numberOfFemaleEmployedByContractor: number;
    numberOfPwDsEmployedByContractor: number;
}
