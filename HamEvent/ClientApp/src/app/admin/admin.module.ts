// src/app/admin/admin.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminHomeComponent } from './admin-home.component';
import { AdminGuard } from './admin.guard';
import { TranslateModule } from '@ngx-translate/core';
import { AdminEventComponent } from './adminevent/adminevent.component';
import { AdminQSOsComponent } from './adminqsos/adminqsos.component';
import { AdminLoginComponent } from './admin-login.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

const routes: Routes = [
  {
    path: 'login',
    component: AdminLoginComponent
  },
  {
    path: ':secret',
    component: AdminHomeComponent,
    canActivate: [AdminGuard]
  },
  {
    path: '',
    component: AdminHomeComponent,
    canActivate: [AdminGuard],
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
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule.forChild(), MatButtonModule, MatTableModule, FormsModule],
  declarations: [AdminHomeComponent, AdminLoginComponent],
  providers: [AdminGuard]
})
export class AdminModule { }
