import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface UnassignedPet {
  petId: number;
  petName: string;
  breed: string;
  petCode: string;
  shopName: string;
  orderId?: number;
  orderCode?: string;
  totalPetsInOrder: number;
  verifiedPetsInOrder: number;
}

export interface VerificationTask {
  id: number;
  pet: {
    id: number;
    name: string;
    petCode: string;
    breed: string;
    price: number;
    ownerName: string;
  };
  operator: {
    id: number;
    name: string;
    email: string;
  };
  status: string;
  assignedAt?: string;
  completedAt?: string;
  scannedChipCode?: string;
  scannedChipImageUrl?: string;
  locationGps?: string;
  healthNote?: string;
  adminFeedback?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VerificationService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/v1/verifications`;

  assignTask(petId: number, operatorId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/assign`, { petId, operatorId }, { withCredentials: true });
  }

  getMyTasks(): Observable<VerificationTask[]> {
    return this.http.get<any>(`${this.apiUrl}/my-tasks`, { withCredentials: true }).pipe(
      map(res => res?.data || [])
    );
  }

  // Returns observable that resolves to 'APPROVED' | 'REJECTED'
  submitVerification(taskId: number, payload: { chipCode?: string; chipUrl?: string; gps?: string; note?: string }): Observable<string> {
    return this.http.post<any>(`${this.apiUrl}/${taskId}/submit`, payload, { withCredentials: true }).pipe(
      map(res => res?.data || 'REJECTED')
    );
  }

  cancelOrderByTask(taskId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${taskId}/cancel-order`, {}, { withCredentials: true });
  }

  getSubmittedTasks(): Observable<VerificationTask[]> {
    return this.http.get<any>(`${this.apiUrl}/submitted`, { withCredentials: true }).pipe(
      map(res => res?.data || [])
    );
  }

  getPendingTasks(): Observable<VerificationTask[]> {
    return this.http.get<any>(`${this.apiUrl}/pending`, { withCredentials: true }).pipe(
      map(res => res?.data || [])
    );
  }

  uploadChipFile(taskId: number, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.apiUrl}/${taskId}/upload-chip`, formData, { withCredentials: true }).pipe(
      map(res => res?.data || '')
    );
  }

  getUnassignedPets(): Observable<UnassignedPet[]> {
    return this.http.get<any>(`${this.apiUrl}/unassigned-pets`, { withCredentials: true }).pipe(
      map(res => res?.data || [])
    );
  }

  getTasksByStatus(status: string): Observable<VerificationTask[]> {
    return this.http.get<any>(`${this.apiUrl}/by-status/${status}`, { withCredentials: true }).pipe(
      map(res => res?.data || [])
    );
  }

  approveVerification(taskId: number, feedback: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${taskId}/approve`, { feedback }, { withCredentials: true });
  }
}