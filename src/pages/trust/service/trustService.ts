import { client } from "../../../infrastructure/agent"
import { HCDTRequestResponse } from "../../../utils/shared/HCDTRequestResponse"
import { ITrustEstablishmentPayload, ITrustPayload } from "../types/interface"
export const trustService = {
    // Create And Update Trust
    getAllTrust: (): Promise<HCDTRequestResponse> => client.get('/trust/all'),

    createAndUpdateTrust: (credentials: ITrustPayload): Promise<HCDTRequestResponse> => client.post('/trust/createTrust', { ...credentials }),

    getTrustById: (trustId: string): Promise<HCDTRequestResponse> => client.get(`/trust/trust/${trustId}`),

    removeTrustById: (trustId: string): Promise<HCDTRequestResponse> => client.post(`/trust/remove/`, { trustId }),

    createAndUpdateTrustEstablishment: (payload: ITrustEstablishmentPayload): Promise<HCDTRequestResponse> => client.post(`trust/addEstablishmentStatus`, { ...payload }),

    getTrustEstablishmentById: (trustId: string): Promise<HCDTRequestResponse> => client.get(`/trust/establishmentStatus/${trustId}`),
}