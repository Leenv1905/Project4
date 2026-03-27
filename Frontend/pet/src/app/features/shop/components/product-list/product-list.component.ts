import { Component, inject, ChangeDetectionStrategy, computed  } from '@angular/core';
// ChangeDetectionStrategy.OnPush
// Angular chỉ re-render khi:
//   input thay đổi
//   signal thay đổi
import { CommonModule } from '@angular/common';
import { Product } from '../../../../core/models/product.model';
// import { ShopProduct } from '../../models/shop-product.model';
import { ShopService } from '../../services/shop.service';
import { ProductCardComponent } from '../../../../shared/home-components/for-features/product-card/product-card.component';
import { PaginationComponent } from '../pagination/pagination.component';

// NGHIÊN CỨU ChangeDetectionStrategy.OnPush ĐỂ TỐI ƯU HIỆU SUẤT CHO DANH SÁCH SẢN PHẨM
// (nếu cần thiết, có thể áp dụng sau khi hoàn thiện chức năng cơ bản)
// NGHIÊN CỨU THÊM Virtual Scroll (Cho 1000+ Products hoặc hơn)
@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-product-list',
  imports: [
    CommonModule,
    ProductCardComponent,
    PaginationComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent {

  shopService = inject(ShopService);

  // products = this.shopService.paginatedProducts;
  // map sang Product để dùng lại ProductCard
  products = computed<Product[]>(() =>
    this.shopService.paginatedProducts().map(p => ({
      id: p.id,
      name: p.name,
      description: '',
      price: p.price,
      images: [p.image], // fix quan trọng chỗ này
      breed: p.breed,
      dogType: p.dogType,
      shopName: p.shopName
    }))
  );
  // map sang Product để dùng lại ProductCard
  // Nếu không phaỉ sửa ProductCard để giữ nguyên ShopProduct image → image (string)
  totalPages = this.shopService.totalPages;
  pagination = this.shopService.pagination;

  trackById(index: number, product: Product) {
    return product.id;
  }

}
