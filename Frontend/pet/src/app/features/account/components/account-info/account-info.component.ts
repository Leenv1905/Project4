import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-account-info',
  template: `
    <h2>Thông tin cá nhân</h2>

    <p>Tên: {{ auth.user()?.name }}</p>
    <p>Email: {{ auth.user()?.email }}</p>
    <p>Role: {{ auth.user()?.role }}</p>
  `
})
export class AccountInfoComponent {

  auth = inject(AuthService);

}
