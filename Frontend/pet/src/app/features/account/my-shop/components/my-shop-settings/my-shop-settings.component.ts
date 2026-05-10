import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-my-shop-settings',
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './my-shop-settings.component.html',
  styleUrls: ['./my-shop-settings.component.scss'],
})
export class MyShopSettingsComponent {
  // Thông tin tài khoản ngân hàng
  bankInfo = signal({
    bankName: 'Vietcombank',
    accountNumber: '1234567890',
    accountHolder: 'Nguyễn Văn Shop',
    branch: 'Chi nhánh Hà Nội',
  });

  // Các cài đặt toggle
  settings = signal({
    holidayMode: false,
    expressDelivery: true,
    superCheck: false,
    preOrder: true,
  });

  toggleSetting(key: 'holidayMode' | 'expressDelivery' | 'superCheck' | 'preOrder') {
    this.settings.update((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  saveBankInfo() {
    alert('✅ Bank information has been updated!');
  }

  saveAllSettings() {
    alert('✅ All settings have been saved successfully!');
  }
}
