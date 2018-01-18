import swal from 'sweetalert2';

const path = require('path');

const { remote } = require('electron');
const { dialog } = require('electron').remote;

import { Component, OnInit } from '@angular/core';

import { TabBasic } from '../tabbasic';

import { WorkingSetService } from '../../../../providers/workingset.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit, TabBasic {
  fileName = '';

  constructor(public service: WorkingSetService) {
    console.log('InfoComponent ctor');
  }

  ngOnInit() {
    console.log('ngOnInit');
    console.log('command line args', process.argv);

    if (process.argv.length > 0) {
      const fileName = process.argv[0];
      this.loadScriptPatchFile(fileName);
    }
  }

  tabSelected() {
    console.log('InfoComponent tabSelected');
  }

  onFileNameChanged(fileName: string) {
    console.log('onFileNameChanged', fileName);

    if (this.service.ws) {
      this.service.ws.fileName = fileName;
    }
  }

  onNew() {
    console.log('onNew');

    if (!this.service.isModified()) {
      this.fileName = '';
      this.service.newWorkingSet();
      return;
    }

    swal({
      title: 'Warning',
      text: `Your work contains unsaved changes. Do you want to continue?`,
      type: 'warning',
      showCloseButton: true,
      showCancelButton: true,
    }).then((result) => {
      if (result.value) {
        setTimeout(() => {
          // wait until the dialog is closed
          this.fileName = '';
          this.service.newWorkingSet();
        }, 300);
      }
    });
  }

  onLoad() {
    console.log('onLoad');

    if (!this.service.isModified()) {
      this.onOpenFileLoadDlg();
      return;
    }
    swal({
      title: 'Warning',
      text: `Your work contains unsaved changes. Do you want to continue?`,
      type: 'warning',
      showCloseButton: true,
      showCancelButton: true,
    }).then((result) => {
      if (result.value) {
        setTimeout(() => {
          // wait until the dialog is closed
          this.onOpenFileLoadDlg();
        }, 300);
      }
    });
  }

  onSave() {
    console.log('onSave');

    let hasEmptyFileName = false;
    if (this.service.ws != null &&
      (this.service.ws.fileName == null || this.service.ws.fileName === undefined || this.service.ws.fileName.trim() === '')) {
      hasEmptyFileName = true;
    }

    console.log('isModified', this.service.isModified());
    console.log('hasEmptyFileName', hasEmptyFileName);

    if (!this.service.isModified() && !hasEmptyFileName) {
      return;
    }

    if (hasEmptyFileName) {
      const fileName = this.showSaveDialog();
      if (fileName == null || fileName === undefined) {
        return;
      }
      this.fileName = fileName;
      this.service.newWorkingSet();
      if (this.service.ws) {
        this.service.ws.fileName = fileName;
      }
    }

    const err = this.service.save();
    if (err) {
      swal({
        title: 'Error',
        text: err,
        type: 'warning',
        showCloseButton: true
      });
    }
  }

  onSaveAs() {
    console.log('onSaveAs');

    if (this.service.ws == null) {
      return;
    }

    const fileName = this.showSaveDialog();
    if (fileName == null || fileName === undefined) {
      return;
    }
    this.fileName = fileName;
    this.service.newWorkingSet();
    if (this.service.ws) {
      this.service.ws.fileName = fileName;
    }

    const err = this.service.save();
    if (err) {
      swal({
        title: 'Error',
        text: err,
        type: 'warning',
        showCloseButton: true
      });
    }
  }

  onOpenSqlFileLoadDlg() {
    console.log('onOpenSqlFileLoadDlg');

    if (this.service.ws == null || this.service.ws.scriptPatch == null || this.service.ws.scriptPatch === undefined) {
      return;
    }

    let startPath: string = null;

    if (this.service.ws.scriptPatch.relativePath) {
      startPath = path.dirname(this.service.ws.fileName);
    }
    const result = this.showOpenDialog('sql', startPath);

    if (result == null || result === undefined || result.length !== 1) {
      return;
    }

    let fileName = result[0];
    if (this.service.ws.scriptPatch.relativePath) {
      fileName = path.relative(startPath, fileName);
      fileName = path.normalize(fileName);
      fileName = fileName.replace(/\\/g, '/');
    }

    this.service.ws.scriptPatch.sqlFileName = fileName;
  }

  private onOpenFileLoadDlg() {
    console.log('onOpenFileLoadDlg');
    const result = this.showOpenDialog('json');

    if (result == null || result === undefined || result.length !== 1) {
      return;
    }
    const fileName = result[0];
    this.loadScriptPatchFile(fileName);
  }

  private loadScriptPatchFile(fileName: string) {
    console.log('loadScriptPatchFile', fileName);

    const err = this.service.load(fileName);
    if (err) {
      swal({
        title: 'Error',
        text: err,
        type: 'warning',
        showCloseButton: true
      });
      return;
    }

    this.fileName = fileName;
  }

  private showOpenDialog(type: string, startPath?: string): string[] {
    console.log('showOpenDialog');

    const filters: any = this.getDialogFilters(type);

    // https://github.com/electron/electron/blob/master/docs/api/dialog.md
    // https://github.com/electron/electron/issues/2525
    const result = dialog.showOpenDialog(
      remote.getCurrentWindow(),
      {
        // defaultPath: 'c:/',
        defaultPath: startPath,
        filters: filters,
        properties: ['openFile']
      }
    );

    return result;
  }

  private showSaveDialog(): string {
    console.log('showSaveDialog');

    const filters: any = this.getDialogFilters('json');

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
