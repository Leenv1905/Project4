import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

interface Transaction {
  id: number;
  type: 'deposit' | 'withdrawal' | 'order';
  description: string;
  amount: number;
  date: string;
}

@Component({
  standalone: true,
  selector: 'app-account-wallet',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './account-wallet.component.html',
  styleUrls: ['./account-wallet.component.scss'],
})
export class AccountWalletComponent {
  balance = signal(8450000);

  transactions = signal<Transaction[]>([
    {
      id: 1,
      type: 'deposit',
      description: 'Deposit from bank account',
      amount: 5000000,
      date: 'May 8, 2026',
    },
    {
      id: 2,
      type: 'order',
      description: 'Order #ORD-39281 payment',
      amount: -1250000,
      date: 'May 7, 2026',
    },
    {
      id: 3,
      type: 'deposit',
      description: 'Refund from order #ORD-39214',
      amount: 450000,
      date: 'May 5, 2026',
    },
    {
      id: 4,
      type: 'withdrawal',
      description: 'Withdraw to bank account',
      amount: -2000000,
      date: 'May 3, 2026',
    },
  ]);

  depositMoney() {
    alert('Deposit feature is coming soon!');
  }
}
