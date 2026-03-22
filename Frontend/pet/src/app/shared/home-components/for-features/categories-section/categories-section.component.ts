import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-categories-section',
  imports: [CommonModule, RouterModule],
  templateUrl: './categories-section.component.html',
  styleUrls: ['./categories-section.component.scss']
})
export class CategoriesSectionComponent {

  categories = [
    { title: 'Poodle', image: '/assets/cho21.jpg', link: '/shop' },
    { title: 'Poodle', image: '/assets/cho21.jpg', link: '/shop' },
    { title: 'Alaska', image: '/assets/cho21.jpg', link: '/shop' },
    { title: 'Beagle', image: '/assets/cho21.jpg', link: '/shop' }
  ];
}
