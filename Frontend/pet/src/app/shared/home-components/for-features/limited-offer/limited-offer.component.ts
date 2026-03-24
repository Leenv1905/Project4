import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-limited-offer',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './limited-offer.component.html',
  styleUrls: ['./limited-offer.component.scss']
})
export class LimitedOfferComponent implements OnInit, OnDestroy {

  endDate!: Date;
  timeLeft = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };

  private timerId!: number;

  ngOnInit(): void {
    this.endDate = new Date();
    this.endDate.setDate(this.endDate.getDate() + 4);

    this.updateTime();
    this.timerId = window.setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timerId);
  }

  private updateTime() {
    const now = new Date().getTime();
    const diff = this.endDate.getTime() - now;

    if (diff > 0) {
      this.timeLeft = {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    } else {
      this.timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
  }
}
