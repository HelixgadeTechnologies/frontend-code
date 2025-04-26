import { client } from "../../../infrastructure/agent"
import { HCDTRequestResponse } from "../../../infrastructure/HCDTRequestResponse"
import { IEconomicImpactPayload } from "../types/interface"
export const economicImpactService = {
    // Create And Update Trust
    getEconomicImpact: (): Promise<HCDTRequestResponse> => client.get('/economic-impact/economicImpacts'),

    createAndUpdateEconomicImpact: (credentials: IEconomicImpactPayload): Promise<HCDTRequestResponse> => client.post('/economic-impact/create', { ...credentials }),

    getByTrustId: (trustId: string): Promise<HCDTRequestResponse> => client.get(`/economic-impact/economicImpact_by_trust/${trustId}`),

    getByEconomicImpactId: (economicImpactId: string): Promise<HCDTRequestResponse> => client.get(`/economic-impact/economicImpact/${economicImpactId}`),

    deleteEconomicImpact: (economicImpactId: string): Promise<HCDTRequestResponse> => client.post(`/trust/remove/`, { economicImpactId }),

    getImpactOptionOne: (): Promise<HCDTRequestResponse> => client.get('/economic-impact/impactOptionOne'),

    getImpactOptionTwo: (): Promise<HCDTRequestResponse> => client.get('/economic-impact/impactOptionTwo'),

    getEconomicImpactDashboardByTrustId: (trustId: string): Promise<HCDTRequestResponse> => client.get(`/economic-impact/dashboard/${trustId}`),

}