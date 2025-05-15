import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { EventsComponent } from './events/events.component';
import { AdminQSOsComponent } from './adminqsos/adminqsos.component';
import { AdminEventComponent } from './adminevent/adminevent.component';
import { UploadComponent } from './upload/upload.component';
import { SanitizedHtmlPipe } from './sanitized-html.pipe';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from "@angular/material/menu";
import { MatDividerModule } from "@angular/material/divider";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LanguageSelectorComponent } from './language-selector/language-selector.component';
import { EventCardComponent } from './event-card/event-card.component';
import { FooterComponent } from './footer/footer.component'; // Import the new footer component

import { ResponsiveToolbarComponent } from './event/responsive-toolbar/responsive-toolbar.component';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),

    NavMenuComponent,
    HomeComponent,
    EventsComponent,
    AdminQSOsComponent,
    AdminEventComponent,
    UploadComponent,
    SanitizedHtmlPipe,
    LanguageSelectorComponent,
    EventCardComponent,
    FooterComponent, // Declare the new footer component

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
    NgxPaginationModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'events', component: EventsComponent },
      {
        path: 'event',
        loadChildren: () => import('./event/event.module').then((m) => m.EventModule),
      },
      //{ path: ':id/top', component: EventTopComponent, pathMatch: 'full' },
      //{ path: ':id/live', component: DashboardComponent, pathMatch: 'full' },
      //{ path: ':id/:secret/edit', component: AdminEventComponent, pathMatch: 'full' },
      //{ path: ':id/:secret', component: AdminQSOsComponent, pathMatch: 'full' },
      //{ path: ':id', component: QSOsComponent, pathMatch: 'full' },
      //{ path: 'backoffice', children: [...eventRoutes] },
      //{ path: "**", redirectTo: "/" },
    ])
  ],
  providers: [],
  //exports: [SanitizedHtmlPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }

//@NgModule({ declarations: [
//        AppComponent,
//        NavMenuComponent,
//        HomeComponent,
//        QSOsComponent,
//        EventsComponent,
//        EventTopComponent,
//        DashboardComponent,
//        AdminQSOsComponent,
//        AdminEventComponent,
//        UploadComponent,
//        SanitizedHtmlPipe
//    ],
//    exports: [SanitizedHtmlPipe],
//    bootstrap: [AppComponent], imports: [BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
//        TranslateModule.forRoot({
//            defaultLanguage: 'en',
//            loader: {
//                provide: TranslateLoader,
//                useFactory: (createTranslateLoader),
//                deps: [HttpClient]
//            }
//        }),
//        NgxPaginationModule,
//        FormsModule,
//        ReactiveFormsModule,
//        RouterModule.forRoot([
//            { path: 'Home', component: HomeComponent, pathMatch: 'full' },
//            { path: '', component: EventsComponent, pathMatch: 'full' },
//            { path: 'Events', component: EventsComponent, pathMatch: 'full' },
//            { path: ':id/top', component: EventTopComponent, pathMatch: 'full' },
//            { path: ':id/live', component: DashboardComponent, pathMatch: 'full' },
//            { path: ':id/:secret/edit', component: AdminEventComponent, pathMatch: 'full' },
//            { path: ':id/:secret', component: AdminQSOsComponent, pathMatch: 'full' },
//            { path: ':id', component: QSOsComponent, pathMatch: 'full' },
//        ])], providers: [provideHttpClient(withInterceptorsFromDi())] })
//export class AppModule { }

//@NgModule({
//    declarations: [AppComponent],
//    imports: [
//        BrowserAnimationsModule,
//        BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
//        TranslateModule.forRoot({
//            defaultLanguage: 'en',
//            loader: {
//                provide: TranslateLoader,
//                useFactory: (createTranslateLoader),
//                deps: [HttpClient]
//            }
//        }),
//        EventModule,
//        MatIconModule,
//        MatToolbarModule,
//        MatButtonModule,
//        MatOptionModule,
//        MatSelectModule,
//        MatFormFieldModule,
//        MatTableModule,
//        MatCardModule,
//        MatMenuModule,
//        MatDividerModule,
//        FlexLayoutModule,
//        MatExpansionModule,
//        MatGridListModule,
//        MatTooltipModule,
//        NgxPaginationModule,
//        FormsModule,
//        ReactiveFormsModule,
//        RouterModule.forRoot([
//            { path: 'events', component: EventsComponent },
//            //{ path: ':id', component: QSOsComponent, pathMatch: 'full' },
//            //{ path: ':id/top', component: EventTopComponent, pathMatch: 'full' },
//            //{ path: ':id/live', component: DashboardComponent, pathMatch: 'full' },
//            //{ path: ':id/:secret/edit', component: AdminEventComponent, pathMatch: 'full' },
//            //{ path: ':id/:secret', component: AdminQSOsComponent, pathMatch: 'full' },
//            //{
//            //  path: 'event',
//            //  loadChildren: () =>
//            //    import('./event/event.module').then((m) => m.EventModule),
//            //},
//            //{
//            //  path: 'event/:id',
//            //  component: EventComponent,
//            //  children: [
//            //    //{ path: ':id/home' },
//            //    //{ path: 'live', component: DashboardComponent, pathMatch: 'full' },
//            //    //{ path: 'top', component: EventTopComponent},
//            //    //{ path: ':id/:secret', outlet: 'event-det', component: AdminQSOsComponent, pathMatch: 'full' }
//            //  ]
//            //},
//            //{ path: 'event/:id/qsos', component: QSOsComponent },
//            //{ path: 'event/:id/top', component: EventTopComponent, pathMatch: 'full'},
//          { path: '', component: HomeComponent, pathMatch: 'full' },
//          { path: 'test', component: NavMenuComponent, pathMatch: 'full' },
//            { path: "**", redirectTo: "/" },
//            { path: 'Home', component: HomeComponent, pathMatch: 'full' },
//            { path: '', component: EventsComponent, pathMatch: 'full' },
//            { path: 'Events', component: EventsComponent, pathMatch: 'full' },
//            //{ path: ':id/top', component: EventTopComponent, pathMatch: 'full' },
//            //{ path: ':id/live', component: DashboardComponent, pathMatch: 'full' },
//            { path: ':id/:secret/edit', component: AdminEventComponent, pathMatch: 'full' },
//            { path: ':id/:secret', component: AdminQSOsComponent, pathMatch: 'full' },
//            //{ path: ':id', component: QSOsComponent, pathMatch: 'full' },
//        ]),
//        NavMenuComponent,
//        HomeComponent,
//        EventsComponent,
//        EventComponent,
//        ResponsiveToolbarComponent,
//        AdminQSOsComponent,
//        AdminEventComponent,
//        UploadComponent,
//        SanitizedHtmlPipe,
//        LanguageSelectorComponent,
//        EventCardComponent
//    ],
//    providers: [provideHttpClient(withInterceptorsFromDi())],
//    exports: [SanitizedHtmlPipe],
//    bootstrap: [AppComponent]
//})
//export class AppModule { }

//@NgModule({ declarations: [
//        //QSOsComponent,
//        //EventTopComponent,
//        //DashboardComponent,
//    ],
//  imports: [
//        RouterModule.forRoot([
//            { path: 'Home', component: HomeComponent, pathMatch: 'full' },
//            { path: '', component: EventsComponent, pathMatch: 'full' },
//            { path: 'Events', component: EventsComponent, pathMatch: 'full' },
//            { path: ':id/top', component: EventTopComponent, pathMatch: 'full' },
//            { path: ':id/live', component: DashboardComponent, pathMatch: 'full' },
//            { path: ':id/:secret/edit', component: AdminEventComponent, pathMatch: 'full' },
//            { path: ':id/:secret', component: AdminQSOsComponent, pathMatch: 'full' },
//            { path: ':id', component: QSOsComponent, pathMatch: 'full' },
//        ])], providers: [provideHttpClient(withInterceptorsFromDi())] })
