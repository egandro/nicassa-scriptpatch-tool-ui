const fs = require('fs');
const path = require('path');

import { Injectable, EventEmitter, Output } from '@angular/core';
import { WorkingSet, PatchStepType, PatchStep, ScriptPatch, ScriptPatchTool } from 'nicassa-scriptpatch-tool';


@Injectable()
export class WorkingSetService {
  ws: WorkingSet;
  oldData: string;
  clipboard: PatchStep;
  @Output() wsChanged: EventEmitter<WorkingSet> = new EventEmitter();

  constructor() {
    console.log('WorkingSetService ctor');
  }

  newWorkingSet() {
    console.log('newWorkingSet');

    this.ws = {
      fileName: '',
      scriptPatch: this.createScriptPatch()
    }
    this.wsChanged.emit(this.ws);
    this.clipboard = null;
    this.oldData = JSON.stringify(this.ws);
  }

  isModified(): boolean {
    console.log('needSave');

    if (this.oldData == null || this.oldData === undefined) {
      return false;
    }
    if (this.ws == null || this.ws === undefined) {
      return false;
    }

    const data = JSON.stringify(this.ws);
    const result = this.oldData !== data;

    return result;
  }

  save(): string {
    console.log('save');

    let result = null;
    if (this.ws == null || this.ws === undefined) {
      result = 'No workingset!';
      return result;
    }

    try {
      ScriptPatchTool.save(this.ws);
      this.oldData = JSON.stringify(this.ws);
    } catch (err) {
      result = err;
    }

    return result;
  }

  saveAs(fileName: string): string {
    console.log('saveAs', fileName);

    let result = null;
    if (this.ws == null || this.ws === undefined) {
      this.ws = {
        fileName: fileName,
        scriptPatch: this.createScriptPatch()
      }
    } else {
      this.ws.fileName = fileName;
    }
    this.oldData = JSON.stringify(this.ws);

    try {
      ScriptPatchTool.save(this.ws);
    } catch (err) {
      result = err;
    }

    return result;
  }

  load(fileName: string): string {
    console.log('load', fileName);

    let result = null;
    this.ws = null
    this.oldData = null;
    this.clipboard = null;

    try {
      this.ws = ScriptPatchTool.load(fileName);
      this.wsChanged.emit(this.ws);
      this.oldData = JSON.stringify(this.ws);
    } catch (err) {
      result = err;
    }

    return result;
  }

  addStep(parentStep: PatchStep): PatchStep {
    console.log('addStep');

    if (this.ws == null || this.ws === undefined || this.ws.scriptPatch == null) {
      return null;
    }

    const result: PatchStep = {
      comment: '<PatchStep>',
      stepType: PatchStepType.STEP_INSERT_ON_TOP_OF_FILE,
      searchText: null,
      replaceText: null,
      active: true
    }

    if (this.ws.scriptPatch.stepList == null || this.ws.scriptPatch.stepList.length === 0) {
      this.ws.scriptPatch.stepList.push(result);
    } else {
      const index = this.ws.scriptPatch.stepList.indexOf(parentStep);
      if (index < 0) {
        this.ws.scriptPatch.stepList.push(result);
      } else {
        this.ws.scriptPatch.stepList.splice(index + 1, 0, result);
      }
    }

    return result;
  }

  deleteStep(step: PatchStep): PatchStep {
    console.log('deleteStep');

    if (this.ws == null || this.ws === undefined || this.ws.scriptPatch == null) {
      return null;
    }

    if (this.ws.scriptPatch.stepList == null || this.ws.scriptPatch.stepList.length === 0) {
      return null;
    }

    let index = this.ws.scriptPatch.stepList.indexOf(step);
    if (index > -1) {
      this.ws.scriptPatch.stepList.splice(index, 1);
    }
    if (index > this.ws.scriptPatch.stepList.length - 1) {
      index--;
    }

    if (index > -1) {
      return this.ws.scriptPatch.stepList[index];
    }

    return null;
  }

  copyStep(step: PatchStep) {
    console.log('copyStep');

    if (step == null || step === undefined) {
      return;
    }

    this.clipboard = JSON.parse(JSON.stringify(step));
  }

  pasteStep(step: PatchStep): PatchStep {
    console.log('pasteStep');

    if (this.ws == null || this.ws === undefined || this.ws.scriptPatch == null || this.clipboard == null) {
      return null;
    }

    if (this.ws.scriptPatch.stepList == null || this.ws.scriptPatch.stepList.length === 0) {
      return null;
    }

    const clone = JSON.parse(JSON.stringify(this.clipboard));

    let result: PatchStep = null;
    if (this.ws.scriptPatch.stepList == null || this.ws.scriptPatch.stepList.length === 0) {
      this.ws.scriptPatch.stepList.push(clone);
      result = this.ws.scriptPatch.stepList[this.ws.scriptPatch.stepList.length - 1];
    } else {
      const index = this.ws.scriptPatch.stepList.indexOf(step);
      if (index < 0) {
        this.ws.scriptPatch.stepList.push(clone);
        result = this.ws.scriptPatch.stepList[this.ws.scriptPatch.stepList.length - 1];
      } else {
        this.ws.scriptPatch.stepList.splice(index + 1, 0, clone);
        result = this.ws.scriptPatch.stepList[index + 1];
      }
    }

    return result;
  }

  moveUpStep(step: PatchStep): PatchStep {
    console.log('moveUpStep');

    if (this.ws == null || this.ws === undefined || this.ws.scriptPatch == null) {
      return null;
    }

    if (this.ws.scriptPatch.stepList == null || this.ws.scriptPatch.stepList.length === 0) {
      return null;
    }

    const index = this.ws.scriptPatch.stepList.indexOf(step);
    if (index < 1) { // -1 or 0 (not found or head)
      return step;
    }

    this.ws.scriptPatch.stepList.splice(index, 1);
    this.ws.scriptPatch.stepList.splice(index - 1, 0, step);

    return step;
  }

  moveDownStep(step: PatchStep): PatchStep {
    console.log('moveDownStep');

    if (this.ws == null || this.ws === undefined || this.ws.scriptPatch == null) {
      return null;
    }

    if (this.ws.scriptPatch.stepList == null || this.ws.scriptPatch.stepList.length === 0) {
      return null;
    }

    const index = this.ws.scriptPatch.stepList.indexOf(step);
    if (index < 0 || index === this.ws.scriptPatch.stepList.length - 1) { // not found or end
      return step;
    }

    this.ws.scriptPatch.stepList.splice(index, 1);
    this.ws.scriptPatch.stepList.splice(index + 1, 0, step);

    return step;
  }


  private createScriptPatch(): ScriptPatch {
    console.log('createScriptPatch');

    const patchStep: PatchStep = {
      comment: '<PatchStep>',
      stepType: PatchStepType.STEP_INSERT_ON_TOP_OF_FILE,
      searchText: null,
      replaceText: null,
      active: true
    }

    const result: ScriptPatch = {
      sqlFileName: '',
      relativePath: true,
      comment: '',
      createBranding: true,
      stepList: [patchStep]
    }
    return result;
  }
}

