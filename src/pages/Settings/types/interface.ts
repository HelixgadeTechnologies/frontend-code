import { ObservableMap } from "mobx";

export interface ISettingStore {
    isLoading: boolean,
    isSubmitting: boolean,
    isDeleting: boolean,
    selectedAdmin: IAdmin,
    isPasswordModelClose: boolean,
    allAdmin: ObservableMap<string, IAdmin>,
    allPendingAdmin: ObservableMap<string, IAdmin>,
    allRole: ObservableMap<string, IRole>
    selectedUserId: string,
    openModal: boolean,
    isUpdated: boolean,
    isDraUpdated: boolean,
    isApproving: boolean,
    isUploading: boolean,
    getAllAdmin(): Promise<boolean>,
    createAdmin(payload: CreateAdminPayload): Promise<boolean>,
    editAdmin(payload: CreateAdminPayload): Promise<boolean>,
    removeAdmin(userId: string): Promise<boolean>,
    declinePendingAdmin(userId: string): Promise<boolean>,
    approvePendingAdmin(payload: CreateAdminPayload): Promise<boolean>,
    changePassword(credentials: IChangePassword): Promise<boolean>,
    uploadProfilePic(credentials: IProfilePicsPayload): Promise<string>,
    getAllDra(): Promise<boolean>,
    createDra(payload: createDraPayload): Promise<boolean>,
    editDra(payload: createDraPayload): Promise<boolean>,
    approvePendingDra(payload: createDraPayload): Promise<boolean>,
    declinePendingDra(userId: string): Promise<boolean>,
    removeDra(userId: string): Promise<boolean>,
    getAllNUPRC(): Promise<boolean>,
    createNuprc(payload: createNuprcPayload): Promise<boolean>,
    editNuprc(payload: createNuprcPayload): Promise<boolean>,
    removeNuprc(userId: string): Promise<boolean>,
    getAllSettlor(): Promise<boolean>,
    createSettlor(payload: CreateSettlorPayload): Promise<boolean>,
    editSettlor(payload: CreateSettlorPayload): Promise<boolean>,
    removeSettlor(settlorId: string): Promise<boolean>,
    getRole(): Promise<void>,
}

export interface IProfilePicsPayload{
    base64String:string;
    mimeType:string;
}
interface BaseItem {
    id: string;
}
export interface IAdmin extends BaseItem {
    userId: string,
    firstName: string | null,
    lastName: string | null,
    email: string | null,
    phoneNumber: string | null,
    roleId: string | null,
    role: string | null,
    trusts: string | null,
    status: number | null,
    community: string | null,
    state: string | null,
    localGovernmentArea: string | null,
    profilePic: string | null,
    profilePicMimeType: string | null,
    password: string | null
}

export interface IDra extends BaseItem {
    userId: string,
    firstName: string | null,
    lastName: string | null,
    email: string | null,
    phoneNumber: string | null,
    roleId: string | null,
    role: string | null,
    trusts: string | null,
    status: number | null,
    community: string | null,
    state: string | null,
    localGovernmentArea: string | null,
    profilePic: string | null,
    profilePicMimeType: string | null,
    password: string | null
}
export interface INuprc extends BaseItem {
    userId: string,
    firstName: string | null,
    lastName: string | null,
    email: string | null,
    phoneNumber: string | null,
    roleId: string | null,
    role: string | null,
    trusts: string | null,
    status: number | null,
    community: string | null,
    state: string | null,
    localGovernmentArea: string | null,
    profilePic: string | null,
    profilePicMimeType: string | null,
    password: string | null
}

export interface User {
    userId: string;
    firstName?: string | null;
    lastName?: string | null;
    email?: string;
    role?: string | null;
    community?: string | null;
    state?: string | null;
    localGovernmentArea?: string | null;
    status?: number | null;
    profilePic?: string | null;
    address?: string | null;
    phoneNumber?: string | null;
    createAt?: string | null;
    updateAt?: string | null;
}
export interface IAdminPayloadData {
    userId?: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    roleId: string;
    trusts: string;
    status: number;
}
export interface CreateAdminPayload {
    isCreate: boolean;
    data: IAdminPayloadData
}

export interface IDraPayloadData {
    userId: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    // roleId: string,
    trusts: string,
    status: number
}
export interface createDraPayload {
    isCreate: boolean;
    data: IDraPayloadData
}

export interface INuprcPayloadData {
    userId: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
}
export interface createNuprcPayload {
    isCreate: boolean;
    data: INuprcPayloadData
}

export interface ActiveMenuProps {
    userId: string;
    activeMenu: string | null;
    menuRef: React.RefObject<HTMLDivElement | null>;
    handleEdit: () => void;
    handleDelete: () => void;
}
export interface ISettlorPayloadData {
    settlorId?: string;
    settlorName: string;
    omlCode: string;
    contactName: string;
    contactEmail: string;
    contactPhoneNumber: string;
}
export interface CreateSettlorPayload {
    isCreate: boolean;
    data: ISettlorPayloadData
}
export interface ISettlor extends BaseItem  {
    settlorId: string;
    settlorName: string;
    omlCode: string;
    contactName: string;
    contactEmail: string;
    contactPhoneNumber: string;
}

export interface IChangePassword {
    oldPassword: string | undefined,
    newPassword: string | undefined,
    confirmPassword: string | undefined
}

export interface IRole {
    roleId: string,
    roleName: string,
    roleOrder: number
}

export interface IDropdownProp {
    label: string,
    value: string
}