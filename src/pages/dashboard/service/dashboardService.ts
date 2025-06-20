import { client } from "../../../infrastructure/agent"
import { HCDTRequestResponse } from "../../../infrastructure/HCDTRequestResponse"

export const dashboardService = {
    generalDashboard: (year:number,state:string,settlor:string): Promise<HCDTRequestResponse> => client.get(`/dashboard/general/${year}/${state}/${settlor}`),
}