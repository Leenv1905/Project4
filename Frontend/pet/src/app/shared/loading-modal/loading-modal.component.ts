import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-loading-modal',
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" *ngIf="visible">
      <div class="modal-card loading-card">
        <div class="spinner"></div>
        <p>{{ message }}</p>
      </div>
    </div>
  `,
  styleUrls: ['./loading-modal.component.scss']
})
export class LoadingModalComponent {
  @Input() visible: boolean = false;
  @Input() message: string = 'Đang xử lý...';
}
