import { makeAutoObservable, ObservableMap } from "mobx";
import { IProjectCategory, IProjectPayload, IProjectStore, IProjectView, IQualityRating, IStatusReport, ITypeOfWork, TabType } from "../types/interface";
import { projectService } from "../service/projectService";

class ProjectStore implements IProjectStore {
    isLoading: boolean = false;
    isSubmitting: boolean = false;
    isDashboardLoading: boolean = false;
    selectedProjectScreen: number | null = null;
    selectedProject: IProjectView | null = null;
    projects = new ObservableMap<string, IProjectView>();
    projectCategories = new ObservableMap<number, IProjectCategory>();
    qualityRating = new ObservableMap<number, IQualityRating>();
    statusReport = new ObservableMap<number, IStatusReport>();
    typeOfWork = new ObservableMap<number, ITypeOfWork>();
    formTab = new ObservableMap<number, TabType>();
    activeTap: TabType | null = null;
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
                name: "Create Segments",
                desc: "Get full control over your audience",
                isCompleted: false,
                isVisible: false,
                isActive: false
            }

        ];

        this.formTab.clear()
        tabs.forEach((t: TabType) => {
            this.formTab.set(t.id, t)
            if (t.id == 1) {
                this.activeTap = t
            }
        })

    }
    getUpdateFormSteps(n: number, id: number): void {

        let tab = this.formTab.get(id)
        if (n == 1) {
            this.formTab.set(tab?.id as number, { ...tab, isVisible: !tab?.isVisible, } as TabType)
        } else {
            this.formTab.set(tab?.id as number, { ...tab, isCompleted: !tab?.isCompleted, } as TabType)
        }
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
            // this.isDashboardLoading = false;
            // this.dashboardData = null;
            await projectService.createAndUpdateProject(payload);
            await this.getProjects(payload.data.trustId || "");
            // await this.getConflictDashboardByTrustId(trustId || "")
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
}
export const projectStore = new ProjectStore();