import { Component, OnInit, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

interface GallerySlide {
  id: number;
  title: string;
  description: string;
  image: string;
  buttonText: string;
}

@Component({
  standalone: true,
  selector: 'app-gallery-book',
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './gallery-book.component.html',
  styleUrls: ['./gallery-book.component.scss']
})
export class GalleryBookComponent implements OnInit {

  slides = signal<GallerySlide[]>([]);

  ngOnInit(): void {
    this.slides.set([
      {
        id: 1,
        title: 'The Silent Forest',
        description: 'Save 20%! Only 120.000 VNĐ',
        image: 'assets/logo/main-logo.png',
        buttonText: 'Shop Now'
      },
      {
        id: 2,
        title: 'Journey to the Stars',
        description: 'Discover now!',
        image: 'assets/logo/main-logo.png',
        buttonText: 'Shop Now'
      }
    ]);
  }

  trackById(_: number, slide: GallerySlide) {
    return slide.id;
  }
}
