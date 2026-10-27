import { ResponsiveToolbarComponent } from './responsive-toolbar/responsive-toolbar.component';
import { EventComponent } from './event.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { EventRoutingModule } from './event-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { QSOsComponent } from './qsos/qsos.component';
import { EventTopComponent } from './eventtop/eventtop.component';
import { RouterModule } from '@angular/router';
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
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { StatsComponent } from './stats/stats.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [],
  imports: [
    EventTopComponent,
    DashboardComponent,
    QSOsComponent,
    EventComponent,
    ResponsiveToolbarComponent,
    EventRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    CommonModule,
    TranslateModule.forChild(),
    FormsModule,
    FlexLayoutModule,
    MatTableModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatExpansionModule,
    MatDividerModule,
    MatTabsModule,
    MatProgressBarModule,
    // MatGridListModule, // Removed: not imported above
    RouterModule,
    MatIconModule,
    TranslateModule,
    FlexLayoutModule,
    // Standalone imports for ResponsiveToolbarComponent are handled in its own imports array
  ],
  exports: [],
})
export class EventModule {
  constructor() {}
}
