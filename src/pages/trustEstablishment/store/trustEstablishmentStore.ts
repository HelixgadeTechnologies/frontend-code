import { makeAutoObservable, ObservableMap } from "mobx"
import { IEstablishmentDashboard, IFinishedDashboard, IOperationalExpenditure, ITrustEstablishmentPayload, ITrustEstablishmentStatus, ITrustEstablishmentStore } from "../types/interface";
import { trustEstablishmentService } from "../service/trustEstablishmentService";
import { IUploadPayload } from "../../project/types/interface";
import { HCDTRequestResponse } from "../../../infrastructure/HCDTRequestResponse";
class TrustEstablishmentStore implements ITrustEstablishmentStore {
    isLoading = false;
    isSubmitting = false;
    isDashboardLoading = false;
    isEstablishmentCreated = false;
    pageSwitch: number = 1;
    dashboardData: IFinishedDashboard | null = null;
    operationCount = new ObservableMap<string, number>();
    trustEstablishmentStatus: ITrustEstablishmentStatus | null = null;
    constructor() {
        makeAutoObservable(this);
    }
    async createTrustEstablishment(payload: ITrustEstablishmentPayload): Promise<boolean> {
        try {
            this.isSubmitting = true;
            this.dashboardData = null; // Reset dashboard data on new submission
            let data = await trustEstablishmentService.createAndUpdateTrustEstablishment(payload)
            await this.getSingleTrustEstablishmentStatus(payload.trustId);
            await this.getEstablishmentDashboardByTrustId(payload.trustId);
            return data.success ? true : false
        } catch (error) {
            throw error
        } finally {
            this.isSubmitting = false;
        }
    }

    async getSingleTrustEstablishmentStatus(trustId: string): Promise<void> {
        try {
            this.isLoading = true;
            let data = await trustEstablishmentService.getTrustEstablishmentById(trustId)
            if (data.success) {
                this.trustEstablishmentStatus = {} as ITrustEstablishmentStatus
                if (data.data === null) {
                    this.operationCount.set("1", 1);
                } else {
                    this.isEstablishmentCreated = true;
                    let establishmentData: ITrustEstablishmentStatus = data.data as ITrustEstablishmentStatus
                    this.trustEstablishmentStatus = establishmentData;
                    establishmentData.settlorOperationalExpenditures?.map((expenditure: IOperationalExpenditure, index: number) => {
                        this.operationCount.set(expenditure.OperationalExpenditureId as string, index + 1);
                    })
                }
            }
        } catch (error) {
            throw error
        } finally {
            this.isLoading = false;
        }
    }
    async uploadFile(payload: IUploadPayload): Promise<HCDTRequestResponse> {
        try {
            let data = await trustEstablishmentService.upload(payload);
            return data;
        } catch (error) {
            throw error;
        }
    }

    transformDashboard(data: IEstablishmentDashboard): IFinishedDashboard {
        return {
            TOTAL_FUNDS: data.SUB_FIELDS[0].totalFundsReceivedByTrust,
            CAPITAL_EXPENDITURE: data.SUB_FIELDS[0].capitalExpenditure,
            RESERVE: data.SUB_FIELDS[0].reserve,
            CAC_STATUS: data.SUB_FIELDS[0].trustRegisteredWithCAC,
            CAC_DOCUMENT: data.SUB_FIELDS[0].cscDocument,
            YEAR_START: data.SUB_FIELDS[0].yearDeveloped,
            YEAR_EXPIRED: data.SUB_FIELDS[0].yearExpired,
            YEAR_NEEDS: data.SUB_FIELDS[0].yearOfNeedsAssessment,
            LEADER_CONSULTED: data.SUB_FIELDS[0].communityLeadershipConsulted,
            YOUTH_CONSULTED: data.SUB_FIELDS[0].communityYouthsConsulted,
            WOMEN_CONSULTED: data.SUB_FIELDS[0].communityWomenConsulted,
            PWD_CONSULTED: data.SUB_FIELDS[0].pwDsConsulted,
            DISTRIBUTION_MATRIX: data.SUB_FIELDS[0].trustDistributionMatrixDocument,
            DEVELOP_PLAN_AND_BUDGET_PERCENTAGE: data.OPERATION_YEAR[0].trustDevPlanProgress,
            TRENDS_YEAR: data.TRENDS.sort((a, b) => a.settlorOperationalExpenditureYear - b.settlorOperationalExpenditureYear).map((year) => year.settlorOperationalExpenditureYear.toString()),
            TRENDS_AMOUNT: data.TRENDS.sort((a, b) => a.settlorOperationalExpenditureYear - b.settlorOperationalExpenditureYear).map((year) => year.settlorOperationalExpenditure.toString()),

        };
    }

    async getEstablishmentDashboardByTrustId(trustId: string): Promise<void> {
        try {
            if (this.isDashboardLoading || this.dashboardData) return; // Prevent duplicate calls
            this.isDashboardLoading = true;
            let data = await trustEstablishmentService.getDashboard(trustId);
            if (data.success) {
                const processedData = this.transformDashboard(data.data);
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

export const trustEstablishmentStore = new TrustEstablishmentStore();


