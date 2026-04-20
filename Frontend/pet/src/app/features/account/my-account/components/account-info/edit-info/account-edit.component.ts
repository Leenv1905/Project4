import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthService} from '../../../../../../core/services/auth.service';


@Component({
  standalone: true,
  selector: 'app-account-edit',
  imports: [CommonModule, FormsModule],
  templateUrl: './account-edit.component.html',
  styleUrls: ['./account-edit.component.scss']
})
export class AccountEditComponent implements OnInit {

  auth = inject(AuthService);
  router = inject(Router);

  editForm = signal({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: ''
  });

  avatarPreview = signal('https://i.pravatar.cc/150?u=user123');

  ngOnInit() {
    const currentUser = this.auth.user();
    if (currentUser) {
      this.editForm.set({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: '0966 228 008',
        dateOfBirth: '1995-03-15',
        address: 'Hậu Dưỡng, Thiện Lộc, Hà Nội'
      });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.avatarPreview.set(e.target.result);
      reader.readAsDataURL(file);
    }
  }

  saveChanges() {
    if (!this.editForm().name || !this.editForm().phone || !this.editForm().address) {
      alert('Vui lòng nhập đầy đủ các trường bắt buộc!');
      return;
    }

    alert('✅ Thông tin đã được cập nhật thành công!');
    this.router.navigate(['/account'], { queryParams: { tab: 'info' } });
  }

  cancel() {
    this.router.navigate(['/account'], { queryParams: { tab: 'info' } });
  }
}
