import { makeAutoObservable } from "mobx"
import { dashboardService } from "../service/dashboardService";
import { IDashboardStore, IFinishedDashboard, IGeneralDashboard } from "../types/interface";

class DashboardStore implements IDashboardStore {
    isLoading = false;
    dashboardData: IFinishedDashboard | null = null;
    selectedYear:number = 0;
    selectedState:string = "ALL";
    selectedSettlor:string = "ALL";
    constructor() {
        makeAutoObservable(this);
    }

    transformDashboard(data: IGeneralDashboard): IFinishedDashboard {
        return {
            FIELDS_COMPLETION: Number(data.FIELDS_COMPLETION[0].percentFullyEstablished),
            COMPLETION_STATUS: data.COMPLETION_STATUS[0],
            COMMUNITY_BENEFIT: {
                state: data.COMMUNITY_BENEFIT.map(item => item.state),
                total: data.COMMUNITY_BENEFIT.map(item => item.community_count),
            },
            STATISTICS: data.STATISTICS[0],
            OPERATIONAL_EXPENDITURE: data.OPERATIONAL_EXPENDITURE[0],
            QUALITY_RATINGS: data.QUALITY_RATINGS,
            COMPLETION_OVER_MONTH: {
                monthName: data.COMPLETION_OVER_MONTH.map(item => item.monthName),
                total: data.COMPLETION_OVER_MONTH.map(item => item.totalCompleted)
            },
            PROJECT_DETAILS: data.PROJECT_DETAILS,
            CONFLICT_RESOLUTION_OVER_TIME: data.CONFLICT_RESOLUTION_OVER_TIME,
            CONFLICT_RESOLUTION_PERCENTAGE: data.CONFLICT_RESOLUTION_PERCENTAGE[0],
            CONFLICT_RESOLUTION_DETAILS: data.CONFLICT_RESOLUTION_DETAILS,
            TOTAL_WORKER_IN_PROJECT: data.TOTAL_WORKER_IN_PROJECT,
            EMPLOYEE_PER_PROJECT: data.EMPLOYEE_PER_PROJECT,
            STATISTICS_PERCENTAGE: data.STATISTICS_PERCENTAGE[0],
            DISTRIBUTION_MATRIX: data.DISTRIBUTION_MATRIX[0],
            NEEDS_ASSESSMENT_COMMUNITY_COUNT:data.NEEDS_ASSESSMENT_COMMUNITY_COUNT[0],
            BOT_DISPLAY:{
                male:[
                    data.BOT_DISPLAY[0].totalMaleBotMembers,
                    data.BOT_DISPLAY[0].totalMaleAdvisoryCommitteeMembers,
                    data.BOT_DISPLAY[0].totalMaleManagementCommitteeMembers,
                ],
                female:[
                    data.BOT_DISPLAY[0].totalFemaleBotMembers,
                    data.BOT_DISPLAY[0].totalFemaleAdvisoryCommitteeMembers,
                    data.BOT_DISPLAY[0].totalFemaleManagementCommitteeMembers,
                ],
                pwd:[
                    data.BOT_DISPLAY[0].totalPwdBotMembers,
                    data.BOT_DISPLAY[0].totalPwdAdvisoryCommitteeMembers,
                    data.BOT_DISPLAY[0].totalPwdManagementCommitteeMembers,
                ]
            },
            CONFLICT_RESOLUTION_OVER:data.CONFLICT_RESOLUTION_OVER,
            BOT_INAUGURATION_CHECK: data.BOT_INAUGURATION_CHECK[0]

        };
    }

    async getDashboard(year:number,state:string,settlor:string): Promise<void> {
        try {
            if (this.isLoading || this.dashboardData) return; // Prevent duplicate calls
            this.isLoading = true;
            let data = await dashboardService.generalDashboard(year,state,settlor);
            if (data.success) {
                const processedData = this.transformDashboard(data.data);
                this.dashboardData = processedData;
                // console.log(toJS(processedData))
            }
        } catch (error) {
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

}

export const dashboardStore = new DashboardStore();


