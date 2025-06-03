import { makeAutoObservable, ObservableMap, toJS } from "mobx";
import { IDashboard, IDashboardData, IProjectCategory, IProjectPayload, IProjectPayloadData, IProjectStore, IProjectView, IQualityRating, IStatusReport, ITypeOfWork, IUploadPayload, TabType } from "../types/interface";
import { projectService } from "../service/projectService";
import { HCDTRequestResponse } from "../../../infrastructure/HCDTRequestResponse";

class ProjectStore implements IProjectStore {
    isLoading: boolean = false;
    isSubmitting: boolean = false;
    isDashboardLoading: boolean = false;
    isSaving: boolean = false;
    isDashboardSwitch: boolean = true;
    isViewDialogOpen: boolean = false;
    selectedProjectScreen: number | null = null;
    selectedProject: IProjectView | null = null;
    projects = new ObservableMap<string, IProjectView>();
    projectCategories = new ObservableMap<number, IProjectCategory>();
    qualityRating = new ObservableMap<number, IQualityRating>();
    statusReport = new ObservableMap<number, IStatusReport>();
    typeOfWork = new ObservableMap<number, ITypeOfWork>();
    formTab = new ObservableMap<number, TabType>();
    projectFormData: IProjectPayloadData = {} as IProjectPayloadData
    activeTap: TabType | null = null;
    dashboardData: IDashboardData | null = null;

    constructor() {
        makeAutoObservable(this);
    }


    getFormSteps(): void {
        const tabs: TabType[] = [
            {
                id: 1,
                name: "Create New Project",
                desc: "Fill out these details and get your trust ready",
                isCompleted: false,
                isVisible: true,
                isActive: true
            },
            {
                id: 2,
                name: "Employee Details",
                desc: "Get full control over your employee",
                isCompleted: false,
                isVisible: false,
                isActive: false
            },
            {
                id: 3,
                name: "Beneficiary Details",
                desc: "Get full control over your beneficiary",
                isCompleted: false,
                isVisible: false,
                isActive: false
            },
            {
                id: 4,
                name: "Preview",
                desc: "Preview the imputed data",
                isCompleted: false,
                isVisible: false,
                isActive: false
            },

        ];

        this.formTab.clear()
        tabs.forEach((t: TabType) => {
            this.formTab.set(t.id, t)
            if (t.id == 1) {
                this.activeTap = t
            }
        })

    }
    setActiveTab(active: TabType): void {
        const prev = this.activeTap
        this.formTab.set(prev?.id as number, { ...prev, isActive: false } as TabType)
        this.formTab.set(active.id, { ...active, isActive: true } as TabType)
        this.activeTap = active
    }
    setCompletedTab(): void {
        const prev = this.activeTap
        this.formTab.set(prev?.id as number, { ...prev, isActive: false, isCompleted: true } as TabType)
        if (prev?.id != 4) {
            const active = this.formTab.get(Number(prev?.id) + 1)
            this.formTab.set(active?.id!, { ...active, isActive: true } as TabType)
            this.activeTap = active as TabType
        }
    }

    getUpdateFormSteps(n: number, id: number): void {

        let tab = this.formTab.get(id)
        console.log("tab", toJS(tab))
        if (n == 1) {
            this.formTab.set(tab?.id as number, { ...tab, isVisible: !tab?.isVisible, } as TabType)
        } else {
            this.formTab.set(tab?.id as number, { ...tab, isCompleted: !tab?.isCompleted, } as TabType)
        }
        console.log("get update", toJS(this.formTab.get(id)))
    }

