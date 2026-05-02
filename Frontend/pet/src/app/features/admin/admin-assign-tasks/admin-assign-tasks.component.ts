import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { VerificationService, VerificationTask, OrderVerification } from '../../../core/services/verification.service';
import { AdminService } from '../../../core/services/admin.service';
import { ToastService } from '../../../core/services/toast.service';
import { User } from '../../../core/models/user.model';

interface PetRow {
  petId: number;
  petName: string;
  breed: string;
  petCode: string;
  shopName: string;
  orderId: number;
  orderCode: string;
  totalPetsInOrder: number;
  selectedOperatorId: number | null;
  assigning: boolean;
}

interface OperatorLoad {
  operator: User;
  pendingCount: number;
}

@Component({
  standalone: true,
  selector: 'app-admin-assign-tasks',
  imports: [CommonModule, FormsModule],
  template: `
    <div style="padding: 24px; background: #f4f7f6; min-height: 100vh;">

      <!-- Header -->
      <div style="background: white; padding: 24px; border-radius: 12px; margin-bottom: 20px;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                  display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #1e3a5f;">
            Giao Việc Xác Minh Thực Địa
          </h1>
          <p style="margin: 6px 0 0; color: #6b7280; font-size: 14px;">
            Mỗi thú cưng trong đơn hàng phải được xác minh riêng. Đơn hàng chỉ hoàn thành khi tất cả thú cưng đều qua xác minh.
          </p>
        </div>
        <button (click)="loadAll()" [disabled]="loading"
          style="background: #f1f5f9; border: 1px solid #cbd5e1; padding: 10px 18px;
                 border-radius: 8px; cursor: pointer; font-weight: 600; color: #374151;">
          ↻ Làm mới
        </button>
      </div>

      <!-- Stats -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px;">
        <div class="stat-card">
          <div class="stat-num" style="color: #d97706;">{{ pets.length }}</div>
          <div class="stat-label">Thú cưng chờ giao việc</div>
        </div>
        <div class="stat-card">
          <div class="stat-num" style="color: #2563eb;">{{ operators.length }}</div>
          <div class="stat-label">Operator sẵn sàng</div>
        </div>
        <div class="stat-card">
          <div class="stat-num" style="color: #059669;">{{ pendingTasks.length }}</div>
          <div class="stat-label">Đang thực hiện</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 300px; gap: 20px; align-items: start;">

        <!-- Pet table -->
        <div style="background: white; border-radius: 12px;
                    box-shadow: 0 1px 6px rgba(0,0,0,0.07); overflow: hidden;">
          <div style="padding: 16px 20px; border-bottom: 1px solid #f1f5f9;
                      display: flex; align-items: center; gap: 10px;">
            <span style="font-weight: 700; font-size: 15px; color: #111827;">Thú cưng chờ giao việc</span>
            <span style="background: #fef3c7; color: #92400e; font-size: 12px; font-weight: 700;
                         padding: 2px 10px; border-radius: 999px;">{{ pets.length }}</span>
          </div>

          <div *ngIf="loading" style="padding: 48px; text-align: center; color: #9ca3af;">
            Đang tải dữ liệu...
          </div>

          <div *ngIf="!loading && pets.length === 0"
               style="padding: 60px; text-align: center; color: #9ca3af;">
            <div style="font-size: 40px; margin-bottom: 12px;">✓</div>
            <p>Tất cả thú cưng đã được phân công xác minh.</p>
          </div>

          <table *ngIf="!loading && pets.length > 0" style="width: 100%; border-collapse: collapse;">
            <thead style="background: #f8fafc;">
              <tr>
                <th class="th">Thú cưng</th>
                <th class="th">Đơn hàng</th>
                <th class="th">Tiến độ đơn</th>
                <th class="th">Chọn Operator</th>
                <th class="th"></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let pet of pets" style="border-top: 1px solid #f1f5f9;">
                <!-- Thú cưng -->
                <td class="td">
                  <div style="font-weight: 600; color: #111827;">{{ pet.petName }}</div>
                  <div style="font-size: 12px; color: #6b7280;">{{ pet.breed }}</div>
                  <div style="font-size: 11px; color: #9ca3af; margin-top: 2px;">
                    Mã: {{ pet.petCode || '—' }}
                  </div>
                </td>

                <!-- Đơn hàng -->
                <td class="td">
                  <div *ngIf="pet.orderCode" style="font-weight: 600; color: #1d4ed8; font-size: 13px;">
                    #{{ pet.orderCode }}
                  </div>
                  <div *ngIf="!pet.orderCode" style="color: #9ca3af; font-size: 13px;">—</div>
                  <div style="font-size: 11px; color: #6b7280; margin-top: 2px;">
                    Shop: {{ pet.shopName }}
                  </div>
                </td>

                <!-- Số pet trong đơn -->
                <td class="td">
                  <span style="font-size: 13px; font-weight: 600; color: #374151;">
                    {{ pet.totalPetsInOrder }} thú cưng
                  </span>
                </td>

                <!-- Operator selector -->
                <td class="td">
                  <select [(ngModel)]="pet.selectedOperatorId"
                    style="width: 100%; padding: 8px 10px; border: 1px solid #d1d5db;
                           border-radius: 8px; font-size: 14px; color: #374151;
                           background: white; cursor: pointer;">
                    <option [ngValue]="null" disabled>-- Chọn operator --</option>
                    <option *ngFor="let op of operatorsSorted" [ngValue]="op.operator.id">
                      {{ op.operator.name }} ({{ op.pendingCount }} việc)
                    </option>
                  </select>
                </td>

                <!-- Action -->
                <td class="td" style="text-align: right;">
                  <button (click)="assign(pet)"
                    [disabled]="!pet.selectedOperatorId || pet.assigning"
                    style="padding: 8px 16px; border-radius: 8px; border: none;
                           font-weight: 600; font-size: 13px; cursor: pointer;"
                    [style.background]="pet.selectedOperatorId ? '#1d4ed8' : '#e5e7eb'"
                    [style.color]="pet.selectedOperatorId ? 'white' : '#9ca3af'">
                    {{ pet.assigning ? '...' : 'Giao việc' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Operator workload panel -->
        <div style="background: white; border-radius: 12px;
                    box-shadow: 0 1px 6px rgba(0,0,0,0.07); overflow: hidden;">
          <div style="padding: 16px 20px; border-bottom: 1px solid #f1f5f9;">
            <span style="font-weight: 700; font-size: 15px; color: #111827;">Tải việc Operator</span>
          </div>
          <div style="padding: 8px 0;">
            <div *ngIf="operatorsSorted.length === 0"
                 style="padding: 24px; text-align: center; color: #9ca3af; font-size: 14px;">
              Chưa có operator.
            </div>
            <div *ngFor="let item of operatorsSorted"
                 (click)="openOperatorTasks(item)"
                 style="display: flex; align-items: center; padding: 12px 16px;
                        border-bottom: 1px solid #f9fafb; cursor: pointer; transition: background .15s;"
                 onmouseenter="this.style.background='#f8fafc'"
                 onmouseleave="this.style.background='white'">
              <div style="width: 34px; height: 34px; border-radius: 50%; background: #dbeafe;
                          display: flex; align-items: center; justify-content: center;
                          font-weight: 700; color: #1d4ed8; font-size: 13px; flex-shrink: 0;">
                {{ item.operator.name?.charAt(0)?.toUpperCase() }}
              </div>
              <div style="margin-left: 10px; flex: 1; min-width: 0;">
                <div style="font-weight: 600; color: #111827; font-size: 13px;
                            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  {{ item.operator.name }}
                </div>
                <div style="font-size: 12px; color: #6b7280;">{{ item.pendingCount }} việc đang chờ</div>
              </div>
              <span style="padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 700; flex-shrink: 0;"
                    [style.background]="item.pendingCount === 0 ? '#d1fae5' : item.pendingCount < 3 ? '#fef3c7' : '#fee2e2'"
                    [style.color]="item.pendingCount === 0 ? '#065f46' : item.pendingCount < 3 ? '#92400e' : '#991b1b'">
                {{ item.pendingCount === 0 ? 'Rảnh' : item.pendingCount < 3 ? 'OK' : 'Bận' }}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Modal việc của operator -->
    <div *ngIf="selectedOperator" (click)="closeOperatorTasks()"
         style="position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:1000;
                display:flex;align-items:center;justify-content:center;">
      <div (click)="$event.stopPropagation()"
           style="background:white;border-radius:16px;width:100%;max-width:600px;
                  max-height:80vh;display:flex;flex-direction:column;
                  box-shadow:0 20px 60px rgba(0,0,0,0.2);">

        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:center;
                    padding:20px 24px 16px;border-bottom:1px solid #f1f5f9;">
          <div>
            <div style="font-size:17px;font-weight:700;color:#111827;">
              {{ selectedOperator.operator.name }}
            </div>
            <div style="font-size:13px;color:#6b7280;margin-top:2px;">
              {{ selectedOperatorTasks.length }} việc (đang làm + đã nộp chờ duyệt)
            </div>
          </div>
          <button (click)="closeOperatorTasks()"
                  style="background:none;border:none;font-size:20px;cursor:pointer;
                         color:#9ca3af;padding:4px 8px;border-radius:6px;">✕</button>
        </div>

        <!-- Body -->
        <div style="overflow-y:auto;flex:1;padding:16px 24px;">
          <div *ngIf="selectedOperatorTasks.length === 0"
               style="text-align:center;padding:40px;color:#9ca3af;">
            <div style="font-size:36px;margin-bottom:8px;">✓</div>
            <p>Operator này chưa có việc nào.</p>
          </div>

          <div *ngFor="let task of selectedOperatorTasks"
               style="border:1px solid #f1f5f9;border-radius:10px;
                      padding:14px 16px;margin-bottom:10px;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;">
              <div>
                <div style="font-weight:600;color:#111827;font-size:14px;">
                  {{ task.pet?.name }}
                </div>
                <div style="font-size:12px;color:#6b7280;margin-top:3px;">
                  Mã chip: {{ task.pet?.petCode || '—' }} · {{ task.pet?.breed }}
                </div>
                <div style="font-size:12px;color:#6b7280;margin-top:2px;">
                  Shop: {{ task.pet?.ownerName }}
                </div>
              </div>
              <span style="font-size:11px;font-weight:700;padding:3px 10px;border-radius:999px;"
                    [style.background]="task.status === 'SUBMITTED' ? '#dbeafe' : '#fef3c7'"
                    [style.color]="task.status === 'SUBMITTED' ? '#1d4ed8' : '#92400e'">
                {{ task.status === 'SUBMITTED' ? 'Đã nộp' : 'Đang làm' }}
              </span>
            </div>
            <div style="margin-top:8px;font-size:12px;color:#9ca3af;">
              Giao lúc: {{ task.assignedAt | date:'dd/MM/yyyy HH:mm' }}
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="padding:14px 24px 18px;border-top:1px solid #f1f5f9;text-align:right;">
          <button (click)="closeOperatorTasks()"
                  style="background:#f1f5f9;color:#374151;border:1px solid #e2e8f0;
                         padding:9px 20px;border-radius:8px;font-weight:600;cursor:pointer;">
            Đóng
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stat-card {
      background: white; border-radius: 12px; padding: 20px 24px;
      box-shadow: 0 1px 6px rgba(0,0,0,0.07); text-align: center;
    }
    .stat-num { font-size: 36px; font-weight: 800; line-height: 1; }
    .stat-label { margin-top: 6px; font-size: 13px; color: #6b7280; font-weight: 500; }
    .th {
      padding: 11px 14px; text-align: left;
      font-size: 11px; color: #6b7280; text-transform: uppercase;
      letter-spacing: .05em; font-weight: 600;
    }
    .td { padding: 14px 14px; vertical-align: middle; }
  `]
})
export class AdminAssignTasksComponent implements OnInit {
  private verificationService = inject(VerificationService);
  private adminService = inject(AdminService);
  private toast = inject(ToastService);

