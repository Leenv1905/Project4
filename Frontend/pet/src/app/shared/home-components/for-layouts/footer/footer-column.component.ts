import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-footer-column',
  imports: [CommonModule],
  templateUrl: './footer-column.component.html'
})
export class FooterColumnComponent {
  @Input() title!: string;
  @Input() items?: { label: string; link: string }[];
}
