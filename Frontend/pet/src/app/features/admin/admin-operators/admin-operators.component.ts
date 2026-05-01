import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { ToastService } from '../../../core/services/toast.service';
import { User } from '../../../core/models/user.model';

@Component({
  standalone: true,
  selector: 'app-admin-operators',
  imports: [CommonModule],
  template: `
    <div style="padding: 24px;">

      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
        <div>
          <h2 style="margin:0; font-size:22px; font-weight:700; color:#1e3a5f;">Danh sách Operator</h2>
          <p style="margin:4px 0 0; color:#6b7280; font-size:14px;">Nhân viên thực địa xác minh thú cưng</p>
        </div>
        <button (click)="addOperator()"
          style="background:#1d4ed8; color:white; border:none; padding:10px 20px; border-radius:8px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:6px;">
          + Thêm Operator
        </button>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" style="text-align:center; padding:40px; color:#9ca3af;">
        Đang tải...
      </div>

      <!-- Table -->
      <div *ngIf="!loading" style="background:white; border-radius:12px; box-shadow:0 1px 6px rgba(0,0,0,.08); overflow:hidden;">
        <table style="width:100%; border-collapse:collapse;">
          <thead style="background:#f8fafc;">
            <tr>
              <th style="padding:14px 20px; text-align:left; font-size:12px; color:#6b7280; text-transform:uppercase; letter-spacing:.05em;">Nhân viên</th>
              <th style="padding:14px 20px; text-align:left; font-size:12px; color:#6b7280; text-transform:uppercase; letter-spacing:.05em;">Email</th>
              <th style="padding:14px 20px; text-align:left; font-size:12px; color:#6b7280; text-transform:uppercase; letter-spacing:.05em;">Số điện thoại</th>
              <th style="padding:14px 20px; text-align:left; font-size:12px; color:#6b7280; text-transform:uppercase; letter-spacing:.05em;">Trạng thái</th>
              <th style="padding:14px 20px;"></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let op of operators; let i = index"
              style="border-top:1px solid #f1f5f9;"
              [style.background]="i % 2 === 0 ? 'white' : '#fafafa'">
              <td style="padding:14px 20px;">
                <div style="display:flex; align-items:center; gap:12px;">
                  <div style="width:38px; height:38px; border-radius:50%; background:#dbeafe; display:flex; align-items:center; justify-content:center; font-weight:700; color:#1d4ed8; font-size:15px;">
                    {{ op.name?.charAt(0)?.toUpperCase() || '?' }}
                  </div>
                  <span style="font-weight:600; color:#111827;">{{ op.name }}</span>
                </div>
              </td>
              <td style="padding:14px 20px; color:#374151; font-size:14px;">{{ op.email }}</td>
              <td style="padding:14px 20px; color:#374151; font-size:14px;">{{ op.phone || '—' }}</td>
              <td style="padding:14px 20px;">
                <span style="padding:4px 12px; border-radius:999px; font-size:12px; font-weight:600;"
                  [style.background]="op.enabled ? '#dcfce7' : '#fee2e2'"
                  [style.color]="op.enabled ? '#16a34a' : '#dc2626'">
                  {{ op.enabled ? 'Hoạt động' : 'Vô hiệu' }}
                </span>
              </td>
              <td style="padding:14px 20px; text-align:right;">
                <button (click)="editOperator(op.id)"
                  style="background:none; border:1px solid #d1d5db; padding:6px 14px; border-radius:6px; cursor:pointer; font-size:13px; color:#374151; margin-right:8px;">
                  Sửa
                </button>
                <button (click)="toggleStatus(op)"
                  style="background:none; border:1px solid; padding:6px 14px; border-radius:6px; cursor:pointer; font-size:13px;"
                  [style.borderColor]="op.enabled ? '#fca5a5' : '#6ee7b7'"
                  [style.color]="op.enabled ? '#dc2626' : '#059669'">
                  {{ op.enabled ? 'Vô hiệu hoá' : 'Kích hoạt' }}
                </button>
              </td>
            </tr>
            <tr *ngIf="operators.length === 0">
              <td colspan="5" style="padding:48px; text-align:center; color:#9ca3af;">
                Chưa có operator nào. Nhấn "Thêm Operator" để tạo mới.
              </td>
            </tr>
          </tbody>
        </table>
        <div style="padding:12px 20px; font-size:13px; color:#6b7280; border-top:1px solid #f1f5f9;">
          Tổng cộng: {{ operators.length }} operator
        </div>
      </div>
    </div>
  `
})
export class AdminOperatorsComponent implements OnInit {
  private adminService = inject(AdminService);
  private router = inject(Router);
  private toast = inject(ToastService);

  operators: User[] = [];
  loading = false;

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.adminService.getUsers(0, 1000).subscribe({
      next: (res: any) => {
        this.operators = (res.content || []).filter((u: User) =>
          (u.role || '').toLowerCase().includes('operator')
        );
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  addOperator() {
    this.router.navigate(['/admin/users/add']);
  }

  editOperator(id: number) {
    this.router.navigate(['/admin/users/edit', id]);
  }

  toggleStatus(op: User) {
    const next = !op.enabled;
    this.adminService.updateUserStatus(op.id, next).subscribe({
      next: () => {
        op.enabled = next;
        this.toast.success(next ? 'Đã kích hoạt tài khoản.' : 'Đã vô hiệu hoá tài khoản.');
      },
      error: () => this.toast.error('Không thể thay đổi trạng thái.')
    });
  }
}