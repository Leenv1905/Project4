import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { User, Role } from '../../../../core/models/user.model';

@Component({
  standalone: true,
  selector: 'app-admin-edit-user',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-edit-user.component.html',
  styleUrls: ['./admin-edit-user.component.scss']
})
export class AdminEditUserComponent implements OnInit {

  router = inject(Router);
  route = inject(ActivatedRoute);

  editUser: Partial<User> & { password?: string; confirmPassword?: string } = {
    name: '',
    email: '',
    role: 'user',
    age: undefined,
    phone: '',
    avatar: 'https://i.pravatar.cc/150?u=edituser',
    status: 'active'
  };

  roles: Role[] = ['user', 'shop', 'admin', 'operators'];

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadUserData(id);
    }
  }

  loadUserData(id: number) {
    // Fake data cho edit
    this.editUser = {
      id: id,
      name: 'James Johnson',
      email: 'james@petshop.com',
      role: 'admin',
      age: 30,
      phone: '123-456-7890',
      avatar: 'https://i.pravatar.cc/150?u=james',
      status: 'active'
    };
  }

  updateUser() {
    if (!this.editUser.name || !this.editUser.email) {
      alert('Vui lòng nhập đầy đủ Tên và Email');
      return;
    }

    if (this.editUser.password && this.editUser.password !== this.editUser.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }

    console.log('Updated User:', this.editUser);
    alert(`✅ Đã cập nhật thông tin người dùng: ${this.editUser.name}`);

    this.router.navigate(['/admin/users']);
  }

  cancel() {
    this.router.navigate(['/admin/users']);
  }
}
