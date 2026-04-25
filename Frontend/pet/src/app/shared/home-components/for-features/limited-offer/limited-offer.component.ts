import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;
const SECOND_MS = 1000;

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

  private readonly countdownStart = Date.now();
  private readonly endTimestamp = this.countdownStart + (4 * DAY_MS);

  readonly endDate = new Date(this.endTimestamp);
  timeLeft = this.calculateTimeLeft(this.countdownStart);

  private timerId?: number;

  ngOnInit(): void {
    this.timerId = window.setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timerId !== undefined) {
      clearInterval(this.timerId);
    }
  }

  private updateTime(now = Date.now()): void {
    this.timeLeft = this.calculateTimeLeft(now);
  }

  private calculateTimeLeft(now: number) {
    const diff = this.endTimestamp - now;

    if (diff > 0) {
      return {
        days: Math.floor(diff / DAY_MS),
        hours: Math.floor((diff / HOUR_MS) % 24),
        minutes: Math.floor((diff / MINUTE_MS) % 60),
        seconds: Math.floor((diff / SECOND_MS) % 60),
      };
    } else {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
  }
}
