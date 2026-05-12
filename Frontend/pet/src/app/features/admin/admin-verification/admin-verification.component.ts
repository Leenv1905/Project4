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
  templateUrl: './admin-verification.component.html',
  styleUrls: ['./admin-verification.component.scss']
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
