import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-my-shop-sidebar',
  imports: [CommonModule],
  templateUrl: './my-shop-sidebar.component.html',
  styleUrls: ['./my-shop-sidebar.component.scss']
})
export class MyShopSidebarComponent {

  @Input() active!: string;
  @Output() changeTab = new EventEmitter<'dashboard' | 'products' | 'orders' | 'info'>();

}
