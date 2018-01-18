import { Component, OnInit } from '@angular/core';

import { TabBasic } from '../tabbasic';

import { WorkingSetService } from '../../../../providers/workingset.service';
import { WorkingSet, ScriptPatchTool } from 'nicassa-scriptpatch-tool';

@Component({
  selector: 'app-sqlfile',
  templateUrl: './sqlfile.component.html',
  styleUrls: ['./sqlfile.component.scss']
})
export class SqlfileComponent implements OnInit, TabBasic {
  sqlText: string;

  constructor(public service: WorkingSetService) {
    console.log('SqlfileComponent ctor');
  }

  ngOnInit() {
    console.log('ngOnInit');
  }

  tabSelected() {
    console.log('SqlfileComponent tabSelected');
    this.sqlText = '';

    if (this.service.ws == null || this.service.ws.scriptPatch == null || this.service.ws.scriptPatch === undefined) {
      return;
    }

    if (this.service.ws.scriptPatch.sqlFileName == null ||
        this.service.ws.scriptPatch.sqlFileName === undefined ||
        this.service.ws.scriptPatch.sqlFileName.trim() === '') {
      return;
    }

    const clone: WorkingSet = JSON.parse(JSON.stringify(this.service.ws));
    clone.scriptPatch.stepList = [];

    try {
      const output = ScriptPatchTool.preview(clone);
      this.sqlText = output.contentBefore; // content of the SQL file
    } catch (err) {
      this.sqlText = 'ERROR: ' + err;
    }

  }

}
