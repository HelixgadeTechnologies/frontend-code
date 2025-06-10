import { HCDTRequestResponse } from "../../../infrastructure/HCDTRequestResponse";
import { AuthService } from "../service/authService";
import { IAuthStore, ILoginCredentials, IUser } from "../types/interface";
import { makeAutoObservable } from "mobx"
// import { makeAutoObservable, observable, ObservableMap, remove, set, toJS } from "mobx"
class AuthStore implements IAuthStore {
    isLoading = false;
    isSubmitting = false;
    pageSwitch:number = 1
    user: IUser = {} as IUser;


    constructor() {
        makeAutoObservable(this);
    }

    async login(credentials: ILoginCredentials): Promise<HCDTRequestResponse> {
        try {
            this.isSubmitting = true;
            let data = await AuthService.login(credentials)
            if (data.success) {
                this.user = {} as IUser;
            }
            return data
        } catch (error) {
            throw error
        } finally {
            this.isSubmitting = false;
        }
    }

    saveLoginUser(user: IUser): void {
        try {
            this.user = {} as IUser;
            this.user = { ...user } as IUser;
        } catch (error) {
            throw error
        }
    }
    updateProfilePic(res: any): void {
        this.user = { ...this.user, profilePic: res.profilePic }
    }

}

export const authStore = new AuthStore();


