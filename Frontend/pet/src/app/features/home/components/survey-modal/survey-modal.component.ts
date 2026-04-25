import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-survey-modal',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatSliderModule,
    MatIconModule
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
            <button mat-stroked-button (click)="livingSpace = 1" [color]="livingSpace === 1 ? 'primary' : ''">Can ho nho</button>
            <button mat-stroked-button (click)="livingSpace = 2" [color]="livingSpace === 2 ? 'primary' : ''">Nha pho vua</button>
            <button mat-stroked-button (click)="livingSpace = 3" [color]="livingSpace === 3 ? 'primary' : ''">Biet thu co san vuon</button>
          </div>
        </div>

        <div *ngIf="step === 3" class="step-content">
          <h3>3. Kinh nghiem nuoi thu cung cua ban?</h3>
          <div class="choice-grid">
            <button mat-stroked-button (click)="experienceLevel = 1" [color]="experienceLevel === 1 ? 'primary' : ''">Chua co kinh nghiem</button>
            <button mat-stroked-button (click)="experienceLevel = 2" [color]="experienceLevel === 2 ? 'primary' : ''">Da tung nuoi</button>
            <button mat-stroked-button (click)="experienceLevel = 3" [color]="experienceLevel === 3 ? 'primary' : ''">Rat nhieu kinh nghiem</button>
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
  `,
  styles: [`
    .step-content { text-align: center; }
    .choice-grid { display: grid; gap: 10px; margin-top: 20px; }
    .full-width { width: 100%; padding: 10px; box-sizing: border-box; }
  `]
})
export class SurveyModalComponent {
  step = 1;
  dailyTime = 2;
  livingSpace = 1;
  experienceLevel = 1;
  monthlyBudget = 500000;

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
          alert('Cam on ban. Chung toi da cap nhat goi y cho ban.');
          this.dialogRef.close(true);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.dialogRef.close(false);
            this.auth.openLogin();
            alert('Phien dang nhap da het han. Vui long dang nhap lai.');
            return;
          }

          alert('Loi khi luu thong tin.');
        }
      });
  }
}
