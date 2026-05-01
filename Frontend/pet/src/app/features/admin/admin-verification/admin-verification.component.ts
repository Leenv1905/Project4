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
      <!-- Header -->
      <div style="background: white; padding: 24px; border-radius: 12px; margin-bottom: 24px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h1 style="color: #2c3e50; font-weight: 700; margin: 0; font-size: 28px; display: flex; align-items: center;">
            <mat-icon style="font-size: 32px; width: 32px; height: 32px; margin-right: 12px; color: #3498db;">verified</mat-icon>
            Trung tâm Xác minh Thực địa (O2O)
          </h1>
          <p style="color: #7f8c8d; margin-top: 8px; font-size: 15px;">Quản lý toàn diện quy trình kiểm soát chất lượng từ Shop đến Người dùng.</p>
        </div>
        <button mat-stroked-button (click)="loadData()" [disabled]="isLoading">
          <mat-icon>refresh</mat-icon> Làm mới dữ liệu
        </button>
      </div>

      <mat-progress-bar *ngIf="isLoading" mode="indeterminate" style="margin-bottom: 16px;"></mat-progress-bar>

      <mat-tab-group (selectedTabChange)="onTabChange($event)" mat-stretch-tabs="false" animationDuration="150ms">

        <!-- TAB 1: ĐANG CHỜ -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon style="margin-right: 8px;">hourglass_empty</mat-icon>
            Đang Chờ
            <span *ngIf="pendingTasks.length > 0" class="badge info">{{pendingTasks.length}}</span>
          </ng-template>
          <div style="padding-top: 20px;">
            <div class="table-wrap">
              <table mat-table [dataSource]="pendingTasks" style="width: 100%;">
                <ng-container matColumnDef="pet">
                  <th mat-header-cell *matHeaderCellDef>Thú cưng</th>
                  <td mat-cell *matCellDef="let t">
                    <div style="padding: 12px 0;">
                      <strong style="font-size: 15px; color: #34495e;">{{t.pet.name}}</strong><br>
                      <small style="color: #95a5a6;">Mã: {{t.pet.petCode}}</small>
                    </div>
                  </td>
                </ng-container>
                <ng-container matColumnDef="operator">
                  <th mat-header-cell *matHeaderCellDef>Nhân viên phụ trách</th>
                  <td mat-cell *matCellDef="let t">{{t.operator.name}}</td>
                </ng-container>
                <ng-container matColumnDef="assignedAt">
                  <th mat-header-cell *matHeaderCellDef>Thời gian giao việc</th>
                  <td mat-cell *matCellDef="let t">{{t.assignedAt | date:'HH:mm dd/MM/yyyy'}}</td>
                </ng-container>
                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>Trạng thái</th>
                  <td mat-cell *matCellDef="let t">
                    <span class="chip chip-blue">Đang chờ báo cáo</span>
                  </td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="pendingColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: pendingColumns;" class="row-hover"></tr>
              </table>
              <div *ngIf="pendingTasks.length === 0" class="empty-state">
                <mat-icon>check_circle_outline</mat-icon>
                <p>Không có nhiệm vụ nào đang trong quá trình thực địa.</p>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- TAB 2: ĐÃ XÁC MINH -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon style="margin-right: 8px;">check_circle</mat-icon>
            Đã Xác Minh
            <span *ngIf="approvedTasks.length > 0" class="badge success">{{approvedTasks.length}}</span>
          </ng-template>
          <div style="padding-top: 20px;">
            <div class="table-wrap">
              <table mat-table [dataSource]="approvedTasks" style="width: 100%;">
                <ng-container matColumnDef="pet">
                  <th mat-header-cell *matHeaderCellDef>Thú cưng</th>
                  <td mat-cell *matCellDef="let t">
                    <div style="padding: 12px 0;">
                      <strong style="font-size: 15px; color: #34495e;">{{t.pet.name}}</strong><br>
                      <small style="color: #95a5a6;">Mã: {{t.pet.petCode}}</small>
                    </div>
                  </td>
                </ng-container>
                <ng-container matColumnDef="operator">
                  <th mat-header-cell *matHeaderCellDef>Nhân viên</th>
                  <td mat-cell *matCellDef="let t">{{t.operator.name}}</td>
                </ng-container>
                <ng-container matColumnDef="chipCode">
                  <th mat-header-cell *matHeaderCellDef>Mã chip đã quét</th>
                  <td mat-cell *matCellDef="let t">
                    <code style="background: #f0f9ff; padding: 2px 8px; border-radius: 4px; font-size: 13px;">
                      {{t.scannedChipCode || '—'}}
                    </code>
                  </td>
                </ng-container>
                <ng-container matColumnDef="completedAt">
                  <th mat-header-cell *matHeaderCellDef>Hoàn thành lúc</th>
                  <td mat-cell *matCellDef="let t">{{t.completedAt | date:'HH:mm dd/MM/yyyy'}}</td>
                </ng-container>
                <ng-container matColumnDef="result">
                  <th mat-header-cell *matHeaderCellDef>Kết quả</th>
                  <td mat-cell *matCellDef="let t">
                    <span class="chip chip-green">Đã xác minh</span>
                  </td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="resultColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: resultColumns;" class="row-hover"></tr>
              </table>
              <div *ngIf="approvedTasks.length === 0" class="empty-state">
                <mat-icon>inbox</mat-icon>
                <p>Chưa có nhiệm vụ nào được xác minh thành công.</p>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- TAB 3: BỊ TỪ CHỐI -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon style="margin-right: 8px;">cancel</mat-icon>
            Bị Từ Chối
            <span *ngIf="rejectedTasks.length > 0" class="badge danger">{{rejectedTasks.length}}</span>
          </ng-template>
          <div style="padding-top: 20px;">
            <div class="table-wrap">
              <table mat-table [dataSource]="rejectedTasks" style="width: 100%;">
                <ng-container matColumnDef="pet">
                  <th mat-header-cell *matHeaderCellDef>Thú cưng</th>
                  <td mat-cell *matCellDef="let t">
                    <div style="padding: 12px 0;">
                      <strong style="font-size: 15px; color: #34495e;">{{t.pet.name}}</strong><br>
                      <small style="color: #95a5a6;">Mã: {{t.pet.petCode}}</small>
                    </div>
                  </td>
                </ng-container>
                <ng-container matColumnDef="operator">
                  <th mat-header-cell *matHeaderCellDef>Nhân viên</th>
                  <td mat-cell *matCellDef="let t">{{t.operator.name}}</td>
                </ng-container>
                <ng-container matColumnDef="chipCode">
                  <th mat-header-cell *matHeaderCellDef>Mã chip đã nhập</th>
                  <td mat-cell *matCellDef="let t">
                    <code style="background: #fff5f5; padding: 2px 8px; border-radius: 4px; font-size: 13px; color: #c0392b;">
                      {{t.scannedChipCode || '—'}}
                    </code>
                  </td>
                </ng-container>
                <ng-container matColumnDef="completedAt">
                  <th mat-header-cell *matHeaderCellDef>Hoàn thành lúc</th>
                  <td mat-cell *matCellDef="let t">{{t.completedAt | date:'HH:mm dd/MM/yyyy'}}</td>
                </ng-container>
                <ng-container matColumnDef="result">
                  <th mat-header-cell *matHeaderCellDef>Kết quả</th>
                  <td mat-cell *matCellDef="let t">
                    <span class="chip chip-red">Không khớp / Huỷ</span>
                  </td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="resultColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: resultColumns;" class="row-hover"></tr>
              </table>
              <div *ngIf="rejectedTasks.length === 0" class="empty-state">
                <mat-icon>thumb_up_off_alt</mat-icon>
                <p>Không có nhiệm vụ nào bị từ chối.</p>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- TAB 4: GIAO VIỆC MỚI -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon style="margin-right: 8px;">assignment_ind</mat-icon>
            Chưa Giao Việc
            <span *ngIf="unassignedPets.length > 0" class="badge warn">{{unassignedPets.length}}</span>
          </ng-template>
          <div style="padding-top: 20px;">
            <div class="table-wrap">
              <table mat-table [dataSource]="unassignedPets" style="width: 100%;">
                <ng-container matColumnDef="pet">
                  <th mat-header-cell *matHeaderCellDef>Thú cưng mới</th>
                  <td mat-cell *matCellDef="let element">
                    <div style="padding: 12px 0;">
                      <strong style="font-size: 15px; color: #34495e;">{{element.name}}</strong><br>
                      <small style="color: #95a5a6;">Giống: {{element.breed}}</small>
                    </div>
                  </td>
                </ng-container>
                <ng-container matColumnDef="shop">
                  <th mat-header-cell *matHeaderCellDef>Shop</th>
                  <td mat-cell *matCellDef="let element">{{element.shopName}}</td>
                </ng-container>
                <ng-container matColumnDef="assign">
                  <th mat-header-cell *matHeaderCellDef>Chọn Operator</th>
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
                  <th mat-header-cell *matHeaderCellDef></th>
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
                <mat-icon>done_all</mat-icon>
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
      border-radius: 12px;
      padding: 2px 8px;
      font-size: 11px;
      margin-left: 8px;
      font-weight: 700;
      color: white;
      background: #3498db;
    }
    .badge.warn    { background: #e67e22; }
    .badge.info    { background: #1abc9c; }
    .badge.success { background: #27ae60; }
    .badge.danger  { background: #e74c3c; }
    .table-wrap {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    }
    .empty-state {
      text-align: center;
      padding: 60px;
      color: #bdc3c7;
    }
    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
    }
    .row-hover:hover { background-color: #fcfcfc; }
    .chip {
      padding: 3px 12px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      display: inline-block;
    }
    .chip-blue  { background: #e3f2fd; color: #1565c0; }
    .chip-green { background: #e8f5e9; color: #2e7d32; }
    .chip-red   { background: #fce4ec; color: #c62828; }
  `]
})
export class AdminVerificationComponent implements OnInit {
  private verificationService = inject(VerificationService);
  private petApi = inject(PetApiService);
  private adminService = inject(AdminService);
  private toast = inject(ToastService);

  pendingTasks: VerificationTask[] = [];
  approvedTasks: VerificationTask[] = [];
  rejectedTasks: VerificationTask[] = [];
  unassignedPets: any[] = [];
  operators: User[] = [];
  isLoading = false;

  pendingColumns   = ['pet', 'operator', 'assignedAt', 'status'];
  resultColumns    = ['pet', 'operator', 'chipCode', 'completedAt', 'result'];
  unverifiedColumns = ['pet', 'shop', 'assign', 'actions'];

  ngOnInit() {
    this.loadData();
  }

  onTabChange(event: any) {
    if (event.index === 0) this.loadPending();
    if (event.index === 1) this.loadApproved();
    if (event.index === 2) this.loadRejected();
    if (event.index === 3) this.loadUnassignedAndOperators();
  }

  loadData() {
    this.loadPending();
    this.loadApproved();
    this.loadRejected();
    this.loadUnassignedAndOperators();
  }

  loadPending() {
    this.isLoading = true;
    this.verificationService.getPendingTasks().subscribe({
      next: (data) => { this.pendingTasks = data || []; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  loadApproved() {
    this.isLoading = true;
    this.verificationService.getTasksByStatus('APPROVED').subscribe({
      next: (data) => { this.approvedTasks = data || []; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  loadRejected() {
    this.isLoading = true;
    this.verificationService.getTasksByStatus('REJECTED').subscribe({
      next: (data) => { this.rejectedTasks = data || []; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  loadUnassignedAndOperators() {
    this.isLoading = true;
    forkJoin({
      pets: this.petApi.listAllPets(),
      users: this.adminService.getUsers(0, 1000),
      pending: this.verificationService.getPendingTasks()
    }).subscribe({
      next: (res) => {
        const busyPetIds = new Set(res.pending.map(t => t.pet.id));
        this.unassignedPets = res.pets
          .filter((p: any) => !p.isVerified && !busyPetIds.has(p.id))
          .map((p: any) => ({ ...p, selectedOperatorId: null }));
        this.operators = (res.users.content || []).filter((u: User) =>
          u.role.toLowerCase().includes('operator')
        );
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  assignTask(pet: any) {
    if (!pet.selectedOperatorId) return;
    this.isLoading = true;
    this.verificationService.assignTask(pet.id, pet.selectedOperatorId).subscribe({
      next: () => {
        this.toast.success('Thành công! Đã giao nhiệm vụ cho nhân viên.');
        this.loadUnassignedAndOperators();
        this.loadPending();
        this.isLoading = false;
      },
      error: (err: any) => {
        const msg = err.error?.message || 'Không thể giao nhiệm vụ.';
        this.toast.error('Lỗi: ' + msg);
        this.isLoading = false;
      }
    });
  }
}
