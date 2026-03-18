import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PostCardComponent } from './post-card/post-card.component';

@Component({
  standalone: true,
  selector: 'app-latest-posts',
  imports: [CommonModule, RouterModule, PostCardComponent],
  templateUrl: './latest-posts.component.html',
  styleUrls: ['./latest-posts.component.scss']
})
export class LatestPostsComponent {

  posts = [
    {
      image: '/assets/cho6.jpeg',
      category: 'Golden',
      title: 'If you have young children, the Golden Retriever breed is a perfect choice.!',
      description: 'Golden Retrievers are a very beautiful and cute breed of dog, with a well-proportioned body and soft golden fur....',
      postLink: '/singlepost'
    },
    {
      image: '/assets/cho1.jpg',
      category: 'Pomeranian ',
      title: 'Pomeranian dogs are small and adorable, with big, round eyes.',
      description: 'Pomeranian dogs come in several common sizes, including standard, mini, and teacup, weighing between 1-3 kg....',
      postLink: '/singlepost'
    },
    {
      image: '/assets/cho4.jpg',
      category: 'Corgi',
      title: 'Purebred Corgis, with beautiful appearance and true to breed.',
      description: 'A purebred Pembroke Corgi should have a rounded body, a straight back, large hindquarters, and a tail that is short or less than 5cm....',
      postLink: '/singlepost'
    },
    {
      image: '/assets/cho2.jpg',
      category: 'Becgie ',
      title: 'These German Shepherd dogs are special.',
      description: 'German Shepherds include many types: Husky, Rottweiler, Vietnamese Shepherd, Phu Quoc Shepherd, Wolf Shepherd, and Doberman....',
      postLink: '/singlepost'
    }
  ];
}
