import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {Product} from '../../../../../core/models/product.model';
import {generateMockProducts} from '../../../../shop/data/mock-products';


@Component({
  standalone: true,
  selector: 'app-edit-product',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-product.component.html',
  styleUrls: ['../add-product/add-product.component.scss']   // Giữ CSS chung vs Add
})
export class EditProductComponent {

  router = inject(Router);
  route = inject(ActivatedRoute);

  // Form theo model Product mới
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

  ngOnInit() {
    const id = Number(this.route.snapshot.queryParamMap.get('id'));
    if (id) {
      this.loadProduct(id);
    }
  }

  loadProduct(id: number) {
    // Lấy từ mock data (generateMockProducts)
    const allProducts = generateMockProducts(30);
    const found = allProducts.find(p => p.id === id);

    if (found) {
      this.product = { ...found };
      this.images = [...found.images];
    } else {
      console.warn(`Không tìm thấy sản phẩm với id = ${id}`);
    }
  }

  uploadImages(event: any) {
    const files = event.target.files;
    if (!files) return;

    for (let file of files) {
      const reader = new FileReader();
      reader.onload = () => this.images.push(reader.result as string);
      reader.readAsDataURL(file);
    }
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
    if (!this.product.name || !this.product.breed || !this.product.price || this.product.price <= 0) {
      alert('Vui lòng nhập đầy đủ: Tên, Giống và Giá bán');
      return;
    }

    const updatedProduct: Product = {
      id: Number(this.product.id) || Date.now(),
      name: this.product.name,
      description: this.product.description || '',
      price: this.product.price,
      images: this.images.length > 0 ? this.images : ['/assets/pets/default-pet.jpg'],
      status: this.product.status || 'available',
      species: this.product.species || 'Chó',
      breed: this.product.breed,
      color: this.product.color || '',
      gender: this.product.gender || 'male',
      weight: this.product.weight || 0,
      age: this.product.age || 0,
      vaccinated: this.product.vaccinated ?? true,
      neutered: this.product.neutered ?? false,
      shopId: this.product.shopId || 1,
      shopName: this.product.shopName || 'My Shop',
      createdAt: this.product.createdAt || new Date()
      // updatedAt: new Date()
    };

    console.log('Updated Product:', updatedProduct);
    alert('✅ Sản phẩm đã được cập nhật thành công!');

    this.backToProducts();
  }
}
