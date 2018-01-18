import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { WorkingSetService } from '../../providers/workingset.service';

import { TabBasic } from './tabs/tabbasic';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  @ViewChild('tabContent0') tabContent0: TabBasic;
  @ViewChild('tabContent1') tabContent1: TabBasic;
  @ViewChild('tabContent2') tabContent2: TabBasic;
  @ViewChild('tabContent3') tabContent3: TabBasic;
  @ViewChild('tabContent4') tabContent4: TabBasic;

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
        this.tabContent0.tabSelected();
      });
  }

  ngOnInit() {
    console.log('ngOnInit');
    this.tabs[0].active = true;
    this.tabContent0.tabSelected();
  }

  tabSelected(index: number) {
    this.currentTab.active = false;
    this.tabs[index].active = true;
    this.currentTab = this.tabs[index];

    switch (index) {
      case 0:
        this.tabContent0.tabSelected();
        break;
      case 1:
        this.tabContent1.tabSelected();
        break;
      case 2:
        this.tabContent2.tabSelected();
        break;
      case 3:
        this.tabContent3.tabSelected();
        break;
      case 4:
        this.tabContent4.tabSelected();
        break;
    }

  }

}
