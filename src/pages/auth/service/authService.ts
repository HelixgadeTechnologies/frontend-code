import { client } from "../../../infrastructure/agent"
import { HCDTRequestResponse } from "../../../infrastructure/HCDTRequestResponse"
import { ILoginCredentials } from "../types/interface"
export const AuthService = {
  login: (credentials: ILoginCredentials): Promise<HCDTRequestResponse> => client.post('/auth/signIn', { ...credentials }),
}