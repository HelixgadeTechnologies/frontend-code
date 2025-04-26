import { makeAutoObservable, ObservableMap } from "mobx"
import { ITrust, ITrustEstablishmentPayload, ITrustEstablishmentStatus, ITrustList, ITrustPayload, ITrustStore } from "../types/interface";
import { trustService } from "../service/trustService";
class TrustStore implements ITrustStore {
    isLoading = false;
    isSubmitting = false;
    isDeleting = false;
    selectedTrust: ITrustList | null = {} as ITrustList;
    trust: ITrust = {} as ITrust;
    trustEstablishmentStatus: ITrustEstablishmentStatus = {} as ITrustEstablishmentStatus;
    allTrust = new ObservableMap<string, ITrustList>();
    selectedTrustId: string |undefined = undefined

    constructor() {
        makeAutoObservable(this);
    }

    async getAllTrust(): Promise<boolean> {
        try {
            this.isLoading = true;
            let data = await trustService.getAllTrust()
            if (data.success) {
                this.allTrust.clear();
                data.data.forEach((t: ITrustList) => {
                    this.allTrust.set(t.trustId, t);
                });
            }
            return true
        } catch (error) {
            throw error
        } finally {
            this.isLoading = false;
        }
    }

    async createTrust(payload: ITrustPayload): Promise<boolean> {
        try {
            this.isSubmitting = true;
            let data = await trustService.createAndUpdateTrust(payload)
            if (data.success) {
                let newTrust: ITrustList = data.data;
                this.allTrust.set(newTrust.trustId, newTrust);
            }
            return true
        } catch (error) {
            throw error
        } finally {
            this.isSubmitting = false;
        }
    }
    async updateTrust(payload: ITrustPayload): Promise<boolean> {
        try {
            this.isSubmitting = true;
            let data = await trustService.createAndUpdateTrust(payload)
            if (data.success) {
                let newTrust: ITrustList = data.data;
                this.allTrust.set(newTrust.trustId, newTrust);
            }
            return true
        } catch (error) {
            throw error
        } finally {
            this.isSubmitting = false;
        }
    }
    async getSingleTrust(trustId: string): Promise<void> {
        try {
            this.isLoading = true;
            let data = await trustService.getTrustById(trustId)
            if (data.success) {
                this.trust = {} as ITrust
                this.trust = data.data as ITrust
            }
        } catch (error) {
            throw error
        } finally {
            this.isLoading = false;
        }
    }
    async removeTrust(trustId: string): Promise<boolean> {
        try {
            this.isDeleting = true;
            let data = await trustService.removeTrustById(trustId)
            if (data.success) {
                let filteredTrust = [...this.allTrust.values()].filter((value: ITrustList) => value.trustId !== trustId)
                this.allTrust.clear();
                filteredTrust.forEach((value: ITrustList) => {
                    this.allTrust.set(value.userId, value)
                });
            }
            return true
        } catch (error) {
            throw error
        } finally {
            this.isDeleting = false;
        }
    }
    async createTrustEstablishment(payload: ITrustEstablishmentPayload): Promise<boolean> {
        try {
            this.isSubmitting = true;
            let data = await trustService.createAndUpdateTrustEstablishment(payload)
            return data.success?true:false
        } catch (error) {
            throw error
        } finally {
            this.isSubmitting = false;
        }
    }

    async getSingleTrustEstablishmentStatus(trustId: string): Promise<void> {
        try {
            this.isLoading = true;
            let data = await trustService.getTrustEstablishmentById(trustId)
            if (data.success) {
                this.trustEstablishmentStatus = {} as ITrustEstablishmentStatus
                this.trustEstablishmentStatus = data.data as ITrustEstablishmentStatus
            }
        } catch (error) {
            throw error
        } finally {
            this.isLoading = false;
        }
    }
}

export const trustStore = new TrustStore();


