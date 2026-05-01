import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { VerificationService, VerificationTask } from '../../../../core/services/verification.service';
import { ToastService } from '../../../../core/services/toast.service';
import { NotificationModalComponent } from '../../../../shared/notification-modal/notification-modal.component';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NotificationModalComponent],
  templateUrl: './detail.component.html'
})
export class DetailComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private verificationService = inject(VerificationService);
  private toast = inject(ToastService);

  task: VerificationTask | null = null;
  isLoading = false;
  isSubmitting = false;
  isCancellingOrder = false;

  // Step flow (1=Profile, 2=Quét Chip, 3=Gửi báo cáo)
  currentStep: 1 | 2 | 3 = 1;

  // Kết quả sau khi submit
  verificationResult: 'APPROVED' | 'REJECTED' | null = null;

  // Modal state
  showCancelModal = false;

  // Step 2 inputs
  chipCode = '';
  chipFile: File | null = null;
  chipPreviewUrl: string | null = null;
  isUploadingChip = false;
  healthNote = '';

  ngOnInit() {
    const state = history.state as { task?: VerificationTask };
    if (state?.task?.id) {
      this.task = state.task;
    } else {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      this.isLoading = true;
      this.verificationService.getMyTasks().subscribe({
        next: (tasks) => {
          this.task = tasks.find(t => t.id === id) || null;
          this.isLoading = false;
          if (!this.task) this.toast.error('Không tìm thấy nhiệm vụ này.');
        },
        error: () => { this.isLoading = false; }
      });
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    this.chipFile = input.files[0];
    if (this.chipPreviewUrl) URL.revokeObjectURL(this.chipPreviewUrl);
    this.chipPreviewUrl = URL.createObjectURL(this.chipFile);
  }

  getGPS() {
    if (!this.task) return;
    if (!navigator.geolocation) {
      this.toast.error('Trình duyệt không hỗ trợ GPS.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => { this.task!.locationGps = `${pos.coords.latitude}, ${pos.coords.longitude}`; },
      () => this.toast.error('Vui lòng cho phép quyền truy cập GPS.')
    );
  }

  canProceedToStep3(): boolean {
    return !!this.chipFile && !!this.chipCode.trim() && !!this.task?.locationGps;
  }

  goToStep2() { this.currentStep = 2; }

  goToStep3() {
    if (!this.task || !this.chipFile) return;
    this.isUploadingChip = true;
    this.verificationService.uploadChipFile(this.task.id, this.chipFile).subscribe({
      next: (url) => {
        this.isUploadingChip = false;
        this.task!.scannedChipCode = this.chipCode.trim();
        this.task!.scannedChipImageUrl = url;
        this.task!.healthNote = this.healthNote;
        this.currentStep = 3;
      },
      error: () => {
        this.isUploadingChip = false;
        this.toast.error('Lỗi khi tải ảnh chip lên. Vui lòng thử lại.');
      }
    });
  }

  submit() {
    if (!this.task) return;
    this.isSubmitting = true;
    this.verificationService.submitVerification(this.task.id, {
      chipCode: this.task.scannedChipCode,
      chipUrl: this.task.scannedChipImageUrl,
      gps: this.task.locationGps,
      note: this.task.healthNote
    }).subscribe({
      next: (result) => {
        this.isSubmitting = false;
        this.verificationResult = result as 'APPROVED' | 'REJECTED';
        if (result === 'APPROVED') {
          this.toast.success('Xác minh thành công! Đơn hàng đã được xác nhận.');
        } else {
          this.toast.error('Mã chip không khớp. Đơn hàng đã bị huỷ.');
        }
      },
      error: () => {
        this.toast.error('Lỗi khi gửi báo cáo. Vui lòng thử lại.');
        this.isSubmitting = false;
      }
    });
  }

  cancelOrder() {
    this.showCancelModal = true;
  }

  confirmCancel() {
    if (!this.task) return;
    this.showCancelModal = false;
    this.isCancellingOrder = true;
    this.verificationService.cancelOrderByTask(this.task.id).subscribe({
      next: () => {
        this.isCancellingOrder = false;
        this.toast.success('Đơn hàng đã được huỷ.');
        this.router.navigate(['/operator/tasks/verify']);
      },
      error: () => {
        this.isCancellingOrder = false;
        this.toast.error('Lỗi khi huỷ đơn hàng.');
      }
    });
  }

  backToList() {
    this.router.navigate(['/operator/tasks/verify']);
  }

  isImageFile(): boolean {
    return !!this.chipFile && this.chipFile.type.startsWith('image/');
  }

  isVideoFile(): boolean {
    return !!this.chipFile && this.chipFile.type.startsWith('video/');
  }
}