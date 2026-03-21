export type Role = 'user' | 'shop' | 'admin' | 'operators';

export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
}
