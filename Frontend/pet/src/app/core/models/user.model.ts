export type Role = 'user' | 'shop' | 'admin' | 'operators';

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
}
