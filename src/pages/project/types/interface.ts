import { ObservableMap } from "mobx";
import { HCDTRequestResponse } from "../../../infrastructure/HCDTRequestResponse";

export interface IProjectStore {
    isLoading: boolean;
    isSubmitting: boolean;
    isDashboardLoading: boolean;
    isSaving: boolean;
    isDashboardSwitch: boolean;
    isViewDialogOpen: boolean;
    selectedProject: IProjectView | null;
    selectedProjectScreen: number | null;
    projects: ObservableMap<string, IProjectView>;
    projectCategories: ObservableMap<number, IProjectCategory>;
    qualityRating: ObservableMap<number, IQualityRating>;
    statusReport: ObservableMap<number, IStatusReport>;
    typeOfWork: ObservableMap<number, ITypeOfWork>;
    formTab: ObservableMap<number, TabType>;
    activeTap: TabType | null;
    projectFormData: IProjectPayloadData;

    getFormSteps(): void;
    getUpdateFormSteps(n: number, id: number): void;
    setActiveTab(active: TabType): void;
    setCompletedTab(): void;
    getProjects(trustId: string): Promise<boolean>;
    createProject(payload: IProjectPayload): Promise<boolean>;
    getCategory(): Promise<boolean>;
    getQualityRatting(): Promise<boolean>;
    getStatusReport(): Promise<boolean>;
    getTypeOfWork(): Promise<boolean>;
    uploadFile(payload: IUploadPayload): Promise<HCDTRequestResponse>;
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
    projectId?: string,
    projectTitle?: string,
    projectCategoryId?: number,
    totalBudget?: number,
    community?: string,
    awardDate?: string,
    nameOfContractor?: string,
    annualApprovedBudget?: string,
    projectStatus?: number,
    qualityRatingId?: number,
    projectVideo?: string,
    projectVideoMimeType?: string,
    numberOfMaleEmployedByContractor?: number,
    numberOfFemaleEmployedByContractor?: number,
    numberOfPwDsEmployedByContractor?: number,
    typeOfWork?: string,
    numberOfHostCommunityMemberContracted?: number,
    numberOfMaleBenefited?: number,
    numberOfFemaleBenefited?: number,
    numberOfPwDsBenefited?: number,
    trustId?: string
}
export interface IProjectPayload {
    isCreate: boolean,
    data: IProjectPayloadData
}

export interface TabType {
    id: number;
    name: string;
    desc: string;
    isCompleted: boolean;
    isVisible: boolean;
    isActive: boolean;
}

export interface IUploadPayload {
    base64String: string,
    mimeType: string

}
interface ITotalBudget {
    totalBudget: number
}
interface IAnnualApprovedBudget {
    annualApprovedBudget: number
}
interface IBenefit {

    totalMales: number,
    totalFemales: number,
    totalPwDs: number,
    totalBeneficiaries: number,

}
interface IEmployees {
    totalMales: number,
    totalFemales: number,
    totalPwDs: number,
    totalEmployees: number,
}
interface ICategory {

    EDUCATION: number,
    HEALTH: number,
    ELECTRIFICATION: number,
    ROAD: number,
    WATER: number,
    INFORMATION_TECHNOLOGY: number,
    AGRICULTURE: number,
}

interface IStatus {

    YET_TO_START: number,
    IN_PROGRESS: number,
    GOOD: number,
    COMPLETED: number,
    ABANDONED: number,
}

export interface ITopProject{
    trustName: string,
    projectTitle: string,
    community: string,
    createAt: string,
    rating: number
}

export interface IDashboard {
    TOP_PROJECT: Array<ITopProject>,
    BENEFITS: Array<IBenefit>,
    EMPLOYMENT: Array<IEmployees>,
    CATEGORY: Array<ICategory>,
    STATUS: Array<IStatus>
}

export interface IDashboardData {
    TOP_PROJECT: Array<ITopProject>,
    BENEFITS: Array<number>,
    EMPLOYMENT: Array<number>,
    CATEGORY: Array<number>,
    STATUS: Array<number>
}

