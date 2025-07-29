import { HCDTRequestResponse } from "../../../infrastructure/HCDTRequestResponse";


export interface IAuthStore {
    isLoading: boolean;
    isSubmitting: boolean;
    sidebarOpen: boolean;
    trustSidebarOpen: boolean;
    pageSwitch: number;
    pageSwitchA:number;
    user: IUser;

    login(credentials: ILoginCredentials): Promise<HCDTRequestResponse>;
    saveLoginUser(user: IUser): void;
    updateProfilePic(url: string): void;
}

export interface IUser {
    token: string,
    userId: string,
    email?: string,
    role?: string,
    status?: string,
    firstName?: string,
    lastName?: string,
    phoneNumber?: string,
    state?: string,
    community?: string,
    localGovernmentArea?: string,
    profilePic?: string,
    trusts?: string,
    roleId?: string,
}

export interface ILoginCredentials {
    email: string,
    password: string
}
