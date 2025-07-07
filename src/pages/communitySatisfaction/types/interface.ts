import { ObservableMap } from "mobx";

export interface ISatisfactionStore {
    isLoading: boolean;
    isSubmitting: boolean;
    isDeleting: boolean;
    isAddModelOpen: boolean;
    isDashboardLoading: boolean;
    isAddFunctionalityNeeded: boolean;
    selectedSatisfaction: IAverageCommunitySatisfactionView | null;
    satisfaction: IAverageCommunitySatisfactionView;
    allSatisfaction: ObservableMap<string, IAverageCommunitySatisfactionView>;
    satisfactionByTrust: ObservableMap<string, IAverageCommunitySatisfactionView>;
    optionOne: ObservableMap<number, IAcsOptionOne>;
    optionTwo: ObservableMap<number, IAcsOptionTwo>;
    dashboardData: ISatisfactionDashboardData | null;
    getSatisfaction(): Promise<boolean>;
    createSatisfaction(payload: ISatisfactionPayload): Promise<boolean>;
    updateSatisfaction(payload: ISatisfactionPayload): Promise<boolean>;
    getSatisfactionByTrustId(trustId: string): Promise<boolean>;
    extractDashboardData(dashboard: IAverageCommunitySatisfactionDashboardData): ISatisfactionDashboardData;
    getSatisfactionDashboardByTrustId(trustId: string, selectedYear: number, selectedState: string, settlor: string): Promise<void>;
    getSatisfactionById(satisfactionId: string): Promise<boolean>
    getOptionOne(): Promise<boolean>;
    getOptionTwo(): Promise<boolean>;
}

export interface ISatisfactionPayloadData {
    averageCommunitySatisfactionId?: string,
    infoProjects?: number,
    communityConsult?: number,
    localParticipation?: number,
    reportMechanism?: number,
    conflictMinimization?: number,
    settlorAction?: number,
    nuprcAction?: number,
    projectHandover?: number,
    maintenanceConsult?: number,
    incomeProject?: number,
    trustId: string
}
export interface ISatisfactionPayload {
    isCreate: boolean,
    data: ISatisfactionPayloadData
}

export interface IAverageCommunitySatisfaction {
    averageCommunitySatisfactionId: string;
    infoProjects?: number | null;
    communityConsult?: number | null;
    localParticipation?: number | null;
    reportMechanism?: number | null;
    conflictMinimization?: number | null;
    settlorAction?: number | null;
    nuprcAction?: number | null;
    projectHandover?: number | null;
    maintenanceConsult?: number | null;
    incomeProject?: number | null;
    trustId?: string | null;
    createAt?: string | null;
}
interface BaseItem {
    id: string;
}
export interface IAverageCommunitySatisfactionView extends BaseItem {
    averageCommunitySatisfactionId: string;
    infoProjects?: number | null;
    communityConsult?: number | null;
    localParticipation?: number | null;
    reportMechanism?: number | null;
    conflictMinimization?: number | null;
    settlorAction?: number | null;
    nuprcAction?: number | null;

    infoProjectsStatus?: string | null;
    communityConsultStatus?: string | null;
    localParticipationStatus?: string | null;
    reportMechanismStatus?: string | null;
    conflictMinimizationStatus?: string | null;
    settlorActionStatus?: string | null;
    nuprcActionStatus?: string | null;

    projectHandover?: number | null;
    maintenanceConsult?: number | null;
    incomeProject?: number | null;

    projectHandoverStatus?: string | null;
    maintenanceConsultStatus?: string | null;
    incomeProjectStatus?: string | null;
    trustId?: string | null;
    trustName?: string | null;
    createAt?: string | null;
}

export interface IAcsOptionOne {
    acsOptionOneId: number;
    acsOptionOne: string;
}

export interface IAcsOptionTwo {
    acsOptionTwoId: number;
    acsOptionTwo: string;
}


export interface IAverageCommunitySatisfactionDashboardDataOne {
    QUESTION: string,
    RESPONSE: {
        "STRONGLY DISAGREE": string,
        "DISAGREE": string,
        "SLIGHTLY AGREE": string,
        "AGREE": string,
        "STRONGLY AGREE": string
    },
    "VALUE TYPE": string
}
export interface IAverageCommunitySatisfactionDashboardDataTwo {
    QUESTION: string,
    RESPONSE: {
        "TRUE": string,
        "IN PROGRESS": string,
        "NOT TRUE": string,
        "PROJECT YET TO BE IMPLEMENTED IN MY COMMUNITY": string
    },
    "VALUE TYPE": string
}
export interface IAverageCommunitySatisfactionDashboardData {
    infoProjects: Array<IAverageCommunitySatisfactionDashboardDataOne>;
    communityConsult: Array<IAverageCommunitySatisfactionDashboardDataOne>;
    localParticipation: Array<IAverageCommunitySatisfactionDashboardDataOne>;
    reportMechanism: Array<IAverageCommunitySatisfactionDashboardDataOne>;
    conflictMinimization: Array<IAverageCommunitySatisfactionDashboardDataOne>;
    settlorAction: Array<IAverageCommunitySatisfactionDashboardDataOne>;
    nuprcAction: Array<IAverageCommunitySatisfactionDashboardDataOne>;

    projectHandover: Array<IAverageCommunitySatisfactionDashboardDataTwo>;
    maintenanceConsult: Array<IAverageCommunitySatisfactionDashboardDataTwo>;
    incomeProject: Array<IAverageCommunitySatisfactionDashboardDataTwo>;
}
export interface ISatisfactionDashboardData {
    infoProjects: Array<number>;
    communityConsult: Array<number>;
    localParticipation: Array<number>;
    reportMechanism: Array<number>;
    conflictMinimization: Array<number>;
    settlorAction: Array<number>;
    nuprcAction: Array<number>;


    projectHandover: Array<number>;
    maintenanceConsult: Array<number>;
    incomeProject: Array<number>;
}
