import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

export interface OperatorReceiveData {
  orderId: number;
}

@Component({
  standalone: true,
  selector: 'app-operator-receive-modal',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  templateUrl: './operator-receive-modal.component.html',
  styleUrls: ['./operator-receive-modal.component.scss']
})
export class OperatorReceiveModalComponent {

  orderId: number;

  // 3 cột kiểm tra
  visualCheck = signal({
    furColor: '',
    weight: '',
    breed: '',
    gender: 'male',
    condition: 'good'
  });

  healthCheck = signal({
    generalHealth: 'good',
    skinIssue: false,
    mobility: 'good',
    vaccination: true
  });

  petInfo = signal<any>(null);
  verificationCode = signal('');
  isCodeValid = signal(false);
  isWrongPet = signal(false);

  private readonly CORRECT_CODE = 'CZAREP8B1LVXNV3';
  private readonly WRONG_CODE = 'SPSWISFWICYSUMI';

  constructor(
    public dialogRef: MatDialogRef<OperatorReceiveModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OperatorReceiveData
  ) {
    this.orderId = data.orderId;
  }

  private readonly CHIP_PATTERN = /^[A-Z0-9]{15}$/;

  checkCode() {
    const code = this.verificationCode().trim().toUpperCase();

    if (!code) {
      this.isCodeValid.set(false);
      this.isWrongPet.set(false);
      this.petInfo.set(null);
      return;
    }

    if (!this.CHIP_PATTERN.test(code)) {
      this.isCodeValid.set(false);
      this.isWrongPet.set(false);
      this.petInfo.set(null);
      return;
    }

    if (code === this.WRONG_CODE) {
      this.isCodeValid.set(false);
      this.isWrongPet.set(true);
      this.petInfo.set({
        name: 'Max',
        species: 'Chó',
        breed: 'Husky Siberia',
        variety: 'Thuần chủng',
        vaccination: 'Đã tiêm 4 mũi cơ bản',
        healthStatus: 'Tốt, đã triệt sản',
        chipId: code
      });
      return;
    }

    this.isCodeValid.set(true);
    this.isWrongPet.set(false);
    this.petInfo.set(
      code === this.CORRECT_CODE
        ? {
            name: 'Buddy',
            species: 'Chó',
            breed: 'Golden Retriever',
            variety: 'Thuần chủng',
            vaccination: 'Đã tiêm đầy đủ (Dại, Parvo, Distemper, Leptospirosis) - Lần cuối: 15/01/2025',
            healthStatus: 'Xuất sắc - Không có bệnh lý, cân nặng 28kg, đã triệt sản',
            chipId: code
          }
        : {
            name: 'Không xác định',
            species: 'Không xác định',
            breed: 'Không xác định',
            variety: 'Không xác định',
            vaccination: 'Không xác định',
            healthStatus: 'Không xác định',
            chipId: code
          }
    );
  }

  canReceive(): boolean {
    return this.isCodeValid() &&
      this.visualCheck().condition === 'good' &&
      this.healthCheck().generalHealth === 'good';
  }

  onReceive() {
    if (this.canReceive()) {
      this.dialogRef.close({ action: 'receive', orderId: this.orderId });
    }
  }

  onReject() {
    this.dialogRef.close({ action: 'reject', orderId: this.orderId });
  }

  onSaveOnly() {
    this.dialogRef.close({ action: 'save', orderId: this.orderId });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
