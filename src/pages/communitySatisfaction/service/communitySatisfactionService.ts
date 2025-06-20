import { client } from "../../../infrastructure/agent"
import { HCDTRequestResponse } from "../../../infrastructure/HCDTRequestResponse"
import { ISatisfactionPayload } from "../types/interface"
export const satisfactionService = {
    // Create And Update Trust
    getSatisfaction: (): Promise<HCDTRequestResponse> => client.get('/average-community-satisfaction/list'),

    createAndUpdateSatisfaction: (credentials: ISatisfactionPayload): Promise<HCDTRequestResponse> => client.post('/average-community-satisfaction/create', { ...credentials }),

    getByTrustId: (trustId: string): Promise<HCDTRequestResponse> => client.get(`/average-community-satisfaction/single-by-trust/${trustId}`),

    getBySatisfactionId: (satisfactionId: string): Promise<HCDTRequestResponse> => client.get(`/average-community-satisfaction/single/${satisfactionId}`),

    getOptionOne: (): Promise<HCDTRequestResponse> => client.get('/average-community-satisfaction/acsOptionOne'),

    getOptionTwo: (): Promise<HCDTRequestResponse> => client.get('/average-community-satisfaction/acsOptionTwo'),

    getSatisfactionDashboardByTrustId: (trustId: string, selectedYear: number, selectedState: string): Promise<HCDTRequestResponse> => client.get(`/average-community-satisfaction/dashboard/${trustId}/${selectedYear}/${selectedState}`),

}