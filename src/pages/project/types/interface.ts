import { ObservableMap } from "mobx";

export interface IProjectStore {
    isLoading: boolean;
    isSubmitting: boolean;
    isDashboardLoading: boolean;
    selectedProject: IProjectView | null;
    projects: ObservableMap<string, IProjectView>;
    projectCategories: ObservableMap<number, IProjectCategory>;
    qualityRating: ObservableMap<number, IQualityRating>;
    statusReport: ObservableMap<number, IStatusReport>;
    typeOfWork: ObservableMap<number, ITypeOfWork>;

    getProjects(trustId: string): Promise<boolean>;
    createProject(payload: IProjectPayload): Promise<boolean>;
    getCategory(): Promise<boolean>;
    getQualityRatting(): Promise<boolean>;
    getStatusReport(): Promise<boolean>;
    getTypeOfWork(): Promise<boolean>;
}
interface BaseItem {
    id: string;
}
export interface IProjectView extends BaseItem {
    projectId: string;
    projectTitle: string | null;
    projectCategory: string | null;
    totalBudget: number | null;
    community: string | null;
    awardDate: string | null;
    nameOfContractor: string | null;
    annualApprovedBudget: string | null;
    projectStatus: number | null;
    projectStatusName: string | null;
    qualityRatingId: number | null;
    qualityRatingName: string | null;
    projectVideo: string | null;
    projectVideoMimeType: string | null;
    numberOfMaleEmployedByContractor: number | null;
    numberOfFemaleEmployedByContractor: number | null;
    numberOfPwDsEmployedByContractor: number | null;
    typeOfWork: string | null;
    numberOfHostCommunityMemberContracted: number | null;
    numberOfMaleBenefited: number | null;
    numberOfFemaleBenefited: number | null;
    numberOfPwDsBenefited: number | null;
    trustId: string | null;
    createAt: Date | null;
    updateAt: Date | null;
}


export interface IProjectCategory {
    projectCategoryId: number;
    categoryName?: string | null;
}

export interface IQualityRating {
    qualityRatingId: number;
    qualityRating?: string | null;
}

export interface IStatusReport {
    statusReportId: number;
    statusReport?: string | null;
}

export interface ITypeOfWork {
    typeOfWorkId: number;
    typeOfWork?: string | null;
}

export interface IProjectPayloadData {
    projectId: string,
    projectTitle: string,
    projectCategoryId: number,
    totalBudget: number,
    community: string,
    awardDate: string,
    nameOfContractor: string,
    annualApprovedBudget: string,
    projectStatus: number,
    qualityRatingId: number,
    projectVideo: string,
    projectVideoMimeType: string,
    numberOfMaleEmployedByContractor: number,
    numberOfFemaleEmployedByContractor: number,
    numberOfPwDsEmployedByContractor: number,
    typeOfWork: string,
    numberOfHostCommunityMemberContracted: number,
    numberOfMaleBenefited: number,
    numberOfFemaleBenefited: number,
    numberOfPwDsBenefited: number,
    trustId: string
}
export interface IProjectPayload {
    isCreate: boolean,
    data: IProjectPayloadData
}