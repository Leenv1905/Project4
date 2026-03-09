import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-user-modal',
  imports: [
    MatDialogModule,
    CommonModule,
    MatTabsModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './user-modal.component.html'
})
export class UserModalComponent {
  tabIndex = 0;
  email = '';
  password = '';

  constructor(public auth: AuthService) {}

  login() {
    this.auth.login(this.email, this.password);
  }

  register() {
    this.auth.register();
  }
}
