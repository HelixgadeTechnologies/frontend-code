import { makeAutoObservable, ObservableMap, remove } from "mobx"
import { CreateAdminPayload, createDraPayload, createNuprcPayload, CreateSettlorPayload, IAdmin, IChangePassword, IDra, INuprc, IProfilePicsPayload, IRole, ISettingStore, ISettlor } from "../types/interface";
import { SettingService } from "../service/settingService";

class SettingStore implements ISettingStore {
    isLoading = false;
    isSubmitting = false;
    isDeleting = false;
    isUploading = false;
    selectedAdmin: IAdmin = {} as IAdmin;
    isPasswordModelClose: boolean = false;
    allAdmin = new ObservableMap<string, IAdmin>();
    allPendingAdmin = new ObservableMap<string, IAdmin>();
    allPendingDra = new ObservableMap<string, IDra>();
    allDra = new ObservableMap<string, IDra>();
    allNuprc = new ObservableMap<string, INuprc>();
    allSettlor = new ObservableMap<string, ISettlor>();
    allRole = new ObservableMap<string, IRole>();
    selectedUserId: string = "";
    openModal: boolean = false;
    isUpdated: boolean = false;
    isDraUpdated: boolean = false;
    isApproving: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    async getAllAdmin(): Promise<boolean> {
        try {
            this.isLoading = true;
            let data = await SettingService.allAdmin()
            if (data.success) {
                this.allAdmin.clear();
                data.data.forEach((a: IAdmin) => {
                    if (a.status == 1) {
                        this.allAdmin.set(a.userId, a);
                    } else {
                        this.allPendingAdmin.set(a.userId, a);
                    }
                });
            }
            return true
        } catch (error) {
            throw error
        } finally {
            this.isLoading = false;
        }
    }
    async createAdmin(payload: CreateAdminPayload): Promise<boolean> {
        try {
            this.isSubmitting = true;
            let data = await SettingService.createEditAdmin(payload)
            if (data.success) {
                let newAdmin: IAdmin = data.data;
                this.allPendingAdmin.set(newAdmin.userId, newAdmin);
            }
            return true
        } catch (error) {
            throw error
        } finally {
            this.isSubmitting = false;
        }
    }
    async editAdmin(payload: CreateAdminPayload): Promise<boolean> {
        try {
            this.isSubmitting = true;
            let data = await SettingService.createEditAdmin(payload)
            if (data.success) {
                let newAdmin: IAdmin = data.data;
                this.allAdmin.set(newAdmin.userId, newAdmin);
            }
            return true
        } catch (error) {
            throw error
        } finally {
            this.isSubmitting = false;
        }
    }
    async approvePendingAdmin(payload: CreateAdminPayload): Promise<boolean> {
        try {
            this.isApproving = true;
            let data = await SettingService.createEditAdmin(payload)
            if (data.success) {
                let newAdmin: IAdmin = data.data;
                remove(this.allPendingAdmin,newAdmin.userId);
            }
            return true
        } catch (error) {
            throw error
        } finally {
            this.isApproving = false;
        }
    }
    async declinePendingAdmin(userId: string): Promise<boolean> {
        try {
            this.isDeleting = true;
            let data = await SettingService.removeAdmin(userId)
            if (data.success) {
                remove(this.allPendingAdmin,userId);
            }
            return true
        } catch (error) {
            throw error
        } finally {
            this.isDeleting = false;
        }
    }
    async removeAdmin(userId: string): Promise<boolean> {
        try {
            this.isDeleting = true;
            let data = await SettingService.removeAdmin(userId)
            if (data.success) {
                let filteredAdmin = [...this.allAdmin.values()].filter((value: IAdmin) => value.userId !== userId)
                let filteredPendingAdmin = [...this.allPendingAdmin.values()].filter((value: IAdmin) => value.userId !== userId);

                this.allAdmin.clear();
                filteredAdmin.forEach((value: IAdmin) => {
                    this.allAdmin.set(value.userId, value)
                });

                this.allPendingAdmin.clear();
                filteredPendingAdmin.forEach((value: IAdmin) => {
                    this.allPendingAdmin.set(value.userId, value)
                });
            }
            return true
        } catch (error) {
            throw error
        } finally {
            this.isDeleting = false;
        }
    }

    // DRA
    async getAllDra(): Promise<boolean> {
        try {
            this.isLoading = true;
            let data = await SettingService.allDra()
            if (data.success) {
                this.allAdmin.clear();
                data.data.forEach((d: IDra) => {
                    if (d.status == 1) {
                        this.allDra.set(d.userId, d);
                    } else {
                        this.allPendingDra.set(d.userId, d);
                    }
                });
            }
            return true
        } catch (error) {
            throw error
        } finally {
            this.isLoading = false;
        }
    }
    async createDra(payload: createDraPayload): Promise<boolean> {
        try {
            this.isSubmitting = true;
            let data = await SettingService.createEditDra(payload)
            if (data.success) {
                let newDra: IDra = data.data;
                this.allPendingDra.set(newDra.userId, newDra);
            }
            return true
        } catch (error) {
            throw error
        } finally {
            this.isSubmitting = false;
        }
    }
    async editDra(payload: createDraPayload): Promise<boolean> {
        try {
            this.isSubmitting = true;
            let data = await SettingService.createEditDra(payload)
            if (data.success) {
                let newDra: IDra = data.data;
                this.allDra.set(newDra.userId, newDra);
            }
            return true
        } catch (error) {
            throw error
        } finally {
            this.isSubmitting = false;
        }
    }

