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

export interface DeleteAdminType {
  userId: string;
}
