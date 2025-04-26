import { makeAutoObservable, ObservableMap } from "mobx";
import { IEconomicImpactDashboard, IEconomicImpactDashboardData, IEconomicImpactPayload, IEconomicImpactStore, IEconomicImpactView, IImpactOptionOne, IImpactOptionTwo } from "../types/interface";
import { economicImpactService } from "../service/economicImpactService";

class EconomicImpactStore implements IEconomicImpactStore {
    isLoading: boolean = false;
    isSubmitting: boolean = false;
    isDeleting: boolean = false;
    isAddModelOpen: boolean = false;
    isDashboardLoading: boolean = false;
    selectedEconomicImpact: IEconomicImpactView | null = null;
    economicImpact: IEconomicImpactView = {} as IEconomicImpactView;
    allEconomicImpacts = new ObservableMap<string, IEconomicImpactView>();
    economicImpactsByTrust = new ObservableMap<string, IEconomicImpactView>();
    impactOptionOne = new ObservableMap<number, IImpactOptionOne>();
    impactOptionTwo = new ObservableMap<number, IImpactOptionTwo>();
    dashboardData: IEconomicImpactDashboardData | null = null
    constructor() {
        makeAutoObservable(this);
    }

    async getEconomicImpact(): Promise<boolean> {
        try {
            this.isLoading = true;
            let data = await economicImpactService.getEconomicImpact();
            if (data.success) {
                this.allEconomicImpacts.clear();
                data.data.forEach((impact: IEconomicImpactView) => {
                    this.allEconomicImpacts.set(impact.economicImpactId, impact);
                });
            }
            return true;
        } catch (error) {
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    async createEconomicImpact(payload: IEconomicImpactPayload): Promise<boolean> {
        try {
            this.isSubmitting = true;
            await economicImpactService.createAndUpdateEconomicImpact(payload);
            await this.getEconomicImpactByTrustId(payload.data.trustId || "");
            return true;
        } catch (error) {
            throw error;
        } finally {
            this.isSubmitting = false;
        }
    }

    async updateEconomicImpact(payload: IEconomicImpactPayload): Promise<boolean> {
        try {
            this.isSubmitting = true;
            let data = await economicImpactService.createAndUpdateEconomicImpact(payload);
            if (data.success) {
                let updatedEconomicImpact: IEconomicImpactView = data.data;
                this.allEconomicImpacts.set(updatedEconomicImpact.economicImpactId, updatedEconomicImpact);
                this.economicImpactsByTrust.set(updatedEconomicImpact.economicImpactId, updatedEconomicImpact);
            }
            return true;
        } catch (error) {
            throw error;
        } finally {
            this.isSubmitting = false;
        }
    }
    async deleteEconomicImpact(economicImpactId: string): Promise<boolean> {
        try {
            this.isDeleting = true;
            let data = await economicImpactService.deleteEconomicImpact(economicImpactId);
            if (data.success) {
                this.allEconomicImpacts.delete(economicImpactId);
                this.economicImpactsByTrust.delete(economicImpactId);
            }
            return true;
        } catch (error) {
            throw error;
        } finally {
            this.isDeleting = false;
        }
    }
    async getEconomicImpactByTrustId(trustId: string): Promise<boolean> {
        try {
            this.isLoading = true;
            let data = await economicImpactService.getByTrustId(trustId);
            if (data.success) {
                this.economicImpactsByTrust.clear();
                data.data.forEach((impact: IEconomicImpactView) => {
                    this.economicImpactsByTrust.set(impact.economicImpactId, impact);
                });
            }
            return true;
        } catch (error) {
            throw error;
        } finally {
            this.isLoading = false;
        }
    }
    extractDashboardData(dashboard: IEconomicImpactDashboard): IEconomicImpactDashboardData {
        const mapOptionOneResponse = (data: any) => {
            const response = data[0].RESPONSE;
            return [
                Number(response["VERY TRUE"]),
                Number(response["SLIGHTLY"]),
                Number(response["NOT TRUE"])
            ];
        };

        const mapOptionTwoResponse = (data: any) => {
            const response = data[0].RESPONSE;
            return [
                Number(response["HEALTHCARE"]),
                Number(response["EDUCATION"]),
                Number(response["PORTABLE WATER"]),
                Number(response["ELECTRICITY"]),
                Number(response["GOOD ROADS"]),
                Number(response["MARKET"]),
                Number(response["FAVORABLE BUSINESS ENVIRONMENT"])
            ];
        };

        return {
            businessGrowth: mapOptionOneResponse(dashboard.businessGrowth),
            incomeIncrease: mapOptionOneResponse(dashboard.incomeIncrease),
            livelihoodImprove: mapOptionOneResponse(dashboard.livelihoodImprove),
            accessAmenities: mapOptionTwoResponse(dashboard.accessAmenities)
        };
    }
    async getEconomicImpactDashboardByTrustId(trustId: string): Promise<void> {
        try {
            if (this.isDashboardLoading || this.dashboardData) return; // Prevent duplicate calls
            this.isDashboardLoading = true;
            let data = await economicImpactService.getEconomicImpactDashboardByTrustId(trustId);
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

    async getEconomicImpactByEconomicImpactId(economicImpactId: string): Promise<boolean> {
        try {
            this.isLoading = true;
            let data = await economicImpactService.getByEconomicImpactId(economicImpactId);
            if (data.success) {
                this.economicImpact = {} as IEconomicImpactView;
                this.economicImpact = data.data;
            }
            return true;
        } catch (error) {
            throw error;
        } finally {
            this.isLoading = false;
        }
    }
    async getImpactOptionOne(): Promise<boolean> {
        try {
            if ([...this.impactOptionOne.values()].length > 0) {
                return true;
            }
            this.isLoading = true;
            let data = await economicImpactService.getImpactOptionOne();
            if (data.success) {
                this.impactOptionOne.clear();
                data.data.forEach((option: IImpactOptionOne) => {
                    this.impactOptionOne.set(option.impactOptionOneId, option);
                });
            }
            return true;
        } catch (error) {
            throw error;
        } finally {
            this.isLoading = false;
        }
    }
    async getImpactOptionTwo(): Promise<boolean> {
        try {
            if ([...this.impactOptionTwo.values()].length > 0) {
                return true;
            }
            this.isLoading = true;
            let data = await economicImpactService.getImpactOptionTwo();
            if (data.success) {
                this.impactOptionTwo.clear();
                data.data.forEach((option: IImpactOptionTwo) => {
                    this.impactOptionTwo.set(option.impactOptionTwoId, option);
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
export const economicImpactStore = new EconomicImpactStore();