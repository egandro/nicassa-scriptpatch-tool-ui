const { remote } = require('electron');
const { fs } = remote.require('fs');
const { path } = remote.require('path');

import { Injectable, EventEmitter, Output } from '@angular/core';
import { WorkingSet, ScriptPatch, ScriptPatchTool, IOAbstraction } from 'nicassa-scriptpatch-tool';

@Injectable()
export class WorkingSetService {
  ws: WorkingSet;
  oldData: string;
  io: IOAbstraction = new ElectronAbstraction();
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

  needSave(): boolean {
    console.log('needSave');

    if (this.oldData == null || this.oldData === undefined) {
      return false;
    }
    if (this.ws == null || this.ws === undefined) {
      return false;
    }

    const data = JSON.stringify(this.ws);
    const result = this.oldData === data;
    return result;
  }

  save(): string {
    console.log('save');

    let result = '';
    if (this.ws == null || this.ws === undefined) {
      result = 'No workingset!';
      return result;
    }

    try {
      ScriptPatchTool.save(this.ws, this.io);
    } catch (err) {
      result = err;
    }

    return result;
  }

  saveAs(fileName: string): string {
    console.log('saveAs', fileName);

    let result = '';
    if (this.ws == null || this.ws === undefined) {
      this.ws = {
        fileName: fileName,
        scriptPatch: this.createScriptPatch()
      }
      this.oldData = JSON.stringify(this.ws);
    }

    try {
      ScriptPatchTool.save(this.ws, this.io);
    } catch (err) {
      result = err;
    }

    return result;
  }

  load(fileName: string): string {
    console.log('load', fileName);

    let result = '';
    this.ws = null
    this.oldData = null;

    try {
      this.ws = ScriptPatchTool.load(fileName, this.io);
      this.oldData = JSON.stringify(this.ws);
    } catch (err) {
      result = err;
    }

    return result;
  }


  private createScriptPatch(): ScriptPatch {
    console.log('createScriptPatch');

    const result: ScriptPatch = {
      sqlFileName: '',
      relativePath: true,
      comment: '',
      createBranding: true,
      stepList: []
    }
    return result;
  }
}

class ElectronAbstraction implements IOAbstraction {
  public readFileSync(fileName: string, encoding: string): string {
    return fs.readFileSync(fileName, encoding);
  }

  public writeFileSync(fileName: string, data: any, encoding: string): void {
    return fs.writeFileSync(fileName, data, { encoding: encoding });
  }

  public normalize(fileName: string): string {
    return path.normalize(fileName);
  }

  public dirname(fileName: string): string {
    return path.dirname(fileName);
  }

  public existsSync(fileName: string): boolean {
    return fs.existsSync(fileName);
  }
}
