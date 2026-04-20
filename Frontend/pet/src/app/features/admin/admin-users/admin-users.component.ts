import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { User } from '../../../core/models/user.model';

@Component({
  standalone: true,
  selector: 'app-admin-users',
  imports: [CommonModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent {

  router = inject(Router);

  // Fake dữ liệu đầy đủ hơn
  users: User[] = [
    {
      id: 1,
      name: "James Johnson",
      email: "james@petshop.com",
      role: "admin",
      age: 30,
      phone: "123-456-7890",
      avatar: "https://i.pravatar.cc/150?u=james",
      status: "active"
    },
    {
      id: 2,
      name: "Maria Hernandez",
      email: "maria@gmail.com",
      role: "user",
      age: 45,
      phone: "555-312-8899",
      avatar: "https://i.pravatar.cc/150?u=maria",
      status: "active"
    },
    {
      id: 3,
      name: "Clara Mason",
      email: "clara@enterprise.com",
      role: "admin",
      age: 38,
      phone: "402-123-4567",
      avatar: "https://i.pravatar.cc/150?u=clara",
      status: "active"
    },
    {
      id: 4,
      name: "Derek White",
      email: "derek@forum.com",
      role: "operators",
      age: 29,
      phone: "212-321-6789",
      avatar: "https://i.pravatar.cc/150?u=derek",
      status: "active"
    },
    {
      id: 5,
      name: "Eva Carter",
      email: "eva@blogging.com",
      role: "user",
      age: 33,
      phone: "678-999-8212",
      avatar: "https://i.pravatar.cc/150?u=eva",
      status: "inactive"
    }
  ];

  // Phân trang
  page = 1;
  pageSize = 10;

  get total() { return this.users.length; }
  get totalPages() { return Math.ceil(this.total / this.pageSize); }

  get paginatedUsers() {
    const start = (this.page - 1) * this.pageSize;
    return this.users.slice(start, start + this.pageSize);
  }

  createUser() {
    this.router.navigate(['/admin/users/add']);
  }

  viewUser(id: number) {
    alert(`Xem chi tiết user #${id}`);
  }

  editUser(id: number) {
    this.router.navigate(['/admin/users/edit', id]);
  }

  deleteUser(id: number) {
    if (confirm(`Xóa user #${id}?`)) {
      this.users = this.users.filter(u => u.id !== id);
      alert('Đã xóa user!');
    }
  }

  nextPage() {
    if (this.page < this.totalPages) this.page++;
  }

  prevPage() {
    if (this.page > 1) this.page--;
  }

  changePageSize(size: number) {
    this.pageSize = size;
    this.page = 1;
  }

  protected readonly Math = Math;
}
