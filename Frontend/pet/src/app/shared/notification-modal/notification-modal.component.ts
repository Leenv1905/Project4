import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-notification-modal',
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="close()">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <div class="modal-header" [ngClass]="type">
          <h3>{{ title }}</h3>
          <button class="close-btn" (click)="close()">&times;</button>
        </div>
        <div class="modal-body">
          <p>{{ message }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn-confirm" (click)="close()">Xác nhận</button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./notification-modal.component.scss']
})
export class NotificationModalComponent {
  @Input() title: string = 'Thông báo';
  @Input() message: string = '';
  @Input() type: 'success' | 'error' | 'info' = 'success';
  @Output() closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
  }
}
