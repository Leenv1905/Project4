import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from '../../../../core/models/user.model';
import { AdminService } from '../../../../core/services/admin.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  standalone: true,
  selector: 'app-admin-edit-user',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-edit-user.component.html',
  styleUrls: ['./admin-edit-user.component.scss']
})
export class AdminEditUserComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly adminService = inject(AdminService);
  private readonly toast = inject(ToastService);

  editUser: {
    id?: number;
    name: string;
    email: string;
    role: Role;
    phone: string;
    address: string;
    avatar: string;
    password?: string;
    confirmPassword?: string;
  } = {
    name: '',
    email: '',
    role: 'user',
    phone: '',
    address: '',
    avatar: 'https://i.pravatar.cc/150?u=edituser'
  };

  roles: Role[] = ['user', 'shop', 'admin', 'operators'];
  isSaving = false;
  viewOnly = false;

  ngOnInit() {
    this.viewOnly = !!this.route.snapshot.data['viewOnly'];
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      return;
    }

    this.adminService.getUserById(id).subscribe({
      next: (user) => {
        this.editUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone || '',
          address: user.address || '',
          avatar: user.avatar || `https://i.pravatar.cc/150?u=${user.email}`
        };
      },
      error: (err) => {
        console.error('Load user failed', err);
        this.toast.error('Không tải được thông tin người dùng.');
      }
    });
  }

  updateUser() {
    if (!this.editUser.id || !this.editUser.name || !this.editUser.email) {
      this.toast.error('Vui lòng nhập đầy đủ Tên và Email.');
      return;
    }

    if (this.editUser.password && this.editUser.password !== this.editUser.confirmPassword) {
      this.toast.error('Mật khẩu xác nhận không khớp.');
      return;
    }

    this.isSaving = true;
    this.adminService.updateUser(this.editUser.id, {
      name: this.editUser.name,
      email: this.editUser.email,
      role: this.editUser.role,
      phone: this.editUser.phone,
      address: this.editUser.address,
      avatarUrl: this.editUser.avatar,
      password: this.editUser.password || undefined
    }).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/admin/users']);
      },
      error: (err) => {
        console.error('Update user failed', err);
        this.isSaving = false;
        alert('Khong the cap nhat nguoi dung.');
      }
    });
  }

  cancel() {
    this.router.navigate(['/admin/users']);
  }
}
