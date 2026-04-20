import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {Role, User} from '../../../../core/models/user.model';


@Component({
  standalone: true,
  selector: 'app-admin-create-user',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-create-user.component.html',
  styleUrls: ['./admin-create-user.component.scss']
})
export class AdminCreateUserComponent {

  router = inject(Router);

  // Form tạo user mới
  newUser: Partial<User> & { password?: string; confirmPassword?: string } = {
    name: '',
    email: '',
    role: 'user',
    age: undefined,
    phone: '',
    avatar: 'https://i.pravatar.cc/150?u=newuser',
    status: 'active'
  };

  roles: Role[] = ['user', 'shop', 'admin', 'operators'];

  createUser() {
    if (!this.newUser.name || !this.newUser.email || !this.newUser.password) {
      alert('Vui lòng nhập đầy đủ Tên, Email và Mật khẩu');
      return;
    }

    if (this.newUser.password !== this.newUser.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }

    // Tạo user mới (giả lập)
    const createdUser: User = {
      id: Date.now(),
      name: this.newUser.name,
      email: this.newUser.email,
      role: this.newUser.role || 'user',
      age: this.newUser.age,
      phone: this.newUser.phone,
      avatar: this.newUser.avatar,
      status: this.newUser.status || 'active',
      createdAt: new Date()
    };

    console.log('User created:', createdUser);
    alert(`✅ Đã tạo người dùng mới: ${createdUser.name} (${createdUser.role})`);

    // Quay lại danh sách user
    this.router.navigate(['/admin/users']);
  }

  cancel() {
    this.router.navigate(['/admin/users']);
  }
}
