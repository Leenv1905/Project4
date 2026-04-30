import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface BuyerProfilePayload {
  dailyTime: number;
  livingSpace: number;
  activityTime: number;
  experienceLevel: number;
  monthlyBudget: number;
}

@Injectable({ providedIn: 'root' })
export class BuyerProfileService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/v1/buyer-profiles`;

  getMyProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`, { withCredentials: true });
  }

  createProfile(payload: BuyerProfilePayload): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload, { withCredentials: true });
  }
}
