import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule,
    DashboardRoutingModule,
    ChartsModule
  ],
  declarations: [ DashboardComponent ]
})
export class DashboardModule { }
