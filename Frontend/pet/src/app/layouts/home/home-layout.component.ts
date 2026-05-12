import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from '../../shared/home-components/for-layouts/header/header.component';
import { FooterComponent } from '../../shared/home-components/for-layouts/footer/footer.component';
import { FooterBottomComponent } from '../../shared/home-components/for-layouts/footer/footer-bottom.component';
import { UserModalComponent } from '../../shared/home-components/for-layouts/user-modal/user-modal.component';

@Component({
  standalone: true,
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    MatToolbarModule,
    HeaderComponent,
    FooterComponent,
    FooterBottomComponent,
    UserModalComponent
  ],
  templateUrl: './home-layout.component.html'
})
export class HomeLayoutComponent {}
