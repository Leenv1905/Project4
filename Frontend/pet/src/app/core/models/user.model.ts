export type Role = string;
export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
  // Các trường bổ sung cho Admin
  age?: number;
  phone?: string;
  avatar?: string;
  address?: string;
  createdAt?: Date;
  status?: 'active' | 'inactive';
  enabled?: boolean;
  avatarUrl?:string;
}
