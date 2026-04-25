import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Product } from '../../../../../core/models/product.model';
import { PetApiService } from '../../../../../core/services/pet-api.service';

@Component({
  standalone: true,
  selector: 'app-add-product',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly petApi = inject(PetApiService);

  product: Partial<Product> = {
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

  images: string[] = [];
  isSaving = false;

  uploadImages(event: Event) {
    const input = event.target as HTMLInputElement | null;
    const files = input?.files;
    if (!files) {
      return;
    }

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
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: 'products' }
    });
  }

  saveDraft() {
    alert('Backend hien chua co API luu nhap.');
  }

  publish() {
    const product = this.product;
    if (!product.name || !product.breed || !product.price || product.price <= 0) {
      alert('Vui long nhap day du ten thu cung, giong va gia ban.');
      return;
    }

    this.isSaving = true;
    this.petApi.createPet(product, this.images).subscribe({
      next: () => {
        this.isSaving = false;
        this.backToProducts();
      },
      error: () => {
        this.isSaving = false;
        alert('Khong the dang san pham.');
      }
    });
  }

  discard() {
    if (confirm('Ban co chac muon huy bo?')) {
      this.backToProducts();
    }
  }
}