  pets: PetRow[] = [];
  operators: User[] = [];
  pendingTasks: VerificationTask[] = [];
  allActiveTasks: VerificationTask[] = [];
  operatorsSorted: OperatorLoad[] = [];
  loading = false;
  selectedOperator: OperatorLoad | null = null;
  selectedOperatorTasks: VerificationTask[] = [];

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.loading = true;
    forkJoin({
      unassigned: this.verificationService.getUnassignedPets(),
      users: this.adminService.getUsers(0, 1000),
      pending: this.verificationService.getPendingTasks(),
      submitted: this.verificationService.getSubmittedTasks()
    }).subscribe({
      next: (res) => {
        // Gộp PENDING + SUBMITTED để hiển thị tải việc chính xác
        this.allActiveTasks = [
          ...(res.pending || []),
          ...(res.submitted || [])
        ];
        this.pendingTasks = res.pending || [];

        this.operators = (res.users.content || []).filter((u: User) =>
          u.role?.toLowerCase().includes('operator') && u.enabled !== false
        );

        // Đếm task cho mỗi operator
        const countMap = new Map<number, number>();
        for (const task of this.allActiveTasks) {
          const opId = task.operator?.id;
          if (opId) countMap.set(opId, (countMap.get(opId) || 0) + 1);
        }

        // Gộp thêm operator từ danh sách task (phòng trường hợp role filter bỏ sót)
        const operatorMap = new Map<number, User>();
        for (const op of this.operators) operatorMap.set(op.id, op);
        for (const task of this.allActiveTasks) {
          if (task.operator?.id && !operatorMap.has(task.operator.id)) {
            operatorMap.set(task.operator.id, {
              id: task.operator.id,
              name: task.operator.name,
              email: task.operator.email,
              role: 'operator'
            });
          }
        }

        // Operator bận hiện trước
        this.operatorsSorted = Array.from(operatorMap.values())
          .map(op => ({ operator: op, pendingCount: countMap.get(op.id) || 0 }))
          .sort((a, b) => b.pendingCount - a.pendingCount);

        const defaultOperatorId = this.operatorsSorted.find(o => o.pendingCount === 0)?.operator.id
          ?? this.operatorsSorted[0]?.operator.id ?? null;
        const busyPetIds = new Set(this.pendingTasks.map(t => t.pet?.id).filter(Boolean));

        this.pets = (res.unassigned as OrderVerification[]).flatMap(order =>
          order.petsToVerify
            .filter(pet => !busyPetIds.has(pet.petId))
            .map(pet => ({
              petId: pet.petId,
              petName: pet.petName,
              breed: pet.breed,
              petCode: pet.petCode,
              shopName: pet.shopName,
              orderId: order.orderId,
              orderCode: order.orderCode,
              totalPetsInOrder: order.totalPetsInOrder,
              selectedOperatorId: defaultOperatorId,
              assigning: false
            }))
        );

        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  openOperatorTasks(item: OperatorLoad) {
    this.selectedOperator = item;
    this.selectedOperatorTasks = this.allActiveTasks.filter(
      t => t.operator?.id === item.operator.id
    );
  }

  closeOperatorTasks() {
    this.selectedOperator = null;
    this.selectedOperatorTasks = [];
  }

  assign(pet: PetRow) {
    if (!pet.selectedOperatorId) return;
    pet.assigning = true;
    this.verificationService.assignTask(pet.petId, pet.selectedOperatorId).subscribe({
      next: () => {
        this.toast.success(`Đã giao xác minh "${pet.petName}" cho operator.`);
        this.loadAll();
      },
      error: (err: any) => {
        pet.assigning = false;
        this.toast.error(err.error?.message || 'Không thể giao việc.');
      }
    });
  }
}