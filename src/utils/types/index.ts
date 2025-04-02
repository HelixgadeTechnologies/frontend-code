export interface PasswordType {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfilePic {
  hexImage: string;
  mimeType: string;
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

export interface CreateAdmin {
  isCreate: boolean;
  data: {
    userId?: string | null;
    firstName: string;
    lastName?: string;
    email: string;
    roleId: string;
    trusts?: string;
  };
}

interface BaseItem {
  id: string;
}

export interface AdminUser extends BaseItem {
  length: number | undefined;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  trusts?: string;
}

export type AdminsArray = AdminUser[];

export interface ActiveMenuProps {
  userId: string;
  activeMenu: string | null;
  menuRef: React.RefObject<HTMLDivElement | null>;
  handleEdit: () => void;
  handleDelete: () => void;
}

export interface DeleteUserType {
  userId: string;
}

export interface CreateSettlor {
  isCreate: boolean;
  data: {
    settlorId?: string;
    settlorName: string;
    omlCode: string;
    contactName: string;
    contactEmail: string;
    contactPhoneNumber: string;
  };
}

export interface DeleteSettlorType {
  settlorId: string;
}

export interface SettlorType extends BaseItem {
  settlorId: string;
  length: number | undefined;
  settlorName: string;
  omlCode: string;
  contactName: string;
  contactEmail: string;
  contactPhoneNumber: string;
}

export type SettlorsArray = SettlorType[];

export interface CreateDRA {
  isCreate: boolean;
  data: {
    userId?: string;
    firstName: string;
    lastName: string;
    trust: string;
    email: string;
    phoneNumber: string;
  };
}

export interface DRAType extends BaseItem {
  userId: string;
  length: number | undefined;
  firstName: string;
  role: string;
  lastName: string;
  email: string;
  trusts: string;
  phoneNumber: string;
}

export type DRAsArray = DRAType[];

export interface NUPRCItem extends BaseItem {
  userId: string;
  length: number | undefined;
  firstName: string;
  role: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface CreateNuprc {
  isCreate: boolean;
  data: {
    userId?: string | null;
    firstName: string;
    lastName?: string;
    email: string;
    phoneNumber: string;
  };
}

export type NUPRCsArray = NUPRCItem[];

export interface TrustItem extends BaseItem {
  trustId: string;
  trustName: string;
  trustCommunities: string[];
  ratings: number;
}

export type TrustArray = TrustItem[];

interface BotDetails {
  botDetailsId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  trustId?: string;
}

interface SelectProps {
  label: string;
  value: string;
}

export interface TrustInputFields {
  trustId?: string;
  trustName: string;
  settlorId: SelectProps[];
  nameOfOmls: string[];
  userId: string;
  country: string;
  state: SelectProps;
  omls?: string[];
  localGovernmentArea: SelectProps;
  trustCommunities: string[];
  botDetails: BotDetails[];
  totalMaleBotMembers: number;
  totalFemaleBotMembers: number;
  totalPwdBotMembers: number;
  totalMaleAdvisoryCommitteeMembers: number;
  totalFemaleAdvisoryCommitteeMembers: number;
  totalPwdAdvisoryCommitteeMembers: number;
  totalMaleManagementCommitteeMembers: number;
  totalFemaleManagementCommitteeMembers: number;
  totalPwdManagementCommitteeMembers: number;
}

export interface TrustFields {
  trustId?: string;
  trustName: string;
  settlorId: string[];
  nameOfOmls: string[];
  userId: string;
  country: string;
  state: string;
  omls?: string[];
  localGovernmentArea: string;
  trustCommunities: string[];
  botDetails: BotDetails[];
  totalMaleBotMembers: number;
  totalFemaleBotMembers: number;
  totalPwdBotMembers: number;
  totalMaleAdvisoryCommitteeMembers: number;
  totalFemaleAdvisoryCommitteeMembers: number;
  totalPwdAdvisoryCommitteeMembers: number;
  totalMaleManagementCommitteeMembers: number;
  totalFemaleManagementCommitteeMembers: number;
  totalPwdManagementCommitteeMembers: number;
}

export interface CreateTrustProps {
  isCreate: boolean;
  data: TrustFields;
}
