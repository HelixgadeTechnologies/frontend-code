import { client } from "../../../infrastructure/agent"
import { HCDTRequestResponse } from "../../../infrastructure/HCDTRequestResponse"

export const dashboardService = {
    generalDashboard: (): Promise<HCDTRequestResponse> => client.get(`/dashboard/general`),
}