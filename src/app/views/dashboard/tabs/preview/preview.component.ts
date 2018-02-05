import swal from 'sweetalert2';

const { remote } = require('electron');
const { dialog } = require('electron').remote;

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
    this.createPreview();
  }

  onSave() {
    console.log('onSave');
    if (this.alreadyPatched) {
      return;
    }

    this.saveInternal(null);
  }

  onSaveAs() {
    console.log('onSaveAs');
    if (this.alreadyPatched) {
      return;
    }

    const fileName = this.showSaveDialog();
    this.saveInternal(fileName);
  }

  saveInternal(fileName: string) {
    console.log('saveInternal', fileName);
    if (this.alreadyPatched) {
      return;
    }

    let errtext: string = null;
    let warningtext: string = null;
    try {
      const result = ScriptPatchTool.run(this.service.ws, false, fileName);
      if (result.deadPatchSteps.length > 0) {
        warningtext = 'Patchstep';
        if (result.deadPatchSteps.length > 1) {
          warningtext += 's';
        }
        warningtext += ' ';
        let counter = 0;
        for (const stepNr of result.deadPatchSteps) {
          warningtext += (stepNr + 1);
          counter++;
          if (counter < result.deadPatchSteps.length) {
            warningtext += ', ';
          }
        }
        warningtext += ' did not create any changes.';
      }
    } catch (err) {
      errtext = err;
    }

    if (errtext) {
      swal({
        title: 'Error',
        text: errtext,
        type: 'warning',
        showCloseButton: true
      });
      return;
    }

    if (warningtext) {
      swal({
        title: 'Warning',
        text: warningtext,
        type: 'warning',
        showCloseButton: true
      });
    }
    this.createPreview();
  }

  private showSaveDialog(): string {
    console.log('showSaveDialog');

    const filters: any = this.getDialogFilters('sql');

    // https://github.com/electron/electron/blob/master/docs/api/dialog.md
    // https://github.com/electron/electron/issues/2525
    const result = dialog.showSaveDialog(
      remote.getCurrentWindow(),
      {
        // defaultPath: 'c:/',
        filters: filters,
      }
    );

    return result;
  }

  private createPreview() {
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

  private getDialogFilters(type: string): any {
    console.log('getDialogFilters', type);

    let filters: any = null;
    if (type === 'json') {
      filters = [
        { name: 'All Files', extensions: ['*'] },
        { name: 'Json', extensions: ['json'] },
      ];
    } else if (type === 'sql') {
      filters = [
        { name: 'All Files', extensions: ['*'] },
        { name: 'SQL', extensions: ['sql'] },
      ];
    }

    return filters;
  }
}
