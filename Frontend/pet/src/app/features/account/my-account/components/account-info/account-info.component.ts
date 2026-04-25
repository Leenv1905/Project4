import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth.service';
import { UserProfile, UserProfileService } from '../../../../../core/services/user-profile.service';

@Component({
  standalone: true,
  selector: 'app-account-info',
  imports: [CommonModule],
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss']
})
export class AccountInfoComponent implements OnInit {
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

  editProfile() {
    this.router.navigate(['/account'], {
      queryParams: { tab: 'edit' }
    });
  }

  getMaskedPassword(): string {
    return '**********';
  }
}
