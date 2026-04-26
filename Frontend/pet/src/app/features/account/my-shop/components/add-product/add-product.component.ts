import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PetApiService } from '../../../../../core/services/pet-api.service';
import { NotificationModalComponent } from '../../../../../shared/notification-modal/notification-modal.component';

@Component({
  standalone: true,
  selector: 'app-add-product',
  imports: [CommonModule, FormsModule, NotificationModalComponent],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private petService = inject(PetApiService);


  // GIỮ NGUYÊN FORM CŨ VÀ THÊM PETCODE
  product: any = {
    petCode: '',
    name: '',
    description: '',
    price: 0,
    species: 'Chó',
    breed: '',
    color: '',
    gender: 'male',
    weight: 0,
    age: 0,
    vaccinated: true,
    neutered: false,
    status: 'available'
  };

  // QUẢN LÝ ẢNH & AI
  finalImages: any[] = [];
  selectedFile: File | null = null;
  originalPreview: string | null = null;
  aiImageUrl: string | null = null; // Ảnh AI
  tempAiUrlRaw: string | null = null; // Để gửi cho BE khi đăng bán
  isAiLoading = false;

  // MODAL
  modal: { show: boolean; title: string; message: string; type: 'success' | 'error' | 'info'; onClose?: () => void } = {
    show: false, title: '', message: '', type: 'info'
  };

  showModal(title: string, message: string, type: 'success' | 'error' | 'info', onClose?: () => void) {
    this.modal = { show: true, title, message, type, onClose };
  }

  closeModal() {
    const cb = this.modal.onClose;
    this.modal = { show: false, title: '', message: '', type: 'info' };
    cb?.();
  }

  validatePetCode(event: any) {
    let value = event.target.value.toUpperCase();
    
    // Chỉ cho phép chữ cái, số và dấu gạch ngang
    value = value.replace(/[^A-Z0-9-]/g, '');
    
    // Format: PET-YYYYMMDD-XXXX
    // Tự động thêm dấu gạch ngang ở vị trí phù hợp
    if (value.length > 3 && value[3] !== '-') {
      value = value.slice(0, 3) + '-' + value.slice(3);
    }
    if (value.length > 12 && value[12] !== '-') {
      value = value.slice(0, 12) + '-' + value.slice(12);
    }
    
    // Giới hạn độ dài tối đa: PET-20260426-0001 = 17 ký tự
    if (value.length > 17) {
      value = value.slice(0, 17);
    }
    
    this.product.petCode = value;
    event.target.value = value;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.originalPreview = reader.result as string;
        // Mặc định cho ảnh gốc vào danh sách trước (nếu người dùng không muốn dùng AI)
        this.updateFinalImages(this.originalPreview, false);
      };
      reader.readAsDataURL(file);
    }
  }

  generateAiImage() {
    if (!this.selectedFile) return;
    this.isAiLoading = true;

    // Gọi Service với file thực tế
    this.petService.renderAiPreview(this.selectedFile, 'Pixar Style').subscribe({
      next: (res) => {
        // BE đã trả về đầy đủ "data:image/png;base64,..." rồi
        const dataUrl = res.tempAiUrl || '';

        this.tempAiUrlRaw = dataUrl;
        this.aiImageUrl = dataUrl;

        this.updateFinalImages(dataUrl, true);
        this.isAiLoading = false;
      },
      error: (err) => {
        this.isAiLoading = false;
        this.showModal('Lỗi', err.error?.message || 'Lỗi render AI', 'error');
      }
    });
  }

  updateFinalImages(url: string, isAi: boolean) {
    // Luôn ưu tiên ảnh mới nhất người dùng thao tác
    // Bạn có thể chỉnh sửa logic này nếu muốn cho phép nhiều ảnh
    const newImage = {
      imageUrl: url,
      isAiProcessed: isAi,
      aiPrompt: isAi ? 'Pixar Style' : '',
      isPrimary: true,
      displayOrder: 1
    };

    if (isAi) {
      this.finalImages = [newImage]; // Nếu dùng AI thì lấy làm ảnh duy nhất/chính
    } else {
      this.finalImages.push(newImage);
    }
  }

  removeImage(index: number) {
    this.finalImages.splice(index, 1);
  }

  publish() {
    // Kiểm tra format: PET-YYYYMMDD-XXXX (17 ký tự)
    const petCodePattern = /^PET-\d{8}-\d{4}$/;
    
    console.log('Pet Code hiện tại:', this.product.petCode);
    console.log('Test regex:', petCodePattern.test(this.product.petCode));
    
    if (!this.product.petCode || !petCodePattern.test(this.product.petCode)) {
      this.showModal('Lỗi', 'Mã chip phải có định dạng: PET-YYYYMMDD-XXXX (ví dụ: PET-20260426-0001)', 'error');
      return;
    }

    const payload = {
      ...this.product,
      images: this.finalImages
    };

    console.log('Payload gửi BE:', JSON.stringify(payload, null, 2));
    this.petService.createPetWithRequest(payload).subscribe({
      next: () => {
        this.showModal('Thành công', 'Đăng bán thú cưng thành công!', 'success', () => this.backToProducts());
      },
      error: (err) => this.showModal('Lỗi', err.error?.message || 'Lỗi lưu dữ liệu', 'error')
    });
  }

  saveDraft() {
    const payload = {
      ...this.product,
      images: this.finalImages
    };
    console.log('Đang lưu bản nháp:', payload);
    this.showModal('Thành công', 'Đã lưu bản nháp thành công!', 'success');
    // Bạn có thể thêm logic lưu vào LocalStorage hoặc gọi API lưu nháp tại đây
  }

  discard() {
    this.showModal('Xác nhận', 'Bạn có chắc muốn hủy bỏ?', 'info', () => this.backToProducts());
  }

  backToProducts() { this.router.navigate(['../'], { relativeTo: this.route }); }
}
