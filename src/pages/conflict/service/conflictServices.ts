import { client } from "../../../infrastructure/agent"
import { HCDTRequestResponse } from "../../../infrastructure/HCDTRequestResponse"
import { IConflictPayload } from "../types/interface"
export const conflictService = {
    // Create And Update Trust
    getConflicts: (): Promise<HCDTRequestResponse> => client.get('/conflict/conflicts'),

    createAndUpdateConflict: (credentials: IConflictPayload): Promise<HCDTRequestResponse> => client.post('/conflict/create', { ...credentials }),

    getByTrustId: (trustId: string): Promise<HCDTRequestResponse> => client.get(`/conflict/conflict-by-trust/${trustId}`),

    getCauseOfConflict: (): Promise<HCDTRequestResponse> => client.get(`/conflict/causeOfConflict`),

    getPatienceInvolve: (): Promise<HCDTRequestResponse> => client.get('/conflict/partiesInvolve'),

    getConflictStatus: (): Promise<HCDTRequestResponse> => client.get('/conflict/conflictStatuses'),

    getIssuesAddressed: (): Promise<HCDTRequestResponse> => client.get('/conflict/issuesAddressedBy'),

    getCourtLitigationStatuses: (): Promise<HCDTRequestResponse> => client.get('/conflict/courtLitigationStatuses'),

    getConflictDashboardByTrustId: (trustId: string, selectedYear: number, selectedState: string): Promise<HCDTRequestResponse> => client.get(`/conflict/dashboard/${trustId}/${selectedYear}/${selectedState}`),

}