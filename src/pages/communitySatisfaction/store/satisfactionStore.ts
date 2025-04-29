import { makeAutoObservable, ObservableMap } from "mobx";
import { IAcsOptionOne, IAcsOptionTwo, IAverageCommunitySatisfactionDashboardData, IAverageCommunitySatisfactionView, ISatisfactionDashboardData, ISatisfactionPayload, ISatisfactionStore } from "../types/interface";
import { satisfactionService } from "../service/communitySatisfactionService";

class SatisfactionStore implements ISatisfactionStore {
    isLoading: boolean = false;
    isSubmitting: boolean = false;
    isDeleting: boolean = false;
    isAddModelOpen: boolean = false;
    isDashboardLoading: boolean = false;
    isAddFunctionalityNeeded: boolean = false;
    selectedSatisfaction: IAverageCommunitySatisfactionView | null = null;
    satisfaction: IAverageCommunitySatisfactionView = {} as IAverageCommunitySatisfactionView;
    allSatisfaction = new ObservableMap<string, IAverageCommunitySatisfactionView>();
    satisfactionByTrust = new ObservableMap<string, IAverageCommunitySatisfactionView>();
    optionOne = new ObservableMap<number, IAcsOptionOne>();
    optionTwo = new ObservableMap<number, IAcsOptionTwo>();
    dashboardData: ISatisfactionDashboardData | null = null
    constructor() {
        makeAutoObservable(this);
    }

    async getSatisfaction(): Promise<boolean> {
        try {
            this.isLoading = true;
            let data = await satisfactionService.getSatisfaction();
            if (data.success) {
                this.allSatisfaction.clear();
                data.data.forEach((satisfaction: IAverageCommunitySatisfactionView) => {
                    this.allSatisfaction.set(satisfaction.averageCommunitySatisfactionId, satisfaction);
                });
            }
            return true;
        } catch (error) {
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    async createSatisfaction(payload: ISatisfactionPayload): Promise<boolean> {
        try {
            this.isSubmitting = true;
            await satisfactionService.createAndUpdateSatisfaction(payload);
            await this.getSatisfactionByTrustId(payload.data.trustId || "");
            await this.getSatisfactionDashboardByTrustId(payload.data.trustId || "ALL");
            return true;
        } catch (error) {
            throw error;
        } finally {
            this.isSubmitting = false;
        }
    }

    async updateSatisfaction(payload: ISatisfactionPayload): Promise<boolean> {
        try {
            this.isSubmitting = true;
            let data = await satisfactionService.createAndUpdateSatisfaction(payload);
            if (data.success) {
                await this.getSatisfactionByTrustId(payload.data.trustId || "");
            }
            return true;
        } catch (error) {
            throw error;
        } finally {
            this.isSubmitting = false;
        }
    }

    async getSatisfactionByTrustId(trustId: string): Promise<boolean> {
        try {
            this.isLoading = true;
            let data = await satisfactionService.getByTrustId(trustId);
            if (data.success) {
                this.satisfactionByTrust.clear();
                data.data.forEach((satisfaction: IAverageCommunitySatisfactionView) => {
                    this.satisfactionByTrust.set(satisfaction.averageCommunitySatisfactionId, satisfaction);
                });
            }
            return true;
        } catch (error) {
            throw error;
        } finally {
            this.isLoading = false;
        }
    }
    extractDashboardData(dashboard: IAverageCommunitySatisfactionDashboardData): ISatisfactionDashboardData {
        const mapOptionOneResponse = (data: any) => {
            const response = data[0].RESPONSE;
            return [
                Number(response["STRONGLY DISAGREE"]),
                Number(response["DISAGREE"]),
                Number(response["SLIGHTLY AGREE"]),
                Number(response["AGREE"]),
                Number(response["STRONGLY AGREE"]),
            ];
        };

        const mapOptionTwoResponse = (data: any) => {
            const response = data[0].RESPONSE;
            return [
                Number(response["TRUE"]),
                Number(response["IN PROGRESS"]),
                Number(response["NOT TRUE"]),
                Number(response["PROJECT YET TO BE IMPLEMENTED IN MY COMMUNITY"])
            ];
        };

        return {
            infoProjects: mapOptionOneResponse(dashboard.infoProjects),
            communityConsult: mapOptionOneResponse(dashboard.communityConsult),
            localParticipation: mapOptionOneResponse(dashboard.localParticipation),
            reportMechanism: mapOptionOneResponse(dashboard.reportMechanism),
            conflictMinimization: mapOptionOneResponse(dashboard.conflictMinimization),

            projectHandover: mapOptionTwoResponse(dashboard.projectHandover),
            maintenanceConsult: mapOptionTwoResponse(dashboard.maintenanceConsult),
            incomeProject: mapOptionTwoResponse(dashboard.incomeProject),
        };
    }
    async getSatisfactionDashboardByTrustId(trustId: string): Promise<void> {
        try {
            if (this.isDashboardLoading || this.dashboardData) return; // Prevent duplicate calls
            this.isDashboardLoading = true;
            let data = await satisfactionService.getSatisfactionDashboardByTrustId(trustId);
            if (data.success) {
                const processedData = this.extractDashboardData(data.data);
                this.dashboardData = processedData;
            }
        } catch (error) {
            throw error;
        } finally {
            this.isDashboardLoading = false;
        }
    }

    async getSatisfactionById(satisfactionId: string): Promise<boolean> {
        try {
            this.isLoading = true;
            let data = await satisfactionService.getBySatisfactionId(satisfactionId);
            if (data.success) {
                this.satisfaction = {} as IAverageCommunitySatisfactionView;
                this.satisfaction = data.data;
            }
            return true;
        } catch (error) {
            throw error;
        } finally {
            this.isLoading = false;
        }
    }
    async getOptionOne(): Promise<boolean> {
        try {
            if ([...this.optionOne.values()].length > 0) {
                return true;
            }
            this.isLoading = true;
            let data = await satisfactionService.getOptionOne();
            if (data.success) {
                this.optionOne.clear();
                data.data.forEach((option: IAcsOptionOne) => {
                    this.optionOne.set(option.acsOptionOneId, option);
                });
            }
            return true;
        } catch (error) {
            throw error;
        } finally {
            this.isLoading = false;
        }
    }
    async getOptionTwo(): Promise<boolean> {
        try {
            if ([...this.optionTwo.values()].length > 0) {
                return true;
            }
            this.isLoading = true;
            let data = await satisfactionService.getOptionTwo();
            if (data.success) {
                this.optionTwo.clear();
                data.data.forEach((option: IAcsOptionTwo) => {
                    this.optionTwo.set(option.acsOptionTwoId, option);
                });
            }
            return true;
        } catch (error) {
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

}




// Create an instance of the store
// and export it for use in the application
export const satisfactionStore = new SatisfactionStore();