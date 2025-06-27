import { makeAutoObservable, ObservableMap, toJS } from "mobx"
import { IStateAndLGA, ISurveyTypePayload, ITrust, ITrustList, ITrustPayload, ITrustPayloadData, ITrustStore } from "../types/interface";
import { trustService } from "../service/trustService";
import { TabType } from "../../project/types/interface";
import data from "../../../utils/stateAndLg.json"
class TrustStore implements ITrustStore {
    isLoading = false;
    isSubmitting = false;
    isSaving = false;
    isDeleting = false;
    setConflictForm = false;
    setSatisfactionForm = false;
    setEconomicImpactForm = false;
    pageSwitched: number = 1;
    selectedTrust: ITrustList | null = {} as ITrustList;
    trust: ITrust = {} as ITrust;
    allTrust = new ObservableMap<string, ITrustList>();
    allTrustList = new ObservableMap<string, ITrustList>();
    selectedTrustId: string | undefined = undefined
    formTab = new ObservableMap<number, TabType>();
    activeTap: TabType | null = null;
    trustFormData: ITrustPayloadData = {} as ITrustPayloadData;
    selectedState: string = "";
    selectedLGA: string = "";
    allStates = new ObservableMap<string, string>();
    allLGA = new ObservableMap<string, string>();
    constructor() {
        makeAutoObservable(this);
    }
    calculateTrustCompletion(data: ITrustPayloadData): number {
        const keys = Object.keys(data) as (keyof ITrustPayloadData)[];

        // Filter out keys you want to skip
        const relevantKeys = keys.filter(key => key !== 'completionStatus');

        const totalFields = relevantKeys.length;

        const filledFields = relevantKeys.reduce((count, key) => {
            const value = data[key];

            const isFilled =
                value !== null &&
                value !== undefined &&
                (
                    (typeof value === 'string' && value.trim() !== '') ||
                    (typeof value === 'number') || // include 0 as valid
                    (typeof value === 'boolean') ||
                    (Array.isArray(value) && value.length > 0)
                );

            return count + (isFilled ? 1 : 0);
        }, 0);

        const percentage = (filledFields / totalFields) * 100;
        return Math.round(percentage);
    }
    getFormSteps(): void {
        const tabs: TabType[] = [
            {
                id: 1,
                name: "Create New Project",
                desc: "Fill out these details and get your trust ready",
                isCompleted: false,
                isVisible: true,
                isActive: true
            },
            {
                id: 2,
                name: "Create Segments",
                desc: "Get full control over your audience",
                isCompleted: false,
                isVisible: false,
                isActive: false
            },
            {
                id: 3,
                name: "Add BoT,MC and AC",
                desc: "Optimize your campaign reach with absence",
                isCompleted: false,
                isVisible: false,
                isActive: false
            },
            {
                id: 4,
                name: "Preview Trust",
                desc: "Setup your customer journey flow",
                isCompleted: false,
                isVisible: false,
                isActive: false
            },

        ];

        this.formTab.clear()
        tabs.forEach((t: TabType) => {
            this.formTab.set(t.id, t)
            if (t.id == 1) {
                this.activeTap = t
            }
        })

    }
    setActiveTab(active: TabType): void {
        const prev = this.activeTap
        this.formTab.set(prev?.id as number, { ...prev, isActive: false } as TabType)
        this.formTab.set(active.id, { ...active, isActive: true } as TabType)
        this.activeTap = active
    }
    setCompletedTab(): void {
        const prev = this.activeTap
        this.formTab.set(prev?.id as number, { ...prev, isActive: false, isCompleted: true } as TabType)
        if (prev?.id != 4) {
            const active = this.formTab.get(Number(prev?.id) + 1)
            this.formTab.set(active?.id!, { ...active, isActive: true } as TabType)
            this.activeTap = active as TabType
        }
    }

    getUpdateFormSteps(n: number, id: number): void {

        let tab = this.formTab.get(id)
        // console.log("tab", toJS(tab))
        if (n == 1) {
            this.formTab.set(tab?.id as number, { ...tab, isVisible: !tab?.isVisible, } as TabType)
        } else {
            this.formTab.set(tab?.id as number, { ...tab, isCompleted: !tab?.isCompleted, } as TabType)
        }
        // console.log("get update", toJS(this.formTab.get(id)))
    }
    searchTrust(keyword: string): void {
        this.allTrust.clear();
        if (!keyword) {
            // If no keyword, show all trusts
            [...this.allTrustList.values()].forEach((trust: ITrustList) => {
                this.allTrust.set(trust.trustId, trust);
            });
        } else {
            // Filter trusts by keyword (case-insensitive, partial match on trustName)
            const lowerKeyword = keyword.toLowerCase();
            [...this.allTrustList.values()].forEach((trust: ITrustList) => {
                if (trust.trustName && trust.trustName.toLowerCase().includes(lowerKeyword)) {
                    this.allTrust.set(trust.trustId, trust);
                }
            });
        }
    }
    async getAllTrust(): Promise<void> {
        try {
            this.isLoading = true;
            let data = await trustService.getAllTrust()
            if (data.success) {
                this.allTrust.clear();
                data.data.forEach((t: ITrustList) => {
                    this.allTrust.set(t.trustId, t);
                    this.allTrustList.set(t.trustId, t);
                });
            }
        } catch (error) {
            throw error
        } finally {
            this.isLoading = false;
        }
    }

    getAllStates(): void {
        data.forEach((st: IStateAndLGA) => {
            this.allStates.set(st.state, st.state);
        });
    }
    getLG(state: string): Array<string> {
        this.allLGA.clear();
        const found = data.find((st: IStateAndLGA) => st.state.trim().toLowerCase() === state.trim().toLowerCase());
        if (found) {
            found.lgas.forEach((lga: string) => {
                this.allLGA.set(lga, lga);
            });
        }
        return found ? found.lgas : [];
    }
    async createTrust(payload: ITrustPayload): Promise<boolean> {
        try {
            this.isSubmitting = true;
            await trustService.createAndUpdateTrust(payload)
            await trustService.getAllTrust()
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
            // let data = await trustService.getTrustById(trustId)
            let data = await this.allTrust.get(trustId)
            if (data) {
                this.trust = {} as ITrust
                this.trust = data as ITrust
                this.trustFormData = { ...data } as ITrustPayloadData;
                console.log("trust", toJS(data))
            }
        } catch (error) {
            throw error
        } finally {
            this.isLoading = false;
        }
    }
    async getATrust(trustId: string): Promise<void> {
        try {
            this.isLoading = true;
            let data = await trustService.getTrustById(trustId)
            // let data = await this.allTrust.get(trustId)
            if (data.success) {
                const trustDta = data.data as ITrust
                this.trust = {} as ITrust
                this.trust = data.data as ITrust
                this.setConflictForm = trustDta.disableConflictSurvey == 1 ? true : false;
                this.setSatisfactionForm = trustDta.disableSatisfactionSurvey == 1 ? true : false;
                this.setEconomicImpactForm = trustDta.disableEconomicImpactSurvey == 1 ? true : false;
                // console.log("trust", toJS(data))
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
                await this.getAllTrust();
            }
            return true
        } catch (error) {
            throw error
        } finally {
            this.isDeleting = false;
        }
    }
    async surveyAccess(payload: ISurveyTypePayload,url:string): Promise<boolean> {
        try {
            this.isLoading = true;
            await trustService.updateSurveyAccess(payload,url)
            return true
        } catch (error) {
            throw error
        } finally {
            this.isLoading = false;
        }
    }
}

export const trustStore = new TrustStore();


