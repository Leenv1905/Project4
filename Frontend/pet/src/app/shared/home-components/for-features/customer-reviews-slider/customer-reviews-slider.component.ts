import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReviewCardComponent } from './review-card/review-card.component';

@Component({
  standalone: true,
  selector: 'app-customer-reviews-slider',
  imports: [CommonModule, ReviewCardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './customer-reviews-slider.component.html',
  styleUrls: ['./customer-reviews-slider.component.scss']
})
export class CustomerReviewsSliderComponent {

  reviews = [
    {
      text: 'Fast delivery, quality product, good for health...',
      name: 'Emma Chamberlin'
    },
    {
      text: "I feel very confident buying from here; I've bought from them three times already....",
      name: 'Thomas John'
    },
    {
      text: 'Very satisfied, I was able to find my favorite pet quickly....',
      name: 'Kevin Bryan'
    },
    {
      text: 'This is my first purchase, but I\'m very satisfied....',
      name: 'Stevin'
    }
  ];
}
