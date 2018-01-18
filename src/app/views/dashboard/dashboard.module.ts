import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ChartsModule } from 'ng2-charts/ng2-charts';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { InfoComponent } from './tabs/info/info.component';
import { StepsComponent } from './tabs/steps/steps.component';
import { SqlfileComponent } from './tabs/sqlfile/sqlfile.component';
import { PreviewComponent } from './tabs/preview/preview.component';
import { DiffComponent } from './tabs/diff/diff.component';

import { WorkingSetService } from '../../providers/workingset.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule,
    DashboardRoutingModule,
    ChartsModule
  ],
  declarations: [
    InfoComponent,
    StepsComponent,
    SqlfileComponent,
    PreviewComponent,
    DiffComponent,
    DashboardComponent
  ],
  providers: [
    WorkingSetService
  ],
})
export class DashboardModule { }
