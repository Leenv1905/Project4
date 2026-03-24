import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-account-sidebar',
  imports: [CommonModule],
  templateUrl: './account-sidebar.component.html',
  styleUrls: ['./account-sidebar.component.scss']
})
export class AccountSidebarComponent {

  @Input() active!: string;
  @Output() changeTab = new EventEmitter<'orders' | 'info' | 'payment'>();

}
