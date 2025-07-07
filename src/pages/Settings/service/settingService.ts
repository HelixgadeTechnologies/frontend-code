import { client } from "../../../infrastructure/agent"
import { HCDTRequestResponse } from "../../../infrastructure/HCDTRequestResponse"
import { CreateAdminPayload, createDraPayload, createNuprcPayload, CreateSettlorPayload, IChangePassword, ILoginUpdate, IProfilePicsPayload } from "../types/interface"
export const SettingService = {
    updateLoginUser:(payload:ILoginUpdate):Promise<HCDTRequestResponse> => client.put("/setting/update-login",{...payload}),
    
    // changePassword
    changePassword: (credentials: IChangePassword): Promise<HCDTRequestResponse> => client.post('/setting/change-password', { ...credentials }),
    changeProfilePicture: (credentials: IProfilePicsPayload): Promise<HCDTRequestResponse> => client.post('/setting/update-profile-picture', { ...credentials }),
    //roles
    roles: (): Promise<HCDTRequestResponse> => client.get('/setting/roles'),


    // Admin section
    allAdmin: (): Promise<HCDTRequestResponse> => client.get('/setting/admins'),
    createEditAdmin: (payload: CreateAdminPayload): Promise<HCDTRequestResponse> => client.post('/setting/addAdmin', { ...payload }),
    removeAdmin: (userId: string): Promise<HCDTRequestResponse> => client.post('/setting/remove', { userId }),

    //   DRA Section
    allDra: (): Promise<HCDTRequestResponse> => client.get('/setting/allDra'),
    createEditDra: (payload: createDraPayload): Promise<HCDTRequestResponse> => client.post('/setting/addDRA', { ...payload }),
    removeDra: (userId: string): Promise<HCDTRequestResponse> => client.post('/setting/remove', { userId }),


    //   NUPRC Section
    allNuprc: (): Promise<HCDTRequestResponse> => client.get('/setting/allnuprc'),
    createEditNuprc: (payload: createNuprcPayload): Promise<HCDTRequestResponse> => client.post('/setting/addnuprc', { ...payload }),
    removeNuprc: (userId: string): Promise<HCDTRequestResponse> => client.post('/setting/remove', { userId }),


    //   Settlor Section
    allSettlor: (): Promise<HCDTRequestResponse> => client.get('/setting/allSettlor'),
    createEditSettlor: (payload: CreateSettlorPayload): Promise<HCDTRequestResponse> => client.post('/setting/addSettlor', { ...payload }),
    removeSettlor: (settlorId: string): Promise<HCDTRequestResponse> => client.post('/setting/removeSettlor', { settlorId }),
}