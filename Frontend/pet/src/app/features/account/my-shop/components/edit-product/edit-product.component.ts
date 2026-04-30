import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../../../core/models/product.model';
import { PetApiService } from '../../../../../core/services/pet-api.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { NotificationModalComponent } from '../../../../../shared/notification-modal/notification-modal.component';
import { LoadingModalComponent } from '../../../../../shared/loading-modal/loading-modal.component';

@Component({
  standalone: true,
  selector: 'app-edit-product',
  imports: [CommonModule, FormsModule, NotificationModalComponent, LoadingModalComponent],
  templateUrl: './edit-product.component.html',
  styleUrls: ['../add-product/add-product.component.scss']
})
export class EditProductComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly petApi = inject(PetApiService);
  readonly auth = inject(AuthService);

  product: Partial<Product> = {};
  images: string[] = [];
  productId: number | null = null;
  isSaving = false;
  isLoadingData = false;
  private navigateAfterModal = false;

  modal: { show: boolean; title: string; message: string; type: 'success' | 'error' | 'info'; } = {
    show: false, title: '', message: '', type: 'info'
  };

  showModal(title: string, message: string, type: 'success' | 'error' | 'info') {
    this.modal = { show: true, title, message, type };
  }

  closeModal() {
    this.modal = { ...this.modal, show: false };
    if (this.navigateAfterModal) {
      this.navigateAfterModal = false;
      this.backToProducts();
    }
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.queryParamMap.get('id'));
    if (!id) return;

    this.productId = id;
    this.isLoadingData = true;
    this.petApi.getPetById(id).subscribe({
      next: (product) => {
        this.isLoadingData = false;
        this.product = { ...product };
        this.images = [...product.images];
      },
      error: () => {
        this.isLoadingData = false;
        this.showModal('Lỗi', 'Không tải được thông tin thú cưng.', 'error');
      }
    });
  }

  uploadImages(event: Event) {
    const input = event.target as HTMLInputElement | null;
    const files = input?.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => this.images.push(String(reader.result || ''));
      reader.readAsDataURL(file);
    });
  }

  removeImage(index: number) {
    this.images.splice(index, 1);
  }

  backToProducts() {
    this.router.navigate(['/my-shop'], { queryParams: { tab: 'products' } });
  }

  updateProduct() {
    if (!this.productId || !this.product.name || !this.product.breed || !this.product.price || this.product.price <= 0) {
      this.showModal('Thiếu thông tin', 'Vui lòng nhập đầy đủ tên, giống và giá bán.', 'error');
      return;
    }

    this.isSaving = true;
    this.petApi.updatePet(this.productId, this.product, this.images).subscribe({
      next: () => {
        this.isSaving = false;
        this.navigateAfterModal = true;
        this.showModal('Thành công', 'Cập nhật thú cưng thành công!', 'success');
      },
      error: (err) => {
        this.isSaving = false;
        this.showModal('Lỗi', err?.error?.message || 'Không thể cập nhật thú cưng.', 'error');
      }
    });
  }
}
