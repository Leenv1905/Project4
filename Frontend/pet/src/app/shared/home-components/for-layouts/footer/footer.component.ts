import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterColumnComponent } from './footer-column.component';
import { SocialLinksComponent } from './social-links.component';

@Component({
  standalone: true,
  selector: 'app-footer',
  imports: [
    CommonModule,
    FooterColumnComponent,
    SocialLinksComponent
  ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {}
