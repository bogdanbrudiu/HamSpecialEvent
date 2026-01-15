// src/app/admin/admin.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomeComponent } from './admin-home.component';
import { AdminGuard } from './admin.guard';
import { TranslateModule } from '@ngx-translate/core';
import { AdminEventComponent } from './adminevent/adminevent.component';
import { AdminQSOsComponent } from './adminqsos/adminqsos.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

const routes: Routes = [
  {
    path: '',
    component: AdminHomeComponent,
    canActivate: [AdminGuard],
    children: [
      // Add more admin routes here, all protected by AdminGuard
    //  { path: ':id/edit', component: AdminEventComponent},
    //  { path: ':id/qsos', component: AdminQSOsComponent},
    ]
  },
  {
    path: ':id/:secret/edit',
    component: AdminEventComponent,
    canActivate: [AdminGuard]
  },
  {
    path: ':id/:secret/qsos',
    component: AdminQSOsComponent,
    canActivate: [AdminGuard]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule.forChild(), MatButtonModule, MatTableModule],
  declarations: [AdminHomeComponent],
  providers: [AdminGuard]
})
export class AdminModule { }
