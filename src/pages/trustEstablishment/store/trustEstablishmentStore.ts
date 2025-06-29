import { makeAutoObservable, ObservableMap } from "mobx"
import { IEstablishmentDashboard, IFinishedDashboard, IFundsDashboard, IFundsDashboardData, IOperationalExpenditure, ITrustEstablishmentPayload, ITrustEstablishmentStatus, ITrustEstablishmentStore } from "../types/interface";
import { trustEstablishmentService } from "../service/trustEstablishmentService";
import { IUploadPayload } from "../../project/types/interface";
import { HCDTRequestResponse } from "../../../infrastructure/HCDTRequestResponse";
import { IBotInauguration } from "../../dashboard/types/interface";
class TrustEstablishmentStore implements ITrustEstablishmentStore {
    isLoading = false;
    isSubmitting = false;
    isDashboardLoading = false;
    isEstablishmentCreated = false;
    isDeleting = false
    selectedYear: number = 0;
    pageSwitch: number = 1;
    dashboardData: IFinishedDashboard | null = null;
    operationCount = new ObservableMap<string, number>();
    fundsDashboardData: IFundsDashboardData = {} as IFundsDashboardData;
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
            await this.getFundsDashboardByTrustIdAndYear(payload.trustId, 0);
            return data.success ? true : false
        } catch (error) {
            throw error
        } finally {
            this.isSubmitting = false;
        }
    }


    calculateTrustEstablishmentCompletion(data: ITrustEstablishmentPayload): number {
        const keys = Object.keys(data) as (keyof ITrustEstablishmentPayload)[];

        // Add all fields you want to skip
        const excludedKeys: (keyof ITrustEstablishmentPayload)[] = [
            'completionStatus',
            'cscDocument',
            'cscDocumentMimeType',
        ];

        const relevantKeys = keys.filter(key => !excludedKeys.includes(key));

        const totalFields = relevantKeys.length;

        const filledFields = relevantKeys.reduce((count, key) => {
            const value = data[key];

            const isFilled =
                value !== null &&
                value !== undefined &&
                (
                    (typeof value === 'string' && value.trim() !== '') ||
                    (typeof value === 'number') || // include 0 as valid
                    (typeof value === 'boolean') ||
                    (Array.isArray(value) && value.length > 0)
                );

            return count + (isFilled ? 1 : 0);
        }, 0);

        const percentage = (filledFields / totalFields) * 100;
        return Math.round(percentage);
    }


    async getSingleTrustEstablishmentStatus(trustId: string): Promise<void> {
        try {
            this.isLoading = true;
            let data = await trustEstablishmentService.getTrustEstablishmentById(trustId)
            if (data.success) {
                this.trustEstablishmentStatus = {} as ITrustEstablishmentStatus
                if (data.data === null) {
                    this.operationCount.set("1", 1);
                    this.isEstablishmentCreated = false;
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
    async destroyCACDocument(url: string, trustEstablishmentId: string): Promise<void> {
        try {
            this.isDeleting = true
            this.dashboardData = null; // Reset dashboard data on new submission
            await trustEstablishmentService.removeCACFile(trustEstablishmentId);
            await trustEstablishmentService.destroyCloudFile(url);
            await this.getSingleTrustEstablishmentStatus(this.trustEstablishmentStatus?.trustId as string);
            await this.getEstablishmentDashboardByTrustId(this.trustEstablishmentStatus?.trustId as string);
        } catch (error) {
            throw error;
        } finally {
            this.isDeleting = false
        }
    }
    async destroyMatrixDocument(url: string, trustEstablishmentId: string): Promise<void> {
        try {
            this.isDeleting = true
            this.dashboardData = null; // Reset dashboard data on new submission
            await trustEstablishmentService.destroyCloudFile(url);
            await trustEstablishmentService.removeMatrixFile(trustEstablishmentId);
            await this.getSingleTrustEstablishmentStatus(this.trustEstablishmentStatus?.trustId as string);
            await this.getEstablishmentDashboardByTrustId(this.trustEstablishmentStatus?.trustId as string);
        } catch (error) {
            throw error;
        } finally {
            this.isDeleting = false
        }
    }

    transformDashboard(data: IEstablishmentDashboard): IFinishedDashboard {
        return {
            TOTAL_FUNDS: data.SUB_FIELDS[0]?.totalFundsReceivedByTrust,
            COMPLETION_STATUS: data.SUB_FIELDS[0]?.completionStatus,
            DATE_UPDATED: data.SUB_FIELDS[0]?.updateAt,
            CAPITAL_EXPENDITURE: data.SUB_FIELDS[0]?.capitalExpenditure,
            RESERVE: data.SUB_FIELDS[0]?.reserve,
            CAC_STATUS: data.SUB_FIELDS[0]?.trustRegisteredWithCAC,
            CAC_DOCUMENT: data.SUB_FIELDS[0]?.cscDocument,
            YEAR_START: data.SUB_FIELDS[0]?.yearDeveloped,
            YEAR_EXPIRED: data.SUB_FIELDS[0]?.yearExpired,
            YEAR_NEEDS: data.SUB_FIELDS[0]?.yearOfNeedsAssessment,
            STATUS_OF_NEED_ASSESSMENT: data.SUB_FIELDS[0]?.statusOfNeedAssessment,
            LEADER_CONSULTED: data.SUB_FIELDS[0]?.communityLeadershipConsulted,
            YOUTH_CONSULTED: data.SUB_FIELDS[0]?.communityYouthsConsulted,
            WOMEN_CONSULTED: data.SUB_FIELDS[0]?.communityWomenConsulted,
            PWD_CONSULTED: data.SUB_FIELDS[0]?.pwDsConsulted,
            DISTRIBUTION_MATRIX: data.SUB_FIELDS[0]?.trustDistributionMatrixDocument,
            DEVELOP_PLAN_AND_BUDGET_PERCENTAGE: data.OPERATION_YEAR[0]?.trustDevPlanProgress,
            TRENDS_YEAR: data.TRENDS.sort((a, b) => a.settlorOperationalExpenditureYear - b.settlorOperationalExpenditureYear).map((year) => year.settlorOperationalExpenditureYear.toString()),
            TRENDS_AMOUNT: data.TRENDS.sort((a, b) => a.settlorOperationalExpenditureYear - b.settlorOperationalExpenditureYear).map((year) => year.settlorOperationalExpenditure.toString()),
            BOT_INAUGURATION_CHECK: data.BOT_INAUGURATION_CHECK[0] || {} as IBotInauguration
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

    async getFundsDashboardByTrustIdAndYear(trustId: string, year: number): Promise<void> {
        try {
            // Prevent duplicate calls
            this.isDashboardLoading = true;
            let data = await trustEstablishmentService.getFundsDashboard(trustId, year);
            if (data.success) {
                this.fundsDashboardData = {} as IFundsDashboardData
                const processedData: IFundsDashboard = data.data;
                this.fundsDashboardData = processedData.FINANCIAL_SUMMARY[0]
            }
        } catch (error) {
            throw error;
        } finally {
            this.isDashboardLoading = false;
        }
    }

}

export const trustEstablishmentStore = new TrustEstablishmentStore();


