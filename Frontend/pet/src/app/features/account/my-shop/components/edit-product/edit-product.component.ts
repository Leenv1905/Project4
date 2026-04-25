import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../../../core/models/product.model';
import { PetApiService } from '../../../../../core/services/pet-api.service';

@Component({
  standalone: true,
  selector: 'app-edit-product',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-product.component.html',
  styleUrls: ['../add-product/add-product.component.scss']
})
export class EditProductComponent implements OnInit {
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
  productId: number | null = null;
  isSaving = false;

  ngOnInit() {
    const id = Number(this.route.snapshot.queryParamMap.get('id'));
    if (!id) {
      return;
    }

    this.productId = id;
    this.petApi.getPetById(id).subscribe({
      next: (product) => {
        this.product = { ...product };
        this.images = [...product.images];
      },
      error: () => alert('Khong tai duoc thong tin san pham.')
    });
  }

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

  updateProduct() {
    if (!this.productId || !this.product.name || !this.product.breed || !this.product.price || this.product.price <= 0) {
      alert('Vui long nhap day du ten, giong va gia ban.');
      return;
    }

    this.isSaving = true;
    this.petApi.updatePet(this.productId, this.product, this.images).subscribe({
      next: () => {
        this.isSaving = false;
        this.backToProducts();
      },
      error: () => {
        this.isSaving = false;
        alert('Khong the cap nhat san pham.');
      }
    });
  }
}
