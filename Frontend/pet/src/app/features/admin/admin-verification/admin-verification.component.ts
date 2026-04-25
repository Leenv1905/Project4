import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { VerificationService, VerificationTask } from '../../../core/services/verification.service';
import { PetApiService } from '../../../core/services/pet-api.service';
import { AdminService } from '../../../core/services/admin.service';
import { User } from '../../../core/models/user.model';
import { forkJoin } from 'rxjs';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  standalone: true,
  selector: 'app-admin-verification',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressBarModule,
    FormsModule
  ],
  template: `
    <div class="admin-container" style="padding: 24px; background: #f4f7f6; min-height: 100vh;">
      <!-- Header Area -->
      <div class="header-card" style="background: white; padding: 24px; border-radius: 12px; margin-bottom: 24px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h1 style="color: #2c3e50; font-weight: 700; margin: 0; font-size: 28px; display: flex; align-items: center;">
            <mat-icon style="font-size: 32px; width: 32px; height: 32px; margin-right: 12px; color: #3498db;">verified</mat-icon>
            Trung tâm Xác minh Thực địa (O2O)
          </h1>
          <p style="color: #7f8c8d; margin-top: 8px; font-size: 15px;">Quản lý toàn diện quy trình kiểm soát chất lượng từ Shop đến Người dùng.</p>
        </div>
        <div style="display: flex; gap: 12px;">
           <button mat-stroked-button (click)="loadData()" [disabled]="isLoading">
             <mat-icon>refresh</mat-icon> Làm mới dữ liệu
           </button>
        </div>
      </div>

      <mat-progress-bar *ngIf="isLoading" mode="indeterminate" style="margin-bottom: 16px;"></mat-progress-bar>
      
      <mat-tab-group (selectedTabChange)="onTabChange($event)" mat-stretch-tabs="false" animationDuration="150ms">
        
        <!-- TAB 1: CẦN PHÊ DUYỆT -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon style="margin-right: 8px;">rate_review</mat-icon>
            Chờ Phê Duyệt
            <span *ngIf="submittedTasks.length > 0" class="badge">{{submittedTasks.length}}</span>
          </ng-template>
          
          <div class="tab-content" style="padding-top: 20px;">
            <div class="table-container mat-elevation-z1" style="background: white; border-radius: 8px; overflow: hidden;">
              <table mat-table [dataSource]="submittedTasks" style="width: 100%;">
                <ng-container matColumnDef="pet">
                  <th mat-header-cell *matHeaderCellDef> Thú cưng </th>
                  <td mat-cell *matCellDef="let element"> 
                    <div style="display: flex; align-items: center; padding: 12px 0;">
                      <div class="pet-icon" style="width: 40px; height: 40px; background: #e3f2fd; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                        <mat-icon style="color: #3498db;">pets</mat-icon>
                      </div>
                      <div>
                        <strong style="font-size: 15px; color: #34495e;">{{element.pet.name}}</strong><br>
                        <small style="color: #95a5a6; font-family: monospace;">{{element.pet.petCode}}</small>
                      </div>
                    </div>
                  </td>
                </ng-container>

                <ng-container matColumnDef="operator">
                  <th mat-header-cell *matHeaderCellDef> Nhân viên thực hiện </th>
                  <td mat-cell *matCellDef="let element"> 
                    <div style="display: flex; align-items: center;">
                       <mat-icon style="font-size: 18px; margin-right: 6px; color: #7f8c8d;">person</mat-icon>
                       {{element.operator.name}} 
                    </div>
                  </td>
                </ng-container>

                <ng-container matColumnDef="media">
                  <th mat-header-cell *matHeaderCellDef> Bằng chứng </th>
                  <td mat-cell *matCellDef="let element"> 
                    <a [href]="element.scannedChipImageUrl" target="_blank" class="media-link">
                      <mat-icon>play_circle_outline</mat-icon> Video/Ảnh chip
                    </a>
                  </td>
                </ng-container>

                <ng-container matColumnDef="gps">
                  <th mat-header-cell *matHeaderCellDef> Vị trí GPS </th>
                  <td mat-cell *matCellDef="let element"> 
                    <a [href]="'https://www.google.com/maps?q=' + element.locationGps" target="_blank" style="color: #27ae60; text-decoration: none; font-size: 13px;">
                      <mat-icon style="font-size: 16px; vertical-align: middle;">location_on</mat-icon>
                      {{element.locationGps}}
                    </a>
                  </td>
                </ng-container>

                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef> </th>
                  <td mat-cell *matCellDef="let element" style="text-align: right; padding-right: 16px;">
                    <button mat-flat-button color="primary" (click)="approve(element.id)">
                      <mat-icon>verified</mat-icon> Duyệt & Cấp Tích Xanh
                    </button>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="row-hover"></tr>
              </table>

              <div *ngIf="submittedTasks.length === 0" class="empty-state">
                <mat-icon style="font-size: 64px; width: 64px; height: 64px;">inbox</mat-icon>
                <p>Tuyệt vời! Không có báo cáo nào đang chờ phê duyệt.</p>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- TAB 2: ĐANG XÁC MINH -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon style="margin-right: 8px;">hourglass_empty</mat-icon>
            Đang Xác Minh
            <span *ngIf="pendingTasks.length > 0" class="badge info">{{pendingTasks.length}}</span>
          </ng-template>

          <div class="tab-content" style="padding-top: 20px;">
            <div class="table-container mat-elevation-z1" style="background: white; border-radius: 8px; overflow: hidden;">
              <table mat-table [dataSource]="pendingTasks" style="width: 100%;">
                <ng-container matColumnDef="pet">
                  <th mat-header-cell *matHeaderCellDef> Thú cưng </th>
                  <td mat-cell *matCellDef="let element"> 
                    <div style="padding: 12px 0;">
                      <strong style="font-size: 15px; color: #34495e;">{{element.pet.name}}</strong><br>
                      <small style="color: #95a5a6;">Mã: {{element.pet.petCode}}</small>
                    </div>
                  </td>
                </ng-container>

                <ng-container matColumnDef="operator">
                  <th mat-header-cell *matHeaderCellDef> Nhân viên phụ trách </th>
                  <td mat-cell *matCellDef="let element"> {{element.operator.name}} </td>
                </ng-container>

                <ng-container matColumnDef="assignedAt">
                  <th mat-header-cell *matHeaderCellDef> Thời gian giao việc </th>
                  <td mat-cell *matCellDef="let element"> {{element.assignedAt | date:'HH:mm dd/MM/yyyy'}} </td>
                </ng-container>

                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef> Trạng thái </th>
                  <td mat-cell *matCellDef="let element">
                    <mat-chip-listbox>
                      <mat-chip style="background: #e3f2fd; color: #3498db;">Đang chờ báo cáo</mat-chip>
                    </mat-chip-listbox>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="pendingColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: pendingColumns;" class="row-hover"></tr>
              </table>

              <div *ngIf="pendingTasks.length === 0" class="empty-state">
                <mat-icon style="font-size: 64px; width: 64px; height: 64px;">check_circle_outline</mat-icon>
                <p>Không có nhiệm vụ nào đang trong quá trình thực địa.</p>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- TAB 3: GIAO VIỆC MỚI -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon style="margin-right: 8px;">assignment_ind</mat-icon>
            Chưa Giao Việc
            <span *ngIf="unassignedPets.length > 0" class="badge warn">{{unassignedPets.length}}</span>
          </ng-template>

          <div class="tab-content" style="padding-top: 20px;">
            <div class="table-container mat-elevation-z1" style="background: white; border-radius: 8px; overflow: hidden;">
              <table mat-table [dataSource]="unassignedPets" style="width: 100%;">
                <ng-container matColumnDef="pet">
                  <th mat-header-cell *matHeaderCellDef> Thú cưng mới </th>
                  <td mat-cell *matCellDef="let element"> 
                    <div style="padding: 12px 0;">
                      <strong style="font-size: 15px; color: #34495e;">{{element.name}}</strong><br>
                      <small style="color: #95a5a6;">Giống: {{element.breed}}</small>
                    </div>
                  </td>
                </ng-container>

                <ng-container matColumnDef="shop">
                  <th mat-header-cell *matHeaderCellDef> Shop </th>
                  <td mat-cell *matCellDef="let element"> {{element.shopName}} </td>
                </ng-container>

                <ng-container matColumnDef="assign">
                  <th mat-header-cell *matHeaderCellDef> Chọn Operator </th>
                  <td mat-cell *matCellDef="let element">
                    <mat-form-field appearance="outline" style="width: 240px; margin-top: 10px;" subscriptSizing="dynamic">
                      <mat-select [(value)]="element.selectedOperatorId" placeholder="Chọn nhân viên thực địa">
                        <mat-option *ngFor="let op of operators" [value]="op.id">
                          {{op.name}}
                        </mat-option>
                      </mat-select>
                    </mat-form-field>
                  </td>
                </ng-container>

                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef> </th>
                  <td mat-cell *matCellDef="let element" style="text-align: right; padding-right: 16px;">
                    <button mat-raised-button color="accent" 
                            [disabled]="!element.selectedOperatorId"
                            (click)="assignTask(element)">
                      <mat-icon>send</mat-icon> Giao việc
                    </button>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="unverifiedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: unverifiedColumns;" class="row-hover"></tr>
              </table>

              <div *ngIf="unassignedPets.length === 0" class="empty-state">
                <mat-icon style="font-size: 64px; width: 64px; height: 64px;">done_all</mat-icon>
                <p>Tất cả sản phẩm đã được điều phối xác minh.</p>
              </div>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .badge {
      background: #3498db;
      color: white;
      border-radius: 12px;
      padding: 2px 8px;
      font-size: 11px;
      margin-left: 8px;
      font-weight: 700;
    }
    .badge.warn { background: #e67e22; }
    .badge.info { background: #1abc9c; }
    .empty-state {
      text-align: center;
      padding: 60px;
      color: #bdc3c7;
    }
    .media-link {
      color: #3498db;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-weight: 500;
    }
    .media-link:hover { text-decoration: underline; }
    .row-hover:hover { background-color: #fcfcfc; }
    .pet-icon { transition: all 0.2s; }
    .row-hover:hover .pet-icon { transform: scale(1.1); }
  `]
})
export class AdminVerificationComponent implements OnInit {
  private verificationService = inject(VerificationService);
  private petApi = inject(PetApiService);
  private adminService = inject(AdminService);
  private toast = inject(ToastService);

