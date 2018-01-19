import { Component, OnInit } from '@angular/core';

import { TabBasic } from '../tabbasic';

import { WorkingSetService } from '../../../../providers/workingset.service';
import { PatchStep, WorkingSet, PatchStepType } from 'nicassa-scriptpatch-tool';

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.scss']
})
export class StepsComponent implements OnInit, TabBasic {
  selectedStep: PatchStep;
  selectedStepIndex = 0;
  searchVisible = false;
  replaceVisible = false;

  constructor(public service: WorkingSetService) {
    console.log('StepsComponent ctor');
  }

  ngOnInit() {
    console.log('ngOnInit');
    this.service.wsChanged.subscribe(
      (ws: WorkingSet) => {
        if (ws.scriptPatch &&
          ws.scriptPatch.stepList &&
          ws.scriptPatch.stepList.length > 0) {
          this.setSelectedStep(ws.scriptPatch.stepList[0]);
        }
      });
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

  onRowClicked(step: PatchStep) {
    console.log('onRowClicked');
    this.setSelectedStep(step);
  }

  onStepActiveToogled(step: PatchStep) {
    console.log('onStepActiveToogled');
    step.active = !step.active;
    this.setSelectedStep(step);
  }

  setSelectedStep(step: PatchStep) {
    console.log('setSelectedStep');
    this.selectedStep = step;
    this.selectedStepIndex = this.service.ws.scriptPatch.stepList.indexOf(step);

    switch (Number(step.stepType)) {
      case PatchStepType.STEP_DELETE_TEXT:
      case PatchStepType.STEP_INSERT_ON_TOP_OF_FILE:
      case PatchStepType.STEP_APPEND_TO_END_OF_FILE:
        this.searchVisible = true;
        this.replaceVisible = false;
        break;
      case PatchStepType.STEP_REPLACE_TEXT:
      case PatchStepType.STEP_INSERT_BEFORE_TEXT:
      case PatchStepType.STEP_INSERT_AFTER_TEXT:
        this.searchVisible = true;
        this.replaceVisible = true;
        break;
      case PatchStepType.STEP_TYPE_EMPTY:
        this.searchVisible = false;
        this.replaceVisible = false;
        break;
      default:
        console.log('default', step.stepType);
    }

  }

}
