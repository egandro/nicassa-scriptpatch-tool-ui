const fs = require('fs');
const path = require('path');

import { Injectable, EventEmitter, Output } from '@angular/core';
import { WorkingSet, PatchStepType, PatchStep, ScriptPatch, ScriptPatchTool } from 'nicassa-scriptpatch-tool';


@Injectable()
export class WorkingSetService {
  ws: WorkingSet;
  oldData: string;
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
    this.oldData = JSON.stringify(this.ws);
    this.wsChanged.emit(this.ws);
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
      this.oldData = JSON.stringify(this.ws);
    }

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

    try {
      this.ws = ScriptPatchTool.load(fileName);
      this.oldData = JSON.stringify(this.ws);
    } catch (err) {
      result = err;
    }

    return result;
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

