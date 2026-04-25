import { Component } from '@angular/core';
import { GalleryBookComponent } from '../../shared/home-components/for-features/gallery-book/gallery-book.component';
import { CompanyServicesComponent } from '../../shared/home-components/for-features/company-services/company-services.component';
import { FeaturedProductsComponent } from '../../shared/home-components/for-features/featured-products/featured-products.component';
import { LimitedOfferComponent } from '../../shared/home-components/for-features/limited-offer/limited-offer.component';
import { ProductSectionComponent} from '../../shared/home-components/for-features/product-section/product-section.component';
import { CategoriesSectionComponent } from '../../shared/home-components/for-features/categories-section/categories-section.component';
import { CustomerReviewsSliderComponent } from '../../shared/home-components/for-features/customer-reviews-slider/customer-reviews-slider.component';
import { LatestPostsComponent } from '../../shared/home-components/for-features/latest-posts/latest-posts.component';
import { InstagramGalleryComponent } from '../../shared/home-components/for-features/instagram-gallery/instagram-gallery.component';
import { inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { SurveyModalComponent } from './components/survey-modal/survey-modal.component';

@Component({
  standalone: true,
  selector: 'app-home-page',
  imports: [
    GalleryBookComponent,
    CompanyServicesComponent,
    FeaturedProductsComponent,
    LimitedOfferComponent,
    ProductSectionComponent,
    CategoriesSectionComponent,
    CustomerReviewsSliderComponent,
    LatestPostsComponent,
    InstagramGalleryComponent
    // các section khác sẽ import sau
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
  dialog = inject(MatDialog);
  auth = inject(AuthService);
  http = inject(HttpClient);

  ngOnInit() {
    this.checkProfile();
  }

  private checkProfile() {
    this.auth.loadCurrentUser().subscribe({
      next: (user) => {
        if (!user) {
          return;
        }

        this.http.get<any>('http://localhost:8080/gupet/api/v1/buyer-profiles/me', { withCredentials: true })
          .subscribe({
            next: (res) => {
              if (!res || !res.data) {
                this.showSurvey();
              }
            },
            error: (error: HttpErrorResponse) => {
              if (error.status !== 401) {
                this.showSurvey();
              }
            }
          });
      }
    });
  }

  private showSurvey() {
    this.dialog.open(SurveyModalComponent, {
      width: '500px',
      disableClose: true
    });
  }
}
