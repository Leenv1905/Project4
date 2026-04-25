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
  private readonly fallbackImage = '/assets/cho1.jpg';

  @Input() id!: number;
  @Input() image!: string;
  @Input() name!: string;
  @Input() shopName!: string;
  @Input() breed!: string;
  @Input() weight!: string;
  @Input() price!: number;

  constructor(private router: Router) {}

  handleImageError(event: Event) {
    const element = event.target as HTMLImageElement | null;
    if (!element || element.src.endsWith(this.fallbackImage)) {
      return;
    }

    element.src = this.fallbackImage;
  }

  navigate() {
    if (this.id) {
      this.router.navigate(['/productdetail', this.id]);
    }
  }
}
