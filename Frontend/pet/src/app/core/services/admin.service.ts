import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

export interface DashboardStats {
  totalRevenue: number;
  totalUsers: number;
  totalPets: number;
  totalOrders: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
}

export interface AdminUserPayload {
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/v1/api/admin`;

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard/stats`, { withCredentials: true });
  }

  getRevenueChart(): Observable<RevenueData[]> {
    return this.http.get<RevenueData[]>(`${this.apiUrl}/dashboard/revenue-chart`, { withCredentials: true });
  }

  getUsers(page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users?page=${page}&size=${size}`, { withCredentials: true });
  }

  updateUserStatus(userId: number, enabled: boolean): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/users/${userId}/status`, { enabled }, { withCredentials: true });
  }

  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${userId}`, { withCredentials: true });
  }

  createUser(payload: AdminUserPayload): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, payload, { withCredentials: true });
  }

  updateUser(userId: number, payload: AdminUserPayload): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${userId}`, payload, { withCredentials: true });
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${userId}`, { withCredentials: true });
  }
}
