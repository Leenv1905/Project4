import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { ToastService } from '../../../core/services/toast.service';
import { User } from '../../../core/models/user.model';

@Component({
  standalone: true,
  selector: 'app-admin-users',
  imports: [CommonModule, MatSlideToggleModule, FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit, OnDestroy {
  private readonly adminService = inject(AdminService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  users: User[] = [];
  total = 0;
  page = 1;
  pageSize = 10;
  loading = false;
  private navSub!: Subscription;

  ngOnInit(): void {
    this.loadUsers();
    this.navSub = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd && e.urlAfterRedirects === '/admin/users')
    ).subscribe(() => this.loadUsers());
  }

  ngOnDestroy(): void {
    this.navSub?.unsubscribe();
  }

  loadUsers() {
    this.loading = true;
    this.adminService.getUsers(this.page - 1, this.pageSize).subscribe({
      next: (res: any) => {
        this.users = (res.content ?? []).map((u: User) => ({
          id: u.id,
          email: u.email,
          name: u.name,
          role: u.role,
          phone: u.phone,
          address: u.address,
          avatar: u.avatarUrl,
          enabled: u.enabled ?? false
        }));
        this.total = res.totalElements ?? 0;
        this.loading = false;
        console.log('CONTENT RAW:', res.content);
        console.log('KEYS:', Object.keys(res));
        console.log("user",this.users)
      },

      error: (err) => {
        console.error('Error loading users:', err);
        this.loading = false;
      }
    });
  }

  get totalPages() {
    return Math.max(1, Math.ceil(this.total / this.pageSize));
  }

  toggleUserStatus(user: User) {
    user.enabled = !user.enabled;
    this.adminService.updateUserStatus(user.id, user.enabled).subscribe({
      next: () => {},
      error: () => {
        user.enabled = !user.enabled;
        this.toast.error('Không thể cập nhật trạng thái người dùng.');
      }
    });
  }

  createUser() {
    this.router.navigate(['/admin/users/add']);
  }

  viewUser(id: number) {
    this.router.navigate(['/admin/users/view', id]);
  }

  editUser(id: number) {
    this.router.navigate(['/admin/users/edit', id]);
  }

  deleteUser(id: number) {
    if (!confirm(`Ban co chac muon xoa user #${id}?`)) {
      return;
    }

    this.adminService.deleteUser(id).subscribe({
      next: () => this.loadUsers(),
      error: () => {
        this.toast.error('Không thể xóa người dùng.');
      }
    });
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadUsers();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadUsers();
    }
  }

  changePageSize(size: string) {
    this.pageSize = parseInt(size, 10);
    this.page = 1;
    this.loadUsers();
  }

  protected readonly Math = Math;
}
