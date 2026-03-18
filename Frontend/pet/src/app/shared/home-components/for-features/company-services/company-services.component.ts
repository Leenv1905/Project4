import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

interface CompanyService {
  icon: string;
  title: string;
  description: string;
}

@Component({
  standalone: true,
  selector: 'app-company-services',
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './company-services.component.html',
  styleUrls: ['./company-services.component.scss']
})
export class CompanyServicesComponent {

  services: CompanyService[] = [
    {
      icon: 'local_shipping',
      title: 'Free delivery',
      description: 'We offer free shipping on all orders within Vietnam.'
    },
    {
      icon: 'verified',
      title: 'Quality guarantee',
      description: 'Committed to product quality according to standards'
    },
    {
      icon: 'local_offer',
      title: 'Daily offers',
      description: 'Every day there will be golden hours from 12pm to 2pm'
    },
    {
      icon: 'security',
      title: '100% secure payment',
      description: 'Payment with digital banking system, absolute security'
    }
  ];
}
