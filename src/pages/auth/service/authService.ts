import { client } from "../../../infrastructure/agent"
import { HCDTRequestResponse } from "../../../utils/shared/HCDTRequestResponse"
import { IChangePassword } from "../../Settings/types/interface"
import { ILoginCredentials } from "../types/interface"
export const AuthService = {
  login: (credentials: ILoginCredentials): Promise<HCDTRequestResponse> => client.post('/auth/signIn', { ...credentials }),
}