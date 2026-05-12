import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { VerificationService, VerificationTask } from '../../../../core/services/verification.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatIcon],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private verificationService = inject(VerificationService);
  private router = inject(Router);

  keyword = '';
  tasks: VerificationTask[] = [];
  isLoading = false;

  // Delivery modal state
  deliveryModalTask: VerificationTask | null = null;
  deliveryPhoto: File | null = null;
  deliveryPhotoPreview: string | null = null;
  isSubmittingDelivery = false;
  deliveryError = '';

  get filteredTasks() {
    const kw = this.keyword.trim().toLowerCase();
    if (!kw) return this.tasks;
    return this.tasks.filter(
      (t) =>
        t.pet?.name?.toLowerCase().includes(kw) ||
        t.pet?.petCode?.toLowerCase().includes(kw) ||
        t.pet?.breed?.toLowerCase().includes(kw),
    );
  }

  get pendingCount() {
    return this.tasks.filter((t) => t.status === 'PENDING').length;
  }
  get submittedCount() {
    return this.tasks.filter((t) => t.status === 'SUBMITTED').length;
  }

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.isLoading = true;
    this.verificationService.getMyTasks().subscribe({
      next: (data) => {
        this.tasks = data || [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  goToDetail(task: VerificationTask) {
    this.router.navigate(['/operator/tasks/verify/detail', task.id], { state: { task } });
  }

  openDeliveryModal(task: VerificationTask) {
    this.deliveryModalTask = task;
    this.deliveryPhoto = null;
    this.deliveryPhotoPreview = null;
    this.deliveryError = '';
  }

  closeDeliveryModal() {
    this.deliveryModalTask = null;
    this.deliveryPhoto = null;
    this.deliveryPhotoPreview = null;
    this.deliveryError = '';
  }

  onPhotoSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.deliveryPhoto = file;
    const reader = new FileReader();
    reader.onload = (e) => this.deliveryPhotoPreview = e.target?.result as string;
    reader.readAsDataURL(file);
  }

  submitDelivery() {
    if (!this.deliveryModalTask || !this.deliveryPhoto) return;
    this.isSubmittingDelivery = true;
    this.deliveryError = '';
    this.verificationService.completeDelivery(this.deliveryModalTask.id, this.deliveryPhoto).subscribe({
      next: () => {
        this.isSubmittingDelivery = false;
        this.closeDeliveryModal();
        this.loadTasks();
      },
      error: () => {
        this.isSubmittingDelivery = false;
        this.deliveryError = 'Đã có lỗi xảy ra, vui lòng thử lại.';
      }
    });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      PENDING: 'Chờ xác minh',
      SUBMITTED: 'Đã gửi',
      APPROVED: 'Đã xác minh',
      REJECTED: 'Từ chối',
      DELIVERED: 'Đã giao'
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      SUBMITTED: 'bg-blue-100 text-blue-600',
      APPROVED: 'bg-green-100 text-green-600',
      REJECTED: 'bg-red-100 text-red-500',
      DELIVERED: 'bg-purple-100 text-purple-600'
    };
    return classes[status] || 'bg-gray-100 text-gray-600';
  }
}
