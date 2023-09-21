import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { QSOsComponent } from './qsos/qsos.component';
import { EventsComponent } from './events/events.component';
import { EventTopComponent } from './eventtop/eventtop.component';

import { AdminQSOsComponent } from './adminqsos/adminqsos.component';
import { AdminEventComponent } from './adminevent/adminevent.component';
import { UploadComponent } from './upload/upload.component';
import { SanitizedHtmlPipe } from './sanitized-html.pipe';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    QSOsComponent,
    EventsComponent,
    EventTopComponent,
    AdminQSOsComponent,
    AdminEventComponent,
    UploadComponent,
    SanitizedHtmlPipe
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    NgxPaginationModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'Events', component: EventsComponent, pathMatch: 'full' },
      { path: ':id/top', component: EventTopComponent, pathMatch: 'full' },
      { path: ':id/:secret/edit', component: AdminEventComponent, pathMatch: 'full' },
      { path: ':id/:secret', component: AdminQSOsComponent, pathMatch: 'full' },

      { path: ':id', component: QSOsComponent, pathMatch: 'full' },
    ])
  ],
  providers: [],
  exports: [SanitizedHtmlPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
