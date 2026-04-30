import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {

  keyword = '';

  orders = [
    {
      id: '#PL-8829',
      seller: 'Alpha Shelters',
      breed: 'Golden Retriever',
      location: 'Seattle',
      date: 'Oct 24',
      status: 'Urgent'
    },
    {
      id: '#PL-8831',
      seller: 'Bluegrass Kennels',
      breed: 'Maine Coon',
      location: 'Lexington',
      date: 'Oct 24',
      status: 'Scheduled'
    }
  ];
}
