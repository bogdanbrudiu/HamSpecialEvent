import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { EventsComponent } from './events/events.component';
import { EventTopComponent } from './eventtop/eventtop.component';

import { EventCardComponent } from './event-card/event-card.component';
import { FooterComponent } from './footer/footer.component'; // Import the new footer component
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from "@angular/material/menu";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { provideAnimations } from '@angular/platform-browser/animations';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({ declarations: [
        AppComponent,
        EventTopComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
        TranslateModule.forRoot({
            defaultLanguage: 'en',
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
      NgxPaginationModule,
      NavMenuComponent,
      FooterComponent,
      EventCardComponent,
      MatIconModule,
      MatToolbarModule,
      MatButtonModule,
      MatOptionModule,
      MatSelectModule,
      MatFormFieldModule,
      MatTableModule,
      MatMenuModule,
      MatDividerModule,
      FlexLayoutModule,
      MatExpansionModule,
      MatGridListModule,
      MatTooltipModule,
      HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot([
            { path: '', component: HomeComponent, pathMatch: 'full' },
            { path: 'events', component: EventsComponent, pathMatch: 'full' },
            { path: 'recover', loadComponent: () => import('./recovery/recovery.component').then(m => m.RecoveryComponent) },
          {
            path: 'event',
            loadChildren: () => import('./event/event.module').then((m) => m.EventModule),
          },
          {
            path: 'admin',
            loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
          },
        ])], providers: [ provideAnimations(), provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
