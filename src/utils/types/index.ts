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

export interface Admin {
  isCreate: boolean;
  data: {
    userId?: string | null;
    firstName: string;
    lastName?: string;
    email: string;
    roleId: string;
    trusts: string[];
  };
}