  submittedTasks: VerificationTask[] = [];
  pendingTasks: VerificationTask[] = [];
  unassignedPets: any[] = [];
  operators: User[] = [];
  isLoading = false;

  displayedColumns = ['pet', 'operator', 'media', 'gps', 'actions'];
  pendingColumns = ['pet', 'operator', 'assignedAt', 'status'];
  unverifiedColumns = ['pet', 'shop', 'assign', 'actions'];

  ngOnInit() {
    this.loadData();
  }

  onTabChange(event: any) {
    if (event.index === 0) this.loadSubmitted();
    if (event.index === 1) this.loadPending();
    if (event.index === 2) this.loadUnassignedAndOperators();
  }

  loadData() {
    this.loadSubmitted();
    this.loadPending();
    this.loadUnassignedAndOperators();
  }

  loadSubmitted() {
    this.isLoading = true;
    this.verificationService.getSubmittedTasks().subscribe({
      next: (data) => {
        this.submittedTasks = data || [];
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  loadPending() {
    this.isLoading = true;
    this.verificationService.getPendingTasks().subscribe({
      next: (data) => {
        this.pendingTasks = data || [];
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  loadUnassignedAndOperators() {
    this.isLoading = true;
    forkJoin({
      pets: this.petApi.listAllPets(),
      users: this.adminService.getUsers(0, 1000),
      submitted: this.verificationService.getSubmittedTasks(),
      pending: this.verificationService.getPendingTasks()
    }).subscribe({
      next: (res) => {
        // Lấy danh sách Pet ID đang trong quá trình xử lý (PENDING hoặc SUBMITTED)
        const busyPetIds = new Set([
          ...res.submitted.map(t => t.pet.id),
          ...res.pending.map(t => t.pet.id)
        ]);

        // Lọc thú cưng: (Chưa verify) VÀ (Chưa có task nào đang xử lý)
        this.unassignedPets = res.pets
          .filter((p: any) => !p.isVerified && !busyPetIds.has(p.id))
          .map(p => ({...p, selectedOperatorId: null}));
        
        // Lọc users có role là operator
        this.operators = (res.users.content || []).filter((u: User) => 
          u.role.toLowerCase().includes('operator')
        );
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  assignTask(pet: any) {
    if (!pet.selectedOperatorId) return;
    
    this.isLoading = true;
    this.verificationService.assignTask(pet.id, pet.selectedOperatorId).subscribe({
      next: () => {
        this.toast.success(`Thành công! Đã giao nhiệm vụ cho nhân viên.`);
        this.loadUnassignedAndOperators();
        this.loadPending();
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error(err);
        const errorMsg = err.error?.message || 'Không thể giao nhiệm vụ.';
        this.toast.error('Lỗi: ' + errorMsg);
        this.isLoading = false;
      }
    });
  }

  approve(taskId: number) {
    if (!confirm('Xác nhận phê duyệt và cấp tích xanh cho thú cưng này?')) {
      return;
    }

    this.isLoading = true;
    this.verificationService.approveVerification(taskId, 'Thông tin chính xác.').subscribe({
      next: () => {
        this.toast.success('Đã phê duyệt thành công!');
        this.loadSubmitted();
        this.isLoading = false;
      },
      error: () => {
        this.toast.error('Lỗi phê duyệt.');
        this.isLoading = false;
      }
    });
  }
}
