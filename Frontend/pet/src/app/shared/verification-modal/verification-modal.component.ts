import { Component, signal, output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-verification-modal',
  imports: [CommonModule],
  templateUrl: './verification-modal.component.html',
  styleUrls: ['./verification-modal.component.scss']
})
export class VerificationModalComponent {

  // Input từ cha
  @Input() orderId!: number;
  @Input() title = 'Xác minh nhận hàng';

  // Output
  confirm = output<{ orderId: number; code: string }>();
  close = output<void>();

  // State
  verificationCode = signal('');
  isCodeValid = signal(false);
  isWrongPet = signal(false);
  petInfo = signal<any>(null);

  private readonly CORRECT_CODE = 'PET-A123';
  private readonly WRONG_CODE = 'PET-B456';

  checkCode() {
    const code = this.verificationCode().trim().toUpperCase();

    if (code === this.CORRECT_CODE) {
      this.isCodeValid.set(true);
      this.isWrongPet.set(false);
      this.petInfo.set({
        name: 'Buddy',
        species: 'Chó',
        breed: 'Golden Retriever',
        variety: 'Thuần chủng',
        vaccination: 'Đã tiêm đầy đủ (Dại, Parvo, Distemper, Leptospirosis)',
        healthStatus: 'Xuất sắc - Cân nặng 28kg, đã triệt sản',
        chipId: 'PET-A123'
      });
    }
    else if (code === this.WRONG_CODE) {
      this.isCodeValid.set(false);
      this.isWrongPet.set(true);
      this.petInfo.set({
        name: 'Max',
        species: 'Chó',
        breed: 'Husky Siberia',
        variety: 'Thuần chủng',
        vaccination: 'Đã tiêm 4 mũi cơ bản',
        healthStatus: 'Tốt, đã triệt sản',
        chipId: 'PET-B456'
      });
    }
    else {
      this.isCodeValid.set(false);
      this.isWrongPet.set(false);
      this.petInfo.set(null);
    }
  }

  onConfirm() {
    if (this.isCodeValid() && this.orderId) {
      this.confirm.emit({ orderId: this.orderId, code: this.verificationCode().trim() });
      this.closeModal();
    }
  }

  closeModal() {
    this.verificationCode.set('');
    this.isCodeValid.set(false);
    this.isWrongPet.set(false);
    this.petInfo.set(null);
    this.close.emit();
  }
}
