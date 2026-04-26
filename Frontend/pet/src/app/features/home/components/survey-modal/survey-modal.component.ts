import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationModalComponent } from '../../../../shared/notification-modal/notification-modal.component';

@Component({
  standalone: true,
  selector: 'app-survey-modal',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatSliderModule,
    MatIconModule,
    NotificationModalComponent
  ],
  template: `
    <div class="survey-container" style="padding: 20px; max-width: 500px;">
      <h2 style="text-align: center; color: #ff6b6b;">Tim kiem thu cung phu hop cho ban</h2>
      <p style="text-align: center; color: #666; margin-bottom: 30px;">
        Vui long tra loi mot vai cau hoi de chung toi goi y lua chon tot hon.
      </p>

      <div class="steps">
        <div *ngIf="step === 1" class="step-content">
          <h3>1. Ban co bao nhieu thoi gian moi ngay cho thu cung?</h3>
          <div class="options">
            <mat-slider min="0" max="24" step="1" discrete>
              <input matSliderThumb [(ngModel)]="dailyTime">
            </mat-slider>
            <p>{{ dailyTime }} gio / ngay</p>
          </div>
        </div>

        <div *ngIf="step === 2" class="step-content">
          <h3>2. Khong gian song cua ban nhu the nao?</h3>
          <div class="choice-grid">
            <button class="choice-btn" [class.selected]="livingSpace === 1" (click)="livingSpace = 1">Can ho nho</button>
            <button class="choice-btn" [class.selected]="livingSpace === 2" (click)="livingSpace = 2">Nha pho vua</button>
            <button class="choice-btn" [class.selected]="livingSpace === 3" (click)="livingSpace = 3">Biet thu co san vuon</button>
          </div>
        </div>

        <div *ngIf="step === 3" class="step-content">
          <h3>3. Kinh nghiem nuoi thu cung cua ban?</h3>
          <div class="choice-grid">
            <button class="choice-btn" [class.selected]="experienceLevel === 1" (click)="experienceLevel = 1">Chua co kinh nghiem</button>
            <button class="choice-btn" [class.selected]="experienceLevel === 2" (click)="experienceLevel = 2">Da tung nuoi</button>
            <button class="choice-btn" [class.selected]="experienceLevel === 3" (click)="experienceLevel = 3">Rat nhieu kinh nghiem</button>
          </div>
        </div>

        <div *ngIf="step === 4" class="step-content">
          <h3>4. Ngan sach hang thang cho thu cung (VND)?</h3>
          <input type="number" [(ngModel)]="monthlyBudget" class="full-width" placeholder="Vi du: 1000000">
        </div>
      </div>

      <div class="actions" style="margin-top: 30px; display: flex; justify-content: space-between;">
        <button mat-button (click)="prev()" [disabled]="step === 1">Quay lai</button>
        <button mat-flat-button color="primary" (click)="next()" *ngIf="step < 4">Tiep tuc</button>
        <button mat-flat-button color="warn" (click)="submit()" *ngIf="step === 4">Hoan tat</button>
      </div>
    </div>

    <app-notification-modal
      *ngIf="modal"
      [title]="modal.title"
      [message]="modal.message"
      [type]="modal.type"
      (closed)="onModalClosed()"
    />
  `,
  styles: [`
    .step-content { text-align: center; }
    .choice-grid { display: grid; gap: 10px; margin-top: 20px; }
    .full-width { width: 100%; padding: 10px; box-sizing: border-box; }

    .choice-btn {
      padding: 12px 20px;
      border: 2px solid #d1d5db;
      border-radius: 8px;
      background: #fff;
      color: #374151;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s, color 0.15s;
    }
    .choice-btn:hover {
      background: #f0f4ff;
      border-color: #6366f1;
      color: #4f46e5;
    }
    .choice-btn.selected {
      background: #6366f1;
      border-color: #6366f1;
      color: #fff;
    }
    .choice-btn.selected:hover {
      background: #4f46e5;
      border-color: #4f46e5;
    }
  `]
})
export class SurveyModalComponent {
  step = 1;
  dailyTime = 2;
  livingSpace = 1;
  experienceLevel = 1;
  monthlyBudget = 500000;
  modal: { title: string; message: string; type: 'success' | 'error' | 'info' } | null = null;

  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly dialogRef = inject(MatDialogRef<SurveyModalComponent>);

  next() {
    this.step++;
  }

  prev() {
    this.step--;
  }

  submit() {
    const payload = {
      dailyTime: this.dailyTime,
      livingSpace: this.livingSpace,
      activityTime: this.dailyTime,
      experienceLevel: this.experienceLevel,
      monthlyBudget: this.monthlyBudget
    };

    this.http.post('http://localhost:8080/gupet/api/v1/buyer-profiles', payload, { withCredentials: true })
      .subscribe({
        next: () => {
          this.modal = { title: 'Cảm ơn bạn!', message: 'Chúng tôi đã cập nhật gợi ý phù hợp cho bạn.', type: 'success' };
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.dialogRef.close(false);
            this.auth.openLogin();
            return;
          }
          this.modal = { title: 'Lỗi', message: 'Có lỗi xảy ra khi lưu thông tin.', type: 'error' };
        }
      });
  }

  onModalClosed() {
    if (this.modal?.type === 'success') {
      this.dialogRef.close(true);
    }
    this.modal = null;
  }
}
