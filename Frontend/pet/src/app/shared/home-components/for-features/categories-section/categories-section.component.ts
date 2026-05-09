import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-categories-section',
  imports: [CommonModule, RouterModule],
  templateUrl: './categories-section.component.html',
  styleUrls: ['./categories-section.component.scss'],
})
export class CategoriesSectionComponent {
  categories = [
    {
      title: 'Poodle',
      image:
        'https://cdn.tgdd.vn/Files/2021/04/12/1342796/15-giong-cho-canh-dep-de-cham-soc-pho-bien-tai-viet-nam-202104121459561436.jpg',
      link: '/shop',
    },
    {
      title: 'Corgi',
      image:
        'https://cdn.tgdd.vn/Files/2021/04/12/1342796/15-giong-cho-canh-dep-de-cham-soc-pho-bien-tai-viet-nam-202104121504407738.jpg',
      link: '/shop',
    },
    {
      title: 'Alaska',
      image:
        'https://cdn.tgdd.vn/Files/2021/04/12/1342796/15-giong-cho-canh-dep-de-cham-soc-pho-bien-tai-viet-nam-202104121501444654.jpg',
      link: '/shop',
    },
    { title: 'Chihuahua', image: '/assets/cho21.jpg', link: '/shop' },
  ];
}
