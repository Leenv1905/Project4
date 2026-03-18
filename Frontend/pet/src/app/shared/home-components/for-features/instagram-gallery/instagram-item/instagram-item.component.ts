import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-instagram-item',
  imports: [CommonModule],
  templateUrl: './instagram-item.component.html',
  styleUrls: ['./instagram-item.component.scss']
})
export class InstagramItemComponent {

  @Input() image!: string;
  @Input() link!: string;

}
