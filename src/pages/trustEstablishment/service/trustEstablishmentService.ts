import { client } from "../../../infrastructure/agent"
import { HCDTRequestResponse } from "../../../infrastructure/HCDTRequestResponse"
import { IUploadPayload } from "../../project/types/interface"
import { ITrustEstablishmentPayload } from "../types/interface"
export const trustEstablishmentService = {
    createAndUpdateTrustEstablishment: (payload: ITrustEstablishmentPayload): Promise<HCDTRequestResponse> => client.post(`/trust/addEstablishmentStatus`, { ...payload }),

    getTrustEstablishmentById: (trustId: string): Promise<HCDTRequestResponse> => client.get(`/trust/establishmentStatus/${trustId}`),

    upload: (payload: IUploadPayload): Promise<HCDTRequestResponse> => client.post('/upload/file-upload', { ...payload }),

    destroyCloudFile: (url: string): Promise<HCDTRequestResponse> => client.post('/upload/file-destroy', { url }),

    getDashboard: (trustId: string): Promise<HCDTRequestResponse> => client.get(`/trust/dashboard/${trustId}`),

    removeCACFile: (trustEstablishmentId: string): Promise<HCDTRequestResponse> => client.del(`/trust/remove-cac-file/${trustEstablishmentId}`),

    removeMatrixFile: (trustEstablishmentId: string): Promise<HCDTRequestResponse> => client.del(`/trust/remove-matrix-file/${trustEstablishmentId}`)
}