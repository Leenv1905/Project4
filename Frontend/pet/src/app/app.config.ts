import {ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
// SỬ DỤNG DIALOG
// import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
// SỬ DỤNG DIALOG
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // provideAnimations(),
    provideAnimationsAsync(),
    provideHttpClient(),
  ]
  // providers: [
  //   provideZoneChangeDetection({ eventCoalescing: true }),
  //   provideRouter(routes),
  //   provideAnimations(),
  //   provideHttpClient(),
  //   // MatDialogModule sẽ được import trong các component cần dùng
  // ]
};
