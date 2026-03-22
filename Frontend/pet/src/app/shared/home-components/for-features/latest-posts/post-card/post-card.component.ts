import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-post-card',
  imports: [CommonModule],
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent {

  @Input() image!: string;
  @Input() category!: string;
  @Input() title!: string;
  @Input() description!: string;
  @Input() postLink!: string;

  constructor(private router: Router) {}

  navigate() {
    this.router.navigate([this.postLink]);
  }
}
