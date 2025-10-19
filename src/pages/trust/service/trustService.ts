import { client } from "../../../infrastructure/agent"
import { HCDTRequestResponse } from "../../../infrastructure/HCDTRequestResponse"
import { ISurveyTypePayload, ITrustPayload, IValidatedTrust } from "../types/interface"
export const trustService = {
    // Create And Update Trust
    getAllTrust: (): Promise<HCDTRequestResponse> => client.get('/trust/all'),

    createAndUpdateTrust: (credentials: ITrustPayload): Promise<HCDTRequestResponse> => client.post('/trust/createTrust', { ...credentials }),

    getTrustById: (trustId: string): Promise<HCDTRequestResponse> => client.get(`/trust/trust/${trustId}`),

    removeTrustById: (trustId: string): Promise<HCDTRequestResponse> => client.post(`/trust/remove/`, { trustId }),

    updateSurveyAccess: (payload: ISurveyTypePayload, url: string): Promise<HCDTRequestResponse> => client.post(`/trust/toggle-survey-access`, { ...payload, url }),

    // new: upload using base64 string in JSON body
    uploadTrustFroValidationBase64: (payload: string): Promise<HCDTRequestResponse> => client.post(`/trust/validate-upload`, { payload }),
    saveValidData: (payload: Array<IValidatedTrust>): Promise<HCDTRequestResponse> => client.post(`/trust/bulk-upload`, { payload }),
}