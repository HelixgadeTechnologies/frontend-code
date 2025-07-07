import { client } from "../../../infrastructure/agent"
import { HCDTRequestResponse } from "../../../infrastructure/HCDTRequestResponse"

export const dashboardService = {
    generalDashboard: (trustId: string, year: number, state: string, settlor: string): Promise<HCDTRequestResponse> => client.get(`/dashboard/general/${trustId}/${year}/${state}/${settlor}`),
}