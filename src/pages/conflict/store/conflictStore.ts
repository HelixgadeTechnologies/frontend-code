import { makeAutoObservable, ObservableMap } from "mobx";
import { ICauseOfConflict, ICauseOfConflictDashboard, IConflictDashboard, IConflictDashboardOutput, IConflictPayload, IConflictStatus, IConflictStore, IConflictView, ICourtLitigationStatus, IIssuesAddressBy, IPartiesInvolve } from "../types/interface";
import { conflictService } from "../service/conflictServices";
import { IDropdownProp } from "../../Settings/types/interface";

class ConflictStore implements IConflictStore {
    isLoading: boolean = false;
    isSubmitting: boolean = false;
    isDashboardLoading: boolean = false;
    isEditDialogVisible: boolean = false;
    isReportDialogVisible: boolean = false;
    selectedConflict: IConflictView | null = null;
    resolvedConflict: IConflictView | null = null;
    unResolvedConflict: IConflictView | null = null;
    dashboardData: IConflictDashboardOutput | null = null
    conflictBaseView: number = 1;
    conflicts = new ObservableMap<string, IConflictView>();
    filteredConflicts = new ObservableMap<string, IConflictView>();
    causeOfConflict = new ObservableMap<number, ICauseOfConflict>();
    partiesInvolve = new ObservableMap<number, IPartiesInvolve>();
    conflictStatus = new ObservableMap<number, IConflictStatus>();
    issuesAddressBy = new ObservableMap<number, IIssuesAddressBy>();
    courtLitigationStatus = new ObservableMap<number, ICourtLitigationStatus>();
    constructor() {
        makeAutoObservable(this);
    }

