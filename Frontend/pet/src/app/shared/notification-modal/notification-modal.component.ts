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
        <div class="modal-footer" [class.two-btn]="showCancel">
          <button *ngIf="showCancel" class="btn-cancel" (click)="close()">
            {{ cancelLabel }}
          </button>
          <button class="btn-confirm" [ngClass]="type" (click)="confirm()">
            {{ confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./notification-modal.component.scss']
})
export class NotificationModalComponent {
  @Input() title = 'Thông báo';
  @Input() message = '';
  @Input() type: 'success' | 'error' | 'info' = 'info';
  @Input() showCancel = false;
  @Input() confirmLabel = 'Xác nhận';
  @Input() cancelLabel = 'Huỷ bỏ';

  @Output() closed = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<void>();

  close() {
    this.closed.emit();
  }

  confirm() {
    this.confirmed.emit();
    this.closed.emit();
  }
}
