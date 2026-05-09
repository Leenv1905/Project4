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
  imports: [CommonModule, RouterLink, MatButtonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './gallery-pet.component.html',
  styleUrls: ['./gallery-pet.component.scss'],
})
export class GalleryPetComponent implements OnInit {
  slides = signal<GallerySlide[]>([]);

  ngOnInit(): void {
    this.slides.set([
      {
        id: 1,
        title: 'Super Cute Corgi Puppy',
        description: 'Get 20% off today only! Starting from 1,890,000₫',
        image: 'assets/cho1.jpg',
        buttonText: 'Shop Now',
      },
      {
        id: 2,
        title: 'Adorable British Shorthair Cat',
        description: 'Your perfect companion for every moment',
        image: 'assets/cho2.jpg',
        buttonText: 'Shop Now',
      },
      // Add more slides if needed
    ]);
  }

  trackById(_: number, slide: GallerySlide) {
    return slide.id;
  }
}
