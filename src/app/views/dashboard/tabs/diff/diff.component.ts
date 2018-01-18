import { Component, OnInit } from '@angular/core';

import { TabBasic } from '../tabbasic';

import { WorkingSetService } from '../../../../providers/workingset.service';
import { WorkingSet, ScriptPatchTool } from 'nicassa-scriptpatch-tool';

@Component({
  selector: 'app-diff',
  templateUrl: './diff.component.html',
  styleUrls: ['./diff.component.scss']
})
export class DiffComponent implements OnInit, TabBasic {
  sqlText: string;
  sqlPreviewText: string;

  constructor(public service: WorkingSetService) {
    console.log('DiffComponent ctor');
  }

  ngOnInit() {
    console.log('ngOnInit');
  }

  tabSelected() {
    console.log('DiffComponent tabSelected');

    this.sqlText = '';
    this.sqlPreviewText = '';

    if (this.service.ws == null || this.service.ws.scriptPatch == null || this.service.ws.scriptPatch === undefined) {
      return;
    }

    if (this.service.ws.scriptPatch.sqlFileName == null ||
        this.service.ws.scriptPatch.sqlFileName === undefined ||
        this.service.ws.scriptPatch.sqlFileName.trim() === '') {
      return;
    }

    const clone: WorkingSet = JSON.parse(JSON.stringify(this.service.ws));

    try {
      const output = ScriptPatchTool.preview(clone);
      this.sqlText = output.contentBefore; // content of the SQL file
      this.sqlPreviewText = output.contentAfter; // content of the patched file
    } catch (err) {
      this.sqlText = 'ERROR: ' + err;
      this.sqlPreviewText = this.sqlText;
    }
  }

}
