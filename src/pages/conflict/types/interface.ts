import { ObservableMap } from "mobx";
import { IDropdownProp } from "../../Settings/types/interface";

export interface IConflictStore {
  isLoading: boolean;
  isSubmitting: boolean;
  isDashboardLoading: boolean;
  isEditDialogVisible: boolean;
  isReportDialogVisible: boolean;
  selectedConflict: IConflictView | null;
  resolvedConflict: IConflictView | null;
  unResolvedConflict: IConflictView | null;
  dashboardData: IConflictDashboardOutput | null
  conflictBaseView: number;
  conflicts: ObservableMap<string, IConflictView>;
  filteredConflicts: ObservableMap<string, IConflictView>;
  causeOfConflict: ObservableMap<number, ICauseOfConflict>;
  partiesInvolve: ObservableMap<number, IPartiesInvolve>;
  conflictStatus: ObservableMap<number, IConflictStatus>;
  issuesAddressBy: ObservableMap<number, IIssuesAddressBy>;
  courtLitigationStatus: ObservableMap<number, ICourtLitigationStatus>;

  getConflicts(trustId: string): Promise<boolean>;
  filterConflict(conflictStatusId: number): void;
  resetConflict(): void;
  createConflict(payload: IConflictPayload, trustId: string): Promise<boolean>;
  getCauseOfConflict(): Promise<boolean>;
  getPartiesInvolve(): Promise<boolean>;
  getConflictStatus(): Promise<boolean>;
  getIssuesAddressedBy(): Promise<boolean>;
  getCourtLitigation(): Promise<boolean>;
  filterMajorConflict(cc: Array<ICauseOfConflictDashboard>): Array<IDropdownProp>;
  transformConflictDashboard(data: IConflictDashboard): IConflictDashboardOutput;
  getConflictDashboardByTrustId(trustId: string): Promise<void>;

}


export interface IConflict {
  conflictId: string;
  projectId?: string | null;
  userId?: string | null;
  causeOfConflictId?: number | null;
  partiesInvolveId?: number | null;
  narrateIssues?: string | null;
  conflictStatusId?: number | null;
  issuesAddressById?: number | null;
  courtLitigationStatusId?: number | null;
  createAt?: Date | null;
  updateAt?: Date | null;
}

interface BaseItem {
  id: string;
}
export interface IConflictView extends BaseItem {
  conflictId: string;
  projectId: string | null;
  projectTitle: string | null;
  userId: string | null;
  userFirstName: string | null;
  userLastName: string | null;
  userEmail: string | null;
  userPhoneNumber: string | null;
  causeOfConflictId: number | null;
  causeOfConflictName: string | null;
  partiesInvolveId: number | null;
  partiesInvolveName: string | null;
  narrateIssues: string | null;
  conflictStatusId: number | null;
  conflictStatusName: string | null;
  issuesAddressById: number | null;
  issuesAddressByName: string | null;
  courtLitigationStatusId: number | null;
  courtLitigationStatusName: string | null;
  createAt: string;
  updateAt: string;
  trustId: string;
  projectCreateAt?: string;
}

export interface ICauseOfConflict {
  causeOfConflictId: number;
  causeOfConflict?: string | null;
}

export interface IPartiesInvolve {
  partiesInvolveId: number;
  partiesInvolve?: string | null;
}

export interface IConflictStatus {
  conflictStatusId: number;
  conflictStatus?: string | null;
}

export interface IIssuesAddressBy {
  issuesAddressById: number;
  issuesAddressBy?: string | null;
}

export interface ICourtLitigationStatus {
  courtLitigationStatusId: number;
  courtLitigationStatus?: string | null;
}

export interface IConflictPayloadData {
  conflictId?: string;
  projectId: string;
  causeOfConflictId: number;
  partiesInvolveId: number;
  narrateIssues: string;
  conflictStatusId: number;
  issuesAddressById: number;
  courtLitigationStatusId: number;

}
export interface IConflictPayload {
  isCreate: boolean,
  data: IConflictPayloadData
}
export interface IConflictDashboardOutput {
  ALL_CONFLICT_REPORT: number,
  RESOLVED_CONFLICT: number,
  PENDING_CONFLICT: number,
  CONFLICTS_IN_COURT: number,
  STATUS_OF_CONFLICT: Array<number>,
  CONFLICT_OF_COURT_LITIGATION: Array<number>,
  // single array value ends here

  REPORT_FREQUENCY: Array<number>,
  CAUSE_OF_CONFLICT: Array<IDropdownProp>,

  RESOLVED_CONFLICTS: Array<IConflictView>,
  UNRESOLVED_CONFLICTS: Array<IConflictView>,

}
export interface IConflictDashboard {
  // single array value
  ALL_CONFLICT_REPORT: Array<ITotalConflictDashboard>,
  RESOLVED_CONFLICT: Array<ITotalResolvedConflictDashboard>,
  PENDING_CONFLICT: Array<ITotalPendingConflictDashboard>,
  CONFLICTS_IN_COURT: Array<ITotalConflictInCourtDashboard>,

  STATUS_OF_CONFLICT: Array<IConflictStatusDashboard>,
  CONFLICT_OF_COURT_LITIGATION: Array<IConflictCourtLitigationDashboard>,

  // multiple array value
  REPORT_FREQUENCY: Array<IReportFrequency>,

  // single array value
  CAUSE_OF_CONFLICT: Array<ICauseOfConflictDashboard>,

  // multiple array value
  RESOLVED_CONFLICTS: Array<IConflictView>,
  UNRESOLVED_CONFLICTS: Array<IConflictView>,
}

export interface ITotalConflictDashboard {
  All_CONFLICT: number
}
export interface ITotalResolvedConflictDashboard {
  RESOLVED_CONFLICT: number
}
export interface ITotalPendingConflictDashboard {
  PENDING_CONFLICT: number
}
export interface ITotalConflictInCourtDashboard {
  CONFLICT_IN_COURT: number
}
export interface IConflictStatusDashboard {
  THE_ISSUE_HAS_BEEN_EFFECTIVELY_ADDRESSED: string,
  THE_ISSUE_IS_NOT_EFFECTIVELY_ADDRESSED: string,
  THE_ISSUE_IS_CURRENTLY_BEING_ADDRESSED: string,
  THE_ISSUE_IS_YET_TO_BE_ADDRESSED: string,
  VALUE_TYPE: string
}
export interface IConflictCourtLitigationDashboard {
  THE_LITIGATION_IS_ONGOING: string,
  THE_LITIGATION_HAS_BEEN_WITHDRAWN: string,
  THERE_IS_A_COURT_JUDGEMENT: string,
  VALUE_TYPE: string
}

export interface IReportFrequency {
  MONTH: number,
  REPORT_COUNT: number,
  VALUE_TYPE: string
}
export interface ICauseOfConflictDashboard {
  LAND_BORDER: string,
  CONSTITUTION_OF_BOT: string,
  CONSTITUTION_OF_MANAGEMENT_COMMITTEE: string,
  CONSTITUTION_OF_ADVISORY_COMMITTEE: string,
  PIPELINE_VANDALISM_AND_OIL_SPILL: string,
  DISTRIBUTION_MATRIX: string,
  LATE_RECEIVE_OF_TRUST_FUND: string,
  CONTRACTING_AND_PROJECT_DELIVERY: string,
  VALUE_TYPE: string
}


interface BaseItem {
  id: string;
}