export type UserRole = 'admin' | 'member';

export type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
};
