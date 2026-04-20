import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {Product} from '../../../../../core/models/product.model';


@Component({
  standalone: true,
  selector: 'app-add-product',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent {

  router = inject(Router);
  route = inject(ActivatedRoute);

  // Form theo model Product (không có birth_of_date)
  product: Partial<Product> = {
    name: '',
    description: '',
    price: 0,
    species: 'Chó',
    breed: '',
    color: '',
    gender: 'male',
    weight: 0,
    age: 0,                    // Giữ age tạm thời
    vaccinated: true,          // Bỏ sau khi sửa model
    neutered: false,            // Bỏ sau khi sửa model
    status: 'available'
  };

  images: string[] = [];

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

  saveDraft() {
    console.log('Draft saved:', this.product, this.images);
    alert('Đã lưu bản nháp!');
  }

  publish() {
    const p = this.product;

    if (!p.name || !p.breed || !p.price || p.price <= 0) {
      alert('Vui lòng nhập đầy đủ: Tên thú cưng, Giống và Giá bán (> 0)');
      return;
    }

    const newProduct: Product = {
      id: Date.now(),
      name: p.name,
      description: p.description || '',
      price: p.price,
      images: this.images.length > 0 ? this.images : ['/assets/pets/default-pet.jpg'],
      status: p.status || 'available',
      species: p.species || 'Chó',
      breed: p.breed,
      color: p.color || '',
      gender: p.gender || 'male',
      weight: p.weight || 0,
      age: p.age || 0,                    // Giữ age tạm thời
      vaccinated: p.vaccinated ?? true,   // Bỏ sau khi sửa model
      neutered: p.neutered ?? false,      // Bỏ sau khi sửa model
      shopId: 1,
      shopName: 'My Shop',                // Có thể lấy từ auth sau
      createdAt: new Date()
    };

    console.log('Published Product:', newProduct);
    alert('✅ Sản phẩm đã được đăng thành công!');

    this.backToProducts();
  }

  discard() {
    if (confirm('Bạn có chắc muốn hủy bỏ?')) {
      this.backToProducts();
    }
  }
}
