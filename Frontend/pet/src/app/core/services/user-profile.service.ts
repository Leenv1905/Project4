import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
}

export interface UpdateUserProfilePayload {
  name: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
}

export interface RegisterSellerPayload {
  displayName: string;
  sellerType: 'INDIVIDUAL' | 'SHOP' | 'FARM';
  bio?: string;
  taxCode?: string;
}

export interface UserAddress {
  id: number;
  receiverName: string;
  phone: string;
  address: string;
  isDefault: boolean;
  createdAt?: string;
}

export interface CreateAddressPayload {
  receiverName: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/v1/api/users/me`;
  private readonly baseUrl = `${environment.apiBaseUrl}/v1/api/users`;

  getMyProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(this.apiUrl, { withCredentials: true });
  }

  updateMyProfile(payload: UpdateUserProfilePayload): Observable<UserProfile> {
    return this.http.put<UserProfile>(this.apiUrl, payload, { withCredentials: true });
  }

  registerSeller(payload: RegisterSellerPayload): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/register-seller`, payload, { withCredentials: true });
  }

  getMyAddresses(): Observable<UserAddress[]> {
    return this.http.get<UserAddress[]>(`${this.baseUrl}/addresses`, { withCredentials: true });
  }

  createAddress(payload: CreateAddressPayload): Observable<UserAddress> {
    return this.http.post<UserAddress>(`${this.baseUrl}/addresses`, payload, { withCredentials: true });
  }
}