    async getProjects(trustId: string): Promise<boolean> {
        try {
            this.isLoading = true;
            let data = await projectService.getByTrustId(trustId);
            if (data.success) {
                this.projects.clear();
                data.data.forEach((project: IProjectView) => {
                    this.projects.set(project.projectId, project);
                });
            }
            return true;
        } catch (error) {
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    async createProject(payload: IProjectPayload): Promise<boolean> {
        try {
            this.isSubmitting = true;
            this.isDashboardLoading = false;
            this.dashboardData = null;
            await projectService.createAndUpdateProject(payload);
            await this.getProjects(payload.data.trustId || "");
            await this.getProjectDashboardByTrustId(payload.data.trustId || "")
            return true;
        } catch (error) {
            throw error;
        } finally {
            this.isSubmitting = false;
        }
    }

    async getCategory(): Promise<boolean> {
        try {
            if ([...this.projectCategories.values()].length == 0) {

                this.isLoading = true;
                let data = await projectService.getProjectCategory();
                if (data.success) {
                    this.projectCategories.clear();
                    data.data.forEach((category: IProjectCategory) => {
                        this.projectCategories.set(category.projectCategoryId, category);
                    });
                }
            }
            return true;
        } catch (error) {
            throw error;
        } finally {
            this.isLoading = false;
        }
    }
    async getQualityRatting(): Promise<boolean> {
        try {
            if ([...this.qualityRating.values()].length == 0) {
                this.isLoading = true;
                let data = await projectService.getProjectQualityRatting();
                if (data.success) {
                    this.qualityRating.clear();
                    data.data.forEach((rating: IQualityRating) => {
                        this.qualityRating.set(rating.qualityRatingId, rating);
                    });
                }
            }
            return true;
        } catch (error) {
            throw error;
        } finally {
            this.isLoading = false;
        }
    }
    async getStatusReport(): Promise<boolean> {
        try {
            if ([...this.statusReport.values()].length == 0) {
                this.isLoading = true;
                let data = await projectService.getProjectStatusReport();
                if (data.success) {
                    this.statusReport.clear();
                    data.data.forEach((report: IStatusReport) => {
                        this.statusReport.set(report.statusReportId, report);
                    });
                }
            }
            return true;
        } catch (error) {
            throw error;
        } finally {
            this.isLoading = false;
        }
    }
    async getTypeOfWork(): Promise<boolean> {
        try {
            if ([...this.typeOfWork.values()].length == 0) {
                this.isLoading = true;
                let data = await projectService.getProjectTypeOfWork();
                if (data.success) {
                    this.typeOfWork.clear();
                    data.data.forEach((work: ITypeOfWork) => {
                        this.typeOfWork.set(work.typeOfWorkId, work);
                    });
                }
            }
            return true;
        } catch (error) {
            throw error;
        } finally {
            this.isLoading = false;
        }
    }
    async uploadFile(payload: IUploadPayload): Promise<HCDTRequestResponse> {
        try {
            let data = await projectService.upload(payload);
            return data;
        } catch (error) {
            throw error;
        }
    }
    transformProjectDashboard(data: IDashboard): IDashboardData {
        return {
            TOTAL_BUDGET: data.TOTAL_BUDGET[0].totalBudget,
            TOTAL_ANNUAL_BUDGET: data.TOTAL_ANNUAL_BUDGET[0].annualApprovedBudget,
            BENEFITS: [
                data.BENEFITS[0].totalMales,
                data.BENEFITS[0].totalFemales,
                data.BENEFITS[0].totalPwDs,
            ],
            EMPLOYMENT: [
                data.EMPLOYMENT[0].totalMales,
                data.EMPLOYMENT[0].totalFemales,
                data.EMPLOYMENT[0].totalPwDs,
            ],
            CATEGORY: [
                data.CATEGORY[0].EDUCATION,
                data.CATEGORY[0].ELECTRIFICATION,
                data.CATEGORY[0].AGRICULTURE,
                data.CATEGORY[0].HEALTH,
                data.CATEGORY[0].INFORMATION_TECHNOLOGY,
                data.CATEGORY[0].ROAD,
                data.CATEGORY[0].WATER,
            ],
            STATUS: [
                data.STATUS[0].YET_TO_START,
                data.STATUS[0].IN_PROGRESS,
                data.STATUS[0].COMPLETED,
                data.STATUS[0].GOOD,
                data.STATUS[0].ABANDONED,
            ]
        };
    }

    async getProjectDashboardByTrustId(trustId: string): Promise<void> {
        try {
            if (this.isDashboardLoading || this.dashboardData) return; // Prevent duplicate calls
            this.isDashboardLoading = true;
            let data = await projectService.getDashboard(trustId);
            if (data.success) {
                const processedData = this.transformProjectDashboard(data.data);
                this.dashboardData = processedData;
                // console.log(toJS(processedData))
            }
        } catch (error) {
            throw error;
        } finally {
            this.isDashboardLoading = false;
        }
    }
}


export const projectStore = new ProjectStore();