    async approvePendingDra(payload: createDraPayload): Promise<boolean> {
        try {
            this.isApproving = true;
            let data = await SettingService.createEditDra(payload)
            if (data.success) {
                let newAdmin: IDra = data.data;
                remove(this.allPendingDra,newAdmin.userId);
            }
            return true
        } catch (error) {
            throw error
        } finally {
            this.isApproving = false;
        }
    }
    async declinePendingDra(userId: string): Promise<boolean> {
        try {
            this.isDeleting = true;
            let data = await SettingService.removeDra(userId)
            if (data.success) {
                remove(this.allPendingDra,userId);
            }
            return true
        } catch (error) {
            throw error
        } finally {
            this.isDeleting = false;
        }
    }
    async removeDra(userId: string): Promise<boolean> {
        try {
            this.isDeleting = true;
            let data = await SettingService.removeDra(userId)
            if (data.success) {
                let filteredDra = [...this.allDra.values()].filter((value: IDra) => value.userId !== userId)
                this.allDra.clear();
                filteredDra.forEach((value: IDra) => {
                    this.allDra.set(value.userId, value)
                });
            }
            return true
        } catch (error) {
            throw error
        } finally {
            this.isDeleting = false;
        }
    }

    // NUPRC
    async getAllNUPRC(): Promise<boolean> {
        try {
            this.isLoading = true;
            let data = await SettingService.allNuprc()
            if (data.success) {
                this.allNuprc.clear();
                data.data.forEach((d: INuprc) => {
                    this.allNuprc.set(d.userId, d);
                });
            }
            return true
        } catch (error) {
            throw error
        } finally {
            this.isLoading = false;
        }
    }
    async createNuprc(payload: createNuprcPayload): Promise<boolean> {
        try {
            this.isSubmitting = true;
            let data = await SettingService.createEditNuprc(payload)
            if (data.success) {
                let newNuprc: INuprc = data.data;
                this.allNuprc.set(newNuprc.userId, newNuprc);
            }
            return true
        } catch (error) {
            throw error
        } finally {
            this.isSubmitting = false;
        }
    }
    async editNuprc(payload: createNuprcPayload): Promise<boolean> {
        try {
            this.isSubmitting = true;
            let data = await SettingService.createEditNuprc(payload)
            if (data.success) {
                let newNuprc: INuprc = data.data;
                this.allNuprc.set(newNuprc.userId, newNuprc);
            }
            return true
        } catch (error) {
            throw error
        } finally {
            this.isSubmitting = false;
        }
    }
    async removeNuprc(userId: string): Promise<boolean> {
        try {
            this.isDeleting = true;
            let data = await SettingService.removeNuprc(userId)
            if (data.success) {
                let filteredNuprc = [...this.allNuprc.values()].filter((value: INuprc) => value.userId !== userId)
                this.allNuprc.clear();
                filteredNuprc.forEach((value: INuprc) => {
                    this.allNuprc.set(value.userId, value)
                });
            }
            return true
        } catch (error) {
            throw error
        } finally {
            this.isDeleting = false;
        }
    }


    // Settlor
    async getAllSettlor(): Promise<boolean> {
        try {
            this.isLoading = true;
            let data = await SettingService.allSettlor()
            if (data.success) {
                this.allSettlor.clear();
                data.data.forEach((s: ISettlor) => {
                    this.allSettlor.set(s.settlorId, s);
                });
            }
            return true
        } catch (error) {
            throw error
        } finally {
            this.isLoading = false;
        }
    }
    async createSettlor(payload: CreateSettlorPayload): Promise<boolean> {
        try {
            this.isSubmitting = true;
            let data = await SettingService.createEditSettlor(payload)
            if (data.success) {
                let newSettlor: ISettlor = data.data;
                this.allSettlor.set(newSettlor.settlorId, newSettlor);
            }
            return true
        } catch (error) {
            throw error
        } finally {
            this.isSubmitting = false;
        }
    }
    async editSettlor(payload: CreateSettlorPayload): Promise<boolean> {
        try {
            this.isSubmitting = true;
            let data = await SettingService.createEditSettlor(payload)
            if (data.success) {
                let newSettlor: ISettlor = data.data;
                this.allSettlor.set(newSettlor.settlorId, newSettlor);
            }
            return true
        } catch (error) {
            throw error
        } finally {
            this.isSubmitting = false;
        }
    }
    async removeSettlor(settlorId: string): Promise<boolean> {
        try {
            this.isDeleting = true;
            let data = await SettingService.removeSettlor(settlorId)
            if (data.success) {
                let filteredSettlor = [...this.allSettlor.values()].filter((value: ISettlor) => value.settlorId !== settlorId)
                this.allSettlor.clear();
                filteredSettlor.forEach((value: ISettlor) => {
                    this.allSettlor.set(value.settlorId, value)
                });
            }
            return true
        } catch (error) {
            throw error
        } finally {
            this.isDeleting = false;
        }
    }
    async changePassword(credentials: IChangePassword): Promise<boolean> {
        try {
            this.isSubmitting = true;
            let data = await SettingService.changePassword(credentials)
            return data.success as boolean
        } catch (error) {
            throw error
        } finally {
            this.isSubmitting = false;
        }
    }
    async uploadProfilePic(credentials: IProfilePicsPayload): Promise<string> {
        try {
            this.isUploading = true;
            let data = await SettingService.changeProfilePicture(credentials)
            return data.data 
        } catch (error) {
            throw error
        } finally {
            this.isUploading = false;
        }
    }

    async getRole(): Promise<void> {
        try {
            if ([...this.allRole.values()].length == 0) {
                this.isLoading = true;
                let data = await SettingService.roles()
                // console.log("data2233333");
                if (data?.success) {
                    this.allRole.clear();
                    data.data.forEach((r: IRole) => {
                        this.allRole.set(r.roleId, r);
                    });
                }
            }
        } catch (error) {
            throw error
        } finally {
            this.isLoading = false;
        }
    }



}

export const settingStore = new SettingStore();


