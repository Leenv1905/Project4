import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from '../../shared/home-components/for-features/breadcrumbs/breadcrumbs.component';

@Component({
  standalone: true,
  selector: 'app-contact',
  imports: [CommonModule, BreadcrumbsComponent],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {}

