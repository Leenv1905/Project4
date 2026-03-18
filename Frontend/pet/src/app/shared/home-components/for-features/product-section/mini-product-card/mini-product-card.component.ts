import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-mini-product-card',
  imports: [CommonModule],
  templateUrl: './mini-product-card.component.html',
  styleUrls: ['./mini-product-card.component.scss']
})
export class MiniProductCardComponent {
  @Input() id!: number;
  @Input() image!: string;
  @Input() name!: string;
  @Input() shopName!: string;
  @Input() breed!: string;
  @Input() dogType!: string;
  @Input() price!: number;

  constructor(private router: Router) {}

  navigate() {
    if (this.id) {
      this.router.navigate(['/productdetail', this.id]);
    }
  }
}
