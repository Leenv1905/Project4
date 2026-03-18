import { Component } from '@angular/core';
import { GalleryBookComponent } from '../../shared/home-components/for-features/gallery-book/gallery-book.component';
import { CompanyServicesComponent } from '../../shared/home-components/for-features/company-services/company-services.component';
import { FeaturedProductsComponent } from '../../shared/home-components/for-features/featured-products/featured-products.component';
// import { LimitedOfferComponent } from '../../shared/components/limited-offer/limited-offer.component';
// import { ProductSectionComponent} from '../../shared/components/product-section/product-section.component';
// import { CategoriesSectionComponent } from '../../shared/components/categories-section/categories-section.component';
// import { CustomerReviewsSliderComponent } from '../../shared/components/customer-reviews-slider/customer-reviews-slider.component';
// import { LatestPostsComponent } from '../../shared/components/latest-posts/latest-posts.component';
// import { InstagramGalleryComponent } from '../../shared/components/instagram-gallery/instagram-gallery.component';

@Component({
  standalone: true,
  selector: 'app-home-page',
  imports: [
    GalleryBookComponent,
    CompanyServicesComponent,
    FeaturedProductsComponent,
    // LimitedOfferComponent,
    // ProductSectionComponent,
    // CategoriesSectionComponent,
    // CustomerReviewsSliderComponent,
    // LatestPostsComponent,
    // InstagramGalleryComponent
    // các section khác sẽ import sau
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage {}
