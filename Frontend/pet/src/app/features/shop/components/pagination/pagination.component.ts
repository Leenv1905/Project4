import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopService } from '../../services/shop.service';

@Component({
  standalone: true,
  selector: 'app-pagination',
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {

  shopService = inject(ShopService);

  @Input() currentPage!: number;
  @Input() totalPages!: number;

  setPage(page: number) {
    this.shopService.setPage(page);
  }

}
