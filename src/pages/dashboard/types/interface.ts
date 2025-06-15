export interface IDashboardStore {
    isLoading: boolean;
    dashboardData: IFinishedDashboard | null;
    transformDashboard(data: IGeneralDashboard): IFinishedDashboard;
    getDashboard(): Promise<void>;
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
}

interface ConflictStatusPercentage  {
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
    STATISTICS_PERCENTAGE:IStatistsPercentage[]
}

// Subtypes
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
