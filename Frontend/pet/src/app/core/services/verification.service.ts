import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface VerificationTask {
  id: number;
  pet: any;
  operator: any;
  status: string;
  assignedAt?: string;
  completedAt?: string;
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
  private apiUrl = 'http://localhost:8080/gupet/api/v1/verifications';

  assignTask(petId: number, operatorId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/assign`, { petId, operatorId }, { withCredentials: true });
  }

  getMyTasks(): Observable<VerificationTask[]> {
    return this.http.get<any>(`${this.apiUrl}/my-tasks`, { withCredentials: true }).pipe(
      map(res => res.data)
    );
  }

  submitVerification(taskId: number, payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${taskId}/submit`, payload, { withCredentials: true });
  }

  getSubmittedTasks(): Observable<VerificationTask[]> {
    return this.http.get<any>(`${this.apiUrl}/submitted`, { withCredentials: true }).pipe(
      map(res => res.data)
    );
  }

  getPendingTasks(): Observable<VerificationTask[]> {
    return this.http.get<any>(`${this.apiUrl}/pending`, { withCredentials: true }).pipe(
      map(res => res.data)
    );
  }

  approveVerification(taskId: number, feedback: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${taskId}/approve`, { feedback }, { withCredentials: true });
  }
}
