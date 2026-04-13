import { makeAutoObservable, ObservableMap, remove } from "mobx"
import { CreateAdminPayload, createDraPayload, createNuprcPayload, CreateSettlorPayload, IAdmin, IChangePassword, IDra, ILoginUpdate, INuprc, IProfilePicsPayload, IRole, ISettingStore, ISettlor } from "../types/interface";
import { SettingService } from "../service/settingService";
import { committeeRoleIds } from "../constants/roleIds";
import { IAuthPayload, IUser } from "../../auth/types/interface";
import { HCDTRequestResponse } from "../../../infrastructure/HCDTRequestResponse";

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
    allPendingBoT = new ObservableMap<string, IDra>();
    allBoT = new ObservableMap<string, IDra>();
    allPendingMC = new ObservableMap<string, IDra>();
    allMC = new ObservableMap<string, IDra>();
    allPendingAC = new ObservableMap<string, IDra>();
    allAC = new ObservableMap<string, IDra>();
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
    async editLoginUser(payload: ILoginUpdate): Promise<boolean> {
        try {
            this.isSubmitting = true;
            await SettingService.updateLoginUser(payload)
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
                remove(this.allPendingAdmin, newAdmin.userId);
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
                remove(this.allPendingAdmin, userId);
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

    async getAllBoT(): Promise<void> {
        try {
            this.isLoading = true;
            let data = await SettingService.getAllUsersByRole(committeeRoleIds.BoT)
            if (data.success) {
                this.allBoT.clear();
                this.allPendingBoT.clear();
                data.data.forEach((d: IDra) => {
                    if (d.status == 1) {
                        this.allBoT.set(d.userId, d);
                    } else {
                        this.allPendingBoT.set(d.userId, d);
                    }
                });
            }
        } catch (error) {
            throw error
        } finally {
            this.isLoading = false;
        }
    }

    async getAllMC(): Promise<void> {
        try {
            this.isLoading = true;
            let data = await SettingService.getAllUsersByRole(committeeRoleIds.MC)
            if (data.success) {
                this.allMC.clear();
                this.allPendingMC.clear();
                data.data.forEach((d: IDra) => {
                    if (d.status == 1) {
                        this.allMC.set(d.userId, d);
                    } else {
                        this.allPendingMC.set(d.userId, d);
                    }
                });
            }
        } catch (error) {
            throw error
        } finally {
            this.isLoading = false;
        }
    }

    async getAllAC(): Promise<void> {
        try {
            this.isLoading = true;
            let data = await SettingService.getAllUsersByRole(committeeRoleIds.AC)
            if (data.success) {
                this.allAC.clear();
                this.allPendingAC.clear();
                data.data.forEach((d: IDra) => {
                    if (d.status == 1) {
                        this.allAC.set(d.userId, d);
                    } else {
                        this.allPendingAC.set(d.userId, d);
                    }
                });
            }
        } catch (error) {
            throw error
        } finally {
            this.isLoading = false;
        }
    }

    // DRA
    async getAllDra(): Promise<boolean> {
        try {
            this.isLoading = true;
            let data = await SettingService.allDra()
            if (data.success) {
                this.allDra.clear();
                this.allPendingDra.clear();

                data.data.forEach((d: IDra) => {
                    const roleName = d.role;
                    if (d.status == 1) {
                        if (roleName === "Data Reporting Agent (DRA)") {
                            this.allDra.set(d.userId, d);
                        }
                    } else {
                        if (roleName === "Data Reporting Agent (DRA)") {
                            this.allPendingDra.set(d.userId, d);
                        }
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
                remove(this.allPendingDra, newAdmin.userId);
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
                remove(this.allPendingDra, userId);
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
    async registerAllUser(credentials: IAuthPayload): Promise<HCDTRequestResponse> {
        try {
            this.isSubmitting = true;
            let data = await SettingService.registerAllUser(credentials)
            return data
        } catch (error) {
            throw error
        } finally {
            this.isSubmitting = false;
        }
    }


}

export const settingStore = new SettingStore();


