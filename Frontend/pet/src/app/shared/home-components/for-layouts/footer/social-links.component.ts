import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-social-links',
  imports: [MatIconModule, MatButtonModule],
  template: `
    <button mat-icon-button><mat-icon>facebook</mat-icon></button>
    <button mat-icon-button><mat-icon>instagram</mat-icon></button>
    <button mat-icon-button><mat-icon>twitter</mat-icon></button>
    <button mat-icon-button><mat-icon>linkedin</mat-icon></button>
    <button mat-icon-button><mat-icon>youtube</mat-icon></button>
  `
})
export class SocialLinksComponent {}
