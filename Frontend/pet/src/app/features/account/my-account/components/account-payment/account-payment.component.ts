import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface PaymentMethod {
  id: number;
  type: string;
  name: string;
  number: string;
  expiry: string;
  icon: string;
  isDefault: boolean;
}

@Component({
  standalone: true,
  selector: 'app-account-payment',
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './account-payment.component.html',
  styleUrls: ['./account-payment.component.scss'],
})
export class AccountPaymentComponent {
  paymentMethods = signal<PaymentMethod[]>([
    {
      id: 1,
      type: 'visa',
      name: 'Visa',
      number: '•••• •••• •••• 4242',
      expiry: '12/28',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png',
      isDefault: true,
    },
    {
      id: 2,
      type: 'mastercard',
      name: 'Mastercard',
      number: '•••• •••• •••• 8888',
      expiry: '09/27',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mastercard_2019_logo.svg/2560px-Mastercard_2019_logo.svg.png',
      isDefault: false,
    },
    {
      id: 3,
      type: 'momo',
      name: 'MoMo Wallet',
      number: '0987 654 321',
      expiry: '',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/MoMo_Logo.svg/2560px-MoMo_Logo.svg.png',
      isDefault: false,
    },
  ]);

  addNewMethod() {
    alert('Feature coming soon: Add new payment method');
    // Bạn có thể mở modal thêm phương thức ở đây
  }

  removeMethod(id: number) {
    if (confirm('Are you sure you want to remove this payment method?')) {
      this.paymentMethods.update((methods) => methods.filter((m) => m.id !== id));
    }
  }
}
