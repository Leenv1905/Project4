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

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      PENDING: 'Chờ xác minh',
      SUBMITTED: 'Đã gửi',
      APPROVED: 'Đã duyệt',
      REJECTED: 'Từ chối',
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      PENDING: 'bg-red-100 text-red-600',
      SUBMITTED: 'bg-blue-100 text-blue-600',
      APPROVED: 'bg-green-100 text-green-600',
      REJECTED: 'bg-gray-100 text-gray-600',
    };
    return classes[status] || 'bg-gray-100 text-gray-600';
  }
}
