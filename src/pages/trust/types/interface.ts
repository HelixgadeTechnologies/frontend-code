import { ObservableMap } from "mobx";
import { TabType } from "../../project/types/interface";
export interface ITrustStore {
    isLoading: boolean;
    isSubmitting: boolean;
    isSaving: boolean;
    isDeleting: boolean;
    setConflictForm: boolean;
    setSatisfactionForm: boolean;
    setEconomicImpactForm: boolean;
    pageSwitched: number;
    pageSwitchedG: number;
    selectedTrust: ITrustList | null;
    selectedTrustId: string | undefined;
    selectedTrustIdG: string | undefined;
    trust: ITrust;
    allTrust: ObservableMap<string, ITrustList>;
    allTrustList: ObservableMap<string, ITrustList>;
    formTab: ObservableMap<number, TabType>;
    activeTap: TabType | null;
    trustFormData: ITrustPayloadData;
    selectedState: string;
    selectedLGA: string;
    allStates: ObservableMap<string, string>;
    allLGA: ObservableMap<string, string>;
    calculateTrustCompletion(data: ITrustPayloadData): number;
    getFormSteps(): void;
    setActiveTab(active: TabType): void;
    setCompletedTab(): void;
    getUpdateFormSteps(n: number, id: number): void;
    searchTrust(keyword: string): void;
    getAllTrust(): Promise<void>;
    getAllStates(): void;
    getLG(state: string): Array<string>;
    createTrust(payload: ITrustPayload): Promise<boolean>;
    updateTrust(payload: ITrustPayload): Promise<boolean>;
    getSingleTrust(trustId: string): Promise<void>;
    getATrust(trustId: string): Promise<void>
    removeTrust(trustId: string): Promise<boolean>;
}
export interface ITrust extends BaseItem {
    trustId: string;
    trustName: string;
    settlor: string;
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
    disableConflictSurvey: number;
    disableSatisfactionSurvey: number;
    disableEconomicImpactSurvey: number;
}
interface BaseItem {
    id: string;
}
export interface ITrustList extends BaseItem {
    trustId: string;
    trustName: string;
    settlor: string;
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
    disableConflictSurvey: number;
    disableSatisfactionSurvey: number;
    disableEconomicImpactSurvey: number;
}

export interface ITrustPayloadData {
    trustId?: string,
    trustName: string,
    settlor: string,
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
    totalPwdManagementCommitteeMembers: number,
    completionStatus?: number,
}


export interface ITrustPayload {
    isCreate: boolean,
    data: ITrustPayloadData
}

export interface IStateAndLGA {
    state: string,
    senatorial_districts: Array<string>,
    lgas: Array<string>,
}

export interface ISurveyType {
    type: "CONFLICT" | "SATISFACTION" | "ECONOMIC";
}

export interface ISurveyTypePayload {
    trustId: string;
    accessName: string; // "CONFLICT" | "SATISFACTION" | "ECONOMIC"
}