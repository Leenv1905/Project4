import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth.service';
import { UserProfile, UserProfileService } from '../../../../../core/services/user-profile.service';

@Component({
  standalone: true,
  selector: 'app-my-shop-info',
  imports: [CommonModule],
  templateUrl: './my-shop-info.component.html',
  styleUrls: ['./my-shop-info.component.scss']
})
export class MyShopInfoComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly profileService = inject(UserProfileService);

  readonly user = this.auth.user;
  readonly profile = signal<UserProfile | null>(null);

  ngOnInit() {
    this.profileService.getMyProfile().subscribe({
      next: (profile) => {
        this.profile.set(profile);
        this.auth.updateLocalUser({
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          address: profile.address,
          avatar: profile.avatarUrl
        });
      }
    });
  }

  editShopInfo() {
    this.router.navigate(['/my-shop'], {
      queryParams: { tab: 'edit-shop' }
    });
  }
}
