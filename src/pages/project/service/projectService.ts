import { client } from "../../../infrastructure/agent"
import { HCDTRequestResponse } from "../../../infrastructure/HCDTRequestResponse"
import { IProjectPayload, IUploadPayload } from "../types/interface"
export const projectService = {
    // Create And Update Trust
    getProjects: (): Promise<HCDTRequestResponse> => client.get('/project/projects'),

    createAndUpdateProject: (credentials: IProjectPayload): Promise<HCDTRequestResponse> => client.post('/project/save', { ...credentials }),

    getById: (projectId: string): Promise<HCDTRequestResponse> => client.get(`/project/project/${projectId}`),

    getByTrustId: (trustId: string): Promise<HCDTRequestResponse> => client.get(`/project/project-by-trust/${trustId}`),

    getProjectCategory: (): Promise<HCDTRequestResponse> => client.get(`/project/project-categories`),

    getProjectQualityRatting: (): Promise<HCDTRequestResponse> => client.get('/project/quality-ratings'),

    getProjectStatusReport: (): Promise<HCDTRequestResponse> => client.get('/project/status-reports'),

    getProjectTypeOfWork: (): Promise<HCDTRequestResponse> => client.get('/project/type-of-work'),

    upload: (payload: IUploadPayload): Promise<HCDTRequestResponse> => client.post('/upload/file-upload', { ...payload }),

    getDashboard: (trustId: string, selectedYear: number, selectedState: string): Promise<HCDTRequestResponse> => client.get(`/project/dashboard/${trustId}/${selectedYear}/${selectedState}`)
}