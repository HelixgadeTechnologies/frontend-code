import { client } from "../../../infrastructure/agent"
import { HCDTRequestResponse } from "../../../infrastructure/HCDTRequestResponse"
import { ISurveyTypePayload, ITrustPayload } from "../types/interface"
export const trustService = {
    // Create And Update Trust
    getAllTrust: (): Promise<HCDTRequestResponse> => client.get('/trust/all'),

    createAndUpdateTrust: (credentials: ITrustPayload): Promise<HCDTRequestResponse> => client.post('/trust/createTrust', { ...credentials }),

    getTrustById: (trustId: string): Promise<HCDTRequestResponse> => client.get(`/trust/trust/${trustId}`),

    removeTrustById: (trustId: string): Promise<HCDTRequestResponse> => client.post(`/trust/remove/`, { trustId }),

    updateSurveyAccess: (payload: ISurveyTypePayload): Promise<HCDTRequestResponse> => client.post(`/trust/toggle-survey-access`, { ...payload }),
}