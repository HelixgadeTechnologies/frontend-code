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

export interface DRAType extends BaseItem {
  userId: string;
  length: number | undefined;
  firstName: string;
  role: string;
  lastName: string;
  email: string;
}

export type DRAsArray = DRAType[];

export interface NUPRCItem extends BaseItem {
  userId: string;
  length: number | undefined;
  firstName: string;
  role: string;
  lastName: string;
  email: string;
}

export type NUPRCsArray = NUPRCItem[];