    filterConflict(conflictStatusId: number): void {
        try {
            if (conflictStatusId == 0) {
                this.resetConflict()
            } else {
                // Filter conflicts based on the provided status ID
                const filtered: Array<IConflictView> = [...this.conflicts.values()].filter(
                    (conflict: IConflictView) => conflict.conflictStatusId === conflictStatusId
                );

                // Update the filteredConflicts map
                this.filteredConflicts.clear();
                filtered.forEach((conflict: IConflictView) => {
                    this.filteredConflicts.set(conflict.conflictId, conflict);
                });
            }
        } catch (error) {
            throw error;
        }
    }
    resetConflict(): void {
        try {
            const allConflict: Array<IConflictView> = [...this.conflicts.values()];

            // Update the filteredConflicts map
            this.filteredConflicts.clear();
            allConflict.forEach((conflict: IConflictView) => {
                this.filteredConflicts.set(conflict.conflictId, conflict);
            });
        } catch (error) {
            throw error;
        }
    }
    async getConflicts(trustId: string): Promise<boolean> {
        try {
            this.isLoading = true;
            let data = await conflictService.getByTrustId(trustId);
            if (data.success) {
                this.conflicts.clear();
                data.data.forEach((conflict: IConflictView) => {
                    this.conflicts.set(conflict.conflictId, conflict);
                    this.filteredConflicts.set(conflict.conflictId, conflict);
                });
                this.isLoading = false;
            }
            return true;
        } catch (error) {
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    async createConflict(payload: IConflictPayload, trustId: string): Promise<boolean> {
        try {
            this.isSubmitting = true;
            this.isDashboardLoading = false;
            this.dashboardData = null;
            await conflictService.createAndUpdateConflict(payload);
            await this.getConflicts(trustId || "");
            await this.getConflictDashboardByTrustId(trustId || "")
            return true;
        } catch (error) {
            throw error;
        } finally {
            this.isSubmitting = false;
        }
    }

    async getCauseOfConflict(): Promise<boolean> {
        try {
            if ([...this.causeOfConflict.values()].length > 0) {
                return true;
            } else {
                this.isLoading = true;
                let data = await conflictService.getCauseOfConflict();
                if (data.success) {
                    this.causeOfConflict.clear();
                    data.data.forEach((cause: ICauseOfConflict) => {
                        this.causeOfConflict.set(cause.causeOfConflictId, cause);
                    });
                }
                return true;
            }
        } catch (error) {
            throw error;
        } finally {
            this.isLoading = false;
        }
    }
    async getPartiesInvolve(): Promise<boolean> {
        try {

            if ([...this.partiesInvolve.values()].length > 0) {
                return true;
            } else {
                this.isLoading = true;
                let data = await conflictService.getPatienceInvolve();
                if (data.success) {
                    this.partiesInvolve.clear();
                    data.data.forEach((parties: IPartiesInvolve) => {
                        this.partiesInvolve.set(parties.partiesInvolveId, parties);
                    });
                }
                return true;
            }
        } catch (error) {
            throw error;
        } finally {
            this.isLoading = false;
        }
    }
    async getConflictStatus(): Promise<boolean> {
        try {
            if ([...this.conflictStatus.values()].length == 0) {
                this.isLoading = true;
                let data = await conflictService.getConflictStatus();
                if (data.success) {
                    this.conflictStatus.clear();
                    data.data.forEach((status: IConflictStatus) => {
                        this.conflictStatus.set(status.conflictStatusId, status);
                    });
                }
            }
            return true;
        } catch (error) {
            throw error;
        } finally {
            this.isLoading = false;
        }
    }
    async getIssuesAddressedBy(): Promise<boolean> {
        try {
            if ([...this.issuesAddressBy.values()].length == 0) {
                this.isLoading = true;
                let data = await conflictService.getIssuesAddressed();
                if (data.success) {
                    this.issuesAddressBy.clear();
                    data.data.forEach((issue: IIssuesAddressBy) => {
                        this.issuesAddressBy.set(issue.issuesAddressById, issue);
                    });
                }
            }
            return true;
        } catch (error) {
            throw error;
        } finally {
            this.isLoading = false;
        }
    }
    async getCourtLitigation(): Promise<boolean> {
        try {
            if ([...this.courtLitigationStatus.values()].length == 0) {
                this.isLoading = true;
                let data = await conflictService.getCourtLitigationStatuses();
                if (data.success) {
                    this.courtLitigationStatus.clear();
                    data.data.forEach((litigation: ICourtLitigationStatus) => {
                        this.courtLitigationStatus.set(litigation.courtLitigationStatusId, litigation);
                    });
                }
            }
            return true;

        } catch (error) {
            throw error;
        } finally {
            this.isLoading = false;
        }
    }
    filterMajorConflict(cc: Array<ICauseOfConflictDashboard>): Array<IDropdownProp> {
        const first = cc[0];
        if (!first) {
            return [];
        }

        const filtered: Array<IDropdownProp> = [];

        for (const key in first) {
            const typedKey = key as keyof ICauseOfConflictDashboard;
            const value = first[typedKey];

            if (typedKey !== "VALUE_TYPE") {
                if (Number(value) > 0) {
                    filtered.push(
                        {
                            label: typedKey,
                            value: value
                        }
                    );
                }
            }
        }

        return filtered;
    }


    transformConflictDashboard(data: IConflictDashboard): IConflictDashboardOutput {
        return {
            ALL_CONFLICT_REPORT: data.ALL_CONFLICT_REPORT[0]?.All_CONFLICT || 0,
            RESOLVED_CONFLICT: data.RESOLVED_CONFLICT[0]?.RESOLVED_CONFLICT || 0,
            PENDING_CONFLICT: data.PENDING_CONFLICT[0]?.PENDING_CONFLICT || 0,
            CONFLICTS_IN_COURT: data.CONFLICTS_IN_COURT[0]?.CONFLICT_IN_COURT || 0,

            STATUS_OF_CONFLICT: data.STATUS_OF_CONFLICT.length > 0
                ? [
                    Number(data.STATUS_OF_CONFLICT[0].THE_ISSUE_HAS_BEEN_EFFECTIVELY_ADDRESSED),
                    Number(data.STATUS_OF_CONFLICT[0].THE_ISSUE_IS_NOT_EFFECTIVELY_ADDRESSED),
                    Number(data.STATUS_OF_CONFLICT[0].THE_ISSUE_IS_CURRENTLY_BEING_ADDRESSED),
                    Number(data.STATUS_OF_CONFLICT[0].THE_ISSUE_IS_YET_TO_BE_ADDRESSED)
                ]
                : [0, 0, 0, 0],

            CONFLICT_OF_COURT_LITIGATION: data.CONFLICT_OF_COURT_LITIGATION.length > 0
                ? [
                    Number(data.CONFLICT_OF_COURT_LITIGATION[0].THE_LITIGATION_IS_ONGOING),
                    Number(data.CONFLICT_OF_COURT_LITIGATION[0].THE_LITIGATION_HAS_BEEN_WITHDRAWN),
                    Number(data.CONFLICT_OF_COURT_LITIGATION[0].THERE_IS_A_COURT_JUDGEMENT)
                ]
                : [0, 0, 0],

            REPORT_FREQUENCY: data.REPORT_FREQUENCY.map(r => r.REPORT_COUNT),

            CAUSE_OF_CONFLICT: this.filterMajorConflict(data.CAUSE_OF_CONFLICT),

            RESOLVED_CONFLICTS: data.RESOLVED_CONFLICTS,
            UNRESOLVED_CONFLICTS: data.UNRESOLVED_CONFLICTS
        };
    }

    async getConflictDashboardByTrustId(trustId: string): Promise<void> {
        try {
            if (this.isDashboardLoading || this.dashboardData) return; // Prevent duplicate calls
            this.isDashboardLoading = true;
            let data = await conflictService.getConflictDashboardByTrustId(trustId);
            if (data.success) {
                const processedData = this.transformConflictDashboard(data.data);
                this.dashboardData = processedData;
                // console.log(toJS(processedData))
            }
        } catch (error) {
            throw error;
        } finally {
            this.isDashboardLoading = false;
        }
    }



}




// Create an instance of the store
// and export it for use in the application
export const conflictStore = new ConflictStore();