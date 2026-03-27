import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiniProductCardComponent } from '../mini-product-card/mini-product-card.component';
import { Product } from '../../../../../core/models/product.model';

@Component({
  standalone: true,
  selector: 'app-product-group',
  imports: [CommonModule, MiniProductCardComponent],
  templateUrl: './product-group.component.html',
  styleUrls: ['./product-group.component.scss']
})
export class ProductGroupComponent {

  @Input() title!: string;
  @Input() products: Product[] = [];
}
