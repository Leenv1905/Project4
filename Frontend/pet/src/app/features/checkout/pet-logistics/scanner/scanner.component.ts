import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { VerificationService, VerificationTask } from '../../../../core/services/verification.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-scanner',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './scanner.component.html'
})
export class ScannerComponent implements OnInit {
  private router = inject(Router);
  private verificationService = inject(VerificationService);
  private toast = inject(ToastService);

  task: VerificationTask | null = null;
  chipUrl = '';
  isSubmitting = false;

  ngOnInit() {
    const state = history.state as { task?: VerificationTask };
    if (state?.task?.id) {
      this.task = state.task;
      this.chipUrl = state.task.scannedChipImageUrl || '';
    }
  }


  confirm() {
    if (!this.task || !this.chipUrl.trim()) {
      this.toast.error('Vui lòng nhập URL ảnh/video chip hợp lệ.');
      return;
    }
    this.task.scannedChipImageUrl = this.chipUrl;
    this.router.navigate(['/operator/tasks/verify/detail', this.task.id], { state: { task: this.task } });
  }
}
