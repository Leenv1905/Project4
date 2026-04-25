import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Role } from '../../../../core/models/user.model';
import { AdminService } from '../../../../core/services/admin.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  standalone: true,
  selector: 'app-admin-create-user',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-create-user.component.html',
  styleUrls: ['./admin-create-user.component.scss']
})
export class AdminCreateUserComponent {
  private readonly router = inject(Router);
  private readonly adminService = inject(AdminService);
  private readonly toast = inject(ToastService);

  newUser: {
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
    avatar: 'https://i.pravatar.cc/150?u=newuser'
  };

  roles: Role[] = ['user', 'shop', 'admin', 'operators'];
  isSaving = false;

  createUser() {
    if (!this.newUser.name || !this.newUser.email || !this.newUser.password) {
      this.toast.error('Vui long nhap day du Ten, Email va Mat khau.');
      return;
    }

    if (this.newUser.password !== this.newUser.confirmPassword) {
      this.toast.error('Mat khau xac nhan khong khop.');
      return;
    }

    this.isSaving = true;
    this.adminService.createUser({
      name: this.newUser.name,
      email: this.newUser.email,
      role: this.newUser.role,
      phone: this.newUser.phone,
      address: this.newUser.address,
      avatarUrl: this.newUser.avatar,
      password: this.newUser.password
    }).subscribe({
      next: () => {
        this.isSaving = false;
        this.toast.success('Da tao nguoi dung thanh cong!');
        this.router.navigate(['/admin/users']);
      },
      error: (err) => {
        console.error('Create user failed', err);
        this.isSaving = false;
        this.toast.error('Khong the tao nguoi dung moi.');
      }
    });
  }

  cancel() {
    this.router.navigate(['/admin/users']);
  }
}
