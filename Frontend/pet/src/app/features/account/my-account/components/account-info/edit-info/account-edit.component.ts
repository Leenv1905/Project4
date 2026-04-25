import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../../core/services/auth.service';
import { UserProfileService } from '../../../../../../core/services/user-profile.service';

@Component({
  standalone: true,
  selector: 'app-account-edit',
  imports: [CommonModule, FormsModule],
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
      alert('Vui long nhap day du cac truong bat buoc.');
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
        this.router.navigate(['/account'], { queryParams: { tab: 'info' } });
      },
      error: () => {
        this.isSaving.set(false);
        alert('Khong the cap nhat thong tin ca nhan.');
      }
    });
  }

  cancel() {
    this.router.navigate(['/account'], { queryParams: { tab: 'info' } });
  }
}
