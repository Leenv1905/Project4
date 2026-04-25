import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { VerificationService, VerificationTask } from '../../../core/services/verification.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  standalone: true,
  selector: 'app-operator-tasks',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, FormsModule],
  template: `
    <div class="operator-container" style="padding: 15px; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50; display: flex; align-items: center;">
        <mat-icon style="margin-right: 10px; color: #3498db;">assignment</mat-icon>
        Nhiệm vụ Xác minh của tôi
      </h2>
      
      <div *ngIf="tasks.length === 0" style="text-align: center; margin-top: 50px; color: #95a5a6;">
        <mat-icon style="font-size: 64px; width: 64px; height: 64px; color: #2ecc71;">check_circle</mat-icon>
        <p style="font-size: 18px;">Tuyệt vời! Bạn đã hoàn thành tất cả nhiệm vụ.</p>
      </div>

      <mat-card *ngFor="let task of tasks" style="margin-bottom: 24px; border-left: 6px solid #3498db; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <mat-card-header>
          <mat-card-title style="font-weight: 600;">{{task.pet.name}}</mat-card-title>
          <mat-card-subtitle>
            Mã: {{task.pet.petCode}} | Chủ: {{task.pet.ownerName || 'Shop'}}
          </mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content style="margin-top: 20px;">
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
             <p><strong>Giống:</strong> {{task.pet.breed}}</p>
             <p><strong>Giá:</strong> {{task.pet.price | number}} đ</p>
          </div>

          <div class="form-group" style="margin-bottom: 20px;">
            <button mat-raised-button color="accent" (click)="getGPS(task)">
              <mat-icon>location_on</mat-icon>
              {{ task.locationGps ? 'Đã lấy tọa độ' : 'Lấy tọa độ GPS' }}
            </button>
            <div *ngIf="task.locationGps" style="margin-top: 8px; font-size: 13px; color: #27ae60; font-weight: 500;">
               Tọa độ: {{task.locationGps}}
            </div>
          </div>

          <mat-form-field appearance="outline" style="width: 100%;">
            <mat-label>Video/Ảnh quét Microchip (URL)</mat-label>
            <input matInput [(ngModel)]="task.scannedChipImageUrl" placeholder="https://storage.com/video.mp4">
            <mat-icon matSuffix>link</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" style="width: 100%;">
            <mat-label>Ghi chú sức khỏe/thực tế</mat-label>
            <textarea matInput [(ngModel)]="task.healthNote" rows="3" placeholder="Ví dụ: Bé rất khỏe mạnh, hoạt bát..."></textarea>
          </mat-form-field>
        </mat-card-content>

        <mat-card-actions align="end" style="padding: 16px;">
          <button mat-flat-button color="primary" 
                  style="padding: 0 24px;"
                  (click)="submit(task)" 
                  [disabled]="!task.locationGps || !task.scannedChipImageUrl">
            <mat-icon>cloud_upload</mat-icon> Gửi báo cáo xác minh
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `
})
export class OperatorTasksComponent implements OnInit {
  private verificationService = inject(VerificationService);
  private toast = inject(ToastService);
  tasks: VerificationTask[] = [];

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.verificationService.getMyTasks().subscribe(data => {
      this.tasks = data || [];
    });
  }

  getGPS(task: VerificationTask) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        task.locationGps = `${pos.coords.latitude}, ${pos.coords.longitude}`;
      }, () => this.toast.error('Vui lòng cho phép quyền truy cập GPS để xác thực vị trí.'));
    } else {
      this.toast.error('Trình duyệt của bạn không hỗ trợ định vị GPS.');
    }
  }

  submit(task: VerificationTask) {
    const payload = {
      chipUrl: task.scannedChipImageUrl,
      gps: task.locationGps,
      note: task.healthNote
    };
    this.verificationService.submitVerification(task.id, payload).subscribe({
      next: () => {
        this.toast.success('Báo cáo xác minh đã được gửi thành công! Chờ Admin phê duyệt.');
        this.loadTasks();
      },
      error: () => this.toast.error('Đã có lỗi xảy ra khi gửi báo cáo.')
    });
  }
}
