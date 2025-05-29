import { ObservableMap } from "mobx";
export interface ITrustStore {
    isLoading: boolean,
    isSubmitting: boolean,
    isDeleting: boolean,
    selectedTrust: ITrustList | null,
    selectedTrustId: string | undefined,
    trust: ITrust,
    allTrust: ObservableMap<string, ITrustList>;
    getAllTrust(): Promise<boolean>,
    createTrust(payload: ITrustPayload): Promise<boolean>,
    updateTrust(payload: ITrustPayload): Promise<boolean>,
    getSingleTrust(trustId: string): Promise<void>,
    removeTrust(trustId: string): Promise<boolean>,
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
    trustId?: string,
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

