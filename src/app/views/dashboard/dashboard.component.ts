import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { WorkingSetService } from '../../providers/workingset.service';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent {
  currentTab: any;
  tabs = [
    {
      active: true
    },
    {
      active: false
    },
    {
      active: false
    },
    {
      active: false
    },
    {
      active: false
    }
  ];

  constructor(public service: WorkingSetService) {
    console.log('DashboardComponent ctor');
    this.currentTab = this.tabs[0];

    this.service.wsChanged.subscribe(
      (ws: any) => {
        this.tabs[0].active = true;
      });
  }

  tabSelected(tab, selected) {
    this.currentTab.active = false;
    tab.active = selected;
    this.currentTab = tab;
  }

}
