import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//import { CustomerListComponent } from './customer-list/customer-list.component';
import { EventComponent } from './event.component';
import { QSOsComponent } from './qsos/qsos.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EventTopComponent } from './eventtop/eventtop.component';
//import { TestComponent } from './test/test.component';

const eventRoutes: Routes = [
  {
    path: ':id',
    component: EventComponent,
  },
  {
    path: ":id/logs",
    component: QSOsComponent,
    title: "routing: Logs"
  },
  {
    path: ":id/top",
    component: EventTopComponent,
    title: "routing: Top"
  },
  {
    path: '',
    pathMatch: 'full',
    component: EventComponent,
  },
];
const routes: Routes = [
  {
    path: '',
    component: EventComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },

      {
        path: "dashboard",
        component: DashboardComponent,
        title: "routing: Dashboard"
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(eventRoutes)],
  exports: [RouterModule]
})
export class EventRoutingModule {
  //constructor() {
  //  console.log("MODULE EVENT");
  //  console.log(this);
  //}
}
