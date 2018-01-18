import { Component, OnInit } from '@angular/core';

import { TabBasic } from '../tabbasic';

import { WorkingSetService } from '../../../../providers/workingset.service';
import { WorkingSet, ScriptPatchTool } from 'nicassa-scriptpatch-tool';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit, TabBasic {
  sqlPreviewText: string;
  alreadyPatched = false;
  canBePatched = false;

  constructor(public service: WorkingSetService) {
    console.log('PreviewComponent ctor');
  }

  ngOnInit() {
    console.log('ngOnInit');
  }

  tabSelected() {
    console.log('PreviewComponent tabSelected');
    this.sqlPreviewText = '';
    this.alreadyPatched = false;
    this.canBePatched = false;

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
      if (output.alreadyPatched) {
        this.alreadyPatched = true;
      }

      this.sqlPreviewText = output.contentAfter; // content of the patched file

      if (!this.alreadyPatched) {
        this.canBePatched = (output.contentBefore !== output.contentAfter);
      }

    } catch (err) {
      this.sqlPreviewText = 'ERROR: ' + err;
    }
  }

  onSave() {
    console.log('onSave');
    if (this.alreadyPatched) {
      return;
    }
  }

  onSaveAs() {
    console.log('onSaveAs');
    if (this.alreadyPatched) {
      return;
    }
  }
}
