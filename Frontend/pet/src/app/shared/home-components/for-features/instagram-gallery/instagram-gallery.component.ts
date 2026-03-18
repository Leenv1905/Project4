import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstagramItemComponent } from './instagram-item/instagram-item.component';

@Component({
  standalone: true,
  selector: 'app-instagram-gallery',
  imports: [CommonModule, InstagramItemComponent],
  templateUrl: './instagram-gallery.component.html',
  styleUrls: ['./instagram-gallery.component.scss']
})
export class InstagramGalleryComponent {

  instagramItems = [
    { image: '/assets/cho1.jpg', link: '#' },
    { image: '/assets/cho2.jpg', link: '#' },
    { image: '/assets/cho3.jpg', link: '#' },
    { image: '/assets/cho4.jpg', link: '#' },
    { image: '/assets/cho5.jpg', link: '#' },
    { image: '/assets/cho6.jpeg', link: '#' }
  ];

}
