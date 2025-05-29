import { client } from "../../../infrastructure/agent"
import { HCDTRequestResponse } from "../../../infrastructure/HCDTRequestResponse"
import { IUploadPayload } from "../../project/types/interface"
import { ITrustEstablishmentPayload } from "../types/interface"
export const trustEstablishmentService = {
    createAndUpdateTrustEstablishment: (payload: ITrustEstablishmentPayload): Promise<HCDTRequestResponse> => client.post(`/trust/addEstablishmentStatus`, { ...payload }),

    getTrustEstablishmentById: (trustId: string): Promise<HCDTRequestResponse> => client.get(`/trust/establishmentStatus/${trustId}`),

    upload: (payload: IUploadPayload): Promise<HCDTRequestResponse> => client.post('/upload/file-upload', { ...payload }),

    getDashboard: (trustId:string): Promise<HCDTRequestResponse> => client.get(`/trust/dashboard/${trustId}`)
}