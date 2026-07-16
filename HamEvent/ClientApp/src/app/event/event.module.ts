import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { EventRoutingModule } from './event-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { QSOsComponent } from './qsos/qsos.component';
import { EventTopComponent } from './eventtop/eventtop.component';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatExpansionModule } from '@angular/material/expansion';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  imports: [EventRoutingModule, RouterModule, ReactiveFormsModule, NgxPaginationModule, CommonModule,
    TranslateModule.forChild(),
    FormsModule,
    FlexLayoutModule,
    MatTableModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatExpansionModule,
    MatDividerModule, DashboardComponent, QSOsComponent, EventTopComponent], // ResponsiveToolbarComponent],
    exports: [],
})
export class EventModule {
  constructor(private readonly router: Router) {
    router.events.subscribe(console.log);
  }
}
