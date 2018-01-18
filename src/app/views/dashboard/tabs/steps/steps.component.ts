import { Component, OnInit } from '@angular/core';

import { TabBasic } from '../tabbasic';

import { WorkingSetService } from '../../../../providers/workingset.service';

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.scss']
})
export class StepsComponent implements OnInit, TabBasic {

  constructor(public service: WorkingSetService) {
    console.log('StepsComponent ctor');
  }

  ngOnInit() {
    console.log('ngOnInit');
  }

  tabSelected() {
    console.log('StepsComponent tabSelected');
  }

  onAddStep() {
    console.log('onAddStep');
  }

  onDeleteStep() {
    console.log('onDeleteStep');
  }

  onCopyStep() {
    console.log('onCopyStep');
  }

  onPasteStep() {
    console.log('onPasteStep');
  }

  onMoveUpStep() {
    console.log('onMoveUpStep');
  }

  onMoveDownStep() {
    console.log('onMoveDownStep');
  }


}
