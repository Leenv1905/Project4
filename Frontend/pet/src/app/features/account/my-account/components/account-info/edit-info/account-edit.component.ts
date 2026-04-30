import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../../core/services/auth.service';
import { UserProfileService } from '../../../../../../core/services/user-profile.service';
import { NotificationModalComponent } from '../../../../../../shared/notification-modal/notification-modal.component';

@Component({
  standalone: true,
  selector: 'app-account-edit',
  imports: [CommonModule, FormsModule, NotificationModalComponent],
  templateUrl: './account-edit.component.html',
  styleUrls: ['./account-edit.component.scss']
})
export class AccountEditComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly profileService = inject(UserProfileService);

  readonly editForm = signal({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: ''
  });

  readonly avatarPreview = signal('https://i.pravatar.cc/150?u=user123');
  readonly isSaving = signal(false);
  modal = signal<{ title: string; message: string; type: 'success' | 'error' | 'info' } | null>(null);
  private navigateAfterModal = false;

  ngOnInit() {
    this.profileService.getMyProfile().subscribe({
      next: (profile) => {
        this.editForm.set({
          name: profile.name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          dateOfBirth: '',
          address: profile.address || ''
        });

        if (profile.avatarUrl) {
          this.avatarPreview.set(profile.avatarUrl);
        }
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => this.avatarPreview.set(String(reader.result || ''));
    reader.readAsDataURL(file);
  }

  saveChanges() {
    const form = this.editForm();
    if (!form.name || !form.phone || !form.address) {
      this.modal.set({ title: 'Thiếu thông tin', message: 'Vui lòng nhập đầy đủ các trường bắt buộc.', type: 'error' });
      return;
    }

    this.isSaving.set(true);
    this.profileService.updateMyProfile({
      name: form.name,
      phone: form.phone,
      address: form.address,
      avatarUrl: this.avatarPreview()
    }).subscribe({
      next: (profile) => {
        this.isSaving.set(false);
        this.auth.updateLocalUser({
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          address: profile.address,
          avatar: profile.avatarUrl
        });
        this.navigateAfterModal = true;
        this.modal.set({ title: 'Thành công', message: 'Cập nhật thông tin cá nhân thành công.', type: 'success' });
      },
      error: () => {
        this.isSaving.set(false);
        this.modal.set({ title: 'Lỗi', message: 'Không thể cập nhật thông tin cá nhân.', type: 'error' });
      }
    });
  }

  onModalClosed() {
    this.modal.set(null);
    if (this.navigateAfterModal) {
      this.navigateAfterModal = false;
      this.router.navigate(['/account'], { queryParams: { tab: 'info' } });
    }
  }

  cancel() {
    this.router.navigate(['/account'], { queryParams: { tab: 'info' } });
  }
}
