import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-my-shop-settings',
  imports: [CommonModule],
  templateUrl: './my-shop-settings.component.html',
  styleUrls: ['./my-shop-settings.component.scss']
})
export class MyShopSettingsComponent {

  // Thông tin tài khoản ngân hàng
  bankInfo = signal({
    bankName: 'Vietcombank',
    accountNumber: '1234567890',
    accountHolder: 'Nguyễn Văn Shop',
    branch: 'Chi nhánh Hà Nội'
  });

  // Các cài đặt toggle
  settings = signal({
    holidayMode: false,           // Chế độ nghỉ lễ
    expressDelivery: true,        // Giao hàng hỏa tốc
    superCheck: false,            // Chế độ siêu check (kiểm tra pet nghiêm ngặt)
    preOrder: true                // Đặt hàng trước - giao sau 15 ngày
  });

  toggleSetting(key: 'holidayMode' | 'expressDelivery' | 'superCheck' | 'preOrder') {
    this.settings.update(current => ({
      ...current,
      [key]: !current[key]
    }));
  }

  saveBankInfo() {
    alert('✅ Thông tin tài khoản ngân hàng đã được cập nhật!');
  }

  saveAllSettings() {
    alert('✅ Cài đặt đã được lưu thành công!');
  }
}
