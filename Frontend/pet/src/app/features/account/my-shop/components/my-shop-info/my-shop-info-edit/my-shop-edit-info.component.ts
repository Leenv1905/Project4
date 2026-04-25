import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../../core/services/auth.service';
import { UserProfileService } from '../../../../../../core/services/user-profile.service';

@Component({
  standalone: true,
  selector: 'app-my-shop-edit-info',
  imports: [CommonModule, FormsModule],
  templateUrl: './my-shop-edit-info.component.html',
  styleUrls: ['./my-shop-edit-info.component.scss']
})
export class MyShopEditInfoComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly profileService = inject(UserProfileService);

  readonly editForm = signal({
    shopName: '',
    phone: '',
    address: '',
    description: ''
  });

  readonly shopAvatar = signal('https://i.pravatar.cc/300?u=shop123');
  readonly isSaving = signal(false);

  ngOnInit() {
    this.profileService.getMyProfile().subscribe({
      next: (profile) => {
        this.editForm.set({
          shopName: profile.name || '',
          phone: profile.phone || '',
          address: profile.address || '',
          description: profile.address || ''
        });

        if (profile.avatarUrl) {
          this.shopAvatar.set(profile.avatarUrl);
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
    reader.onload = () => this.shopAvatar.set(String(reader.result || ''));
    reader.readAsDataURL(file);
  }

  saveChanges() {
    const form = this.editForm();
    if (!form.shopName || !form.phone || !form.address) {
      alert('Vui long nhap day du thong tin bat buoc.');
      return;
    }

    this.isSaving.set(true);
    this.profileService.updateMyProfile({
      name: form.shopName,
      phone: form.phone,
      address: form.address,
      avatarUrl: this.shopAvatar()
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
        this.router.navigate(['/my-shop'], { queryParams: { tab: 'info' } });
      },
      error: () => {
        this.isSaving.set(false);
        alert('Khong the cap nhat thong tin cua hang.');
      }
    });
  }

  cancel() {
    this.router.navigate(['/my-shop'], { queryParams: { tab: 'info' } });
  }
}
