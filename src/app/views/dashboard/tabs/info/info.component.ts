import swal from 'sweetalert2';

const { remote } = require('electron');
const { dialog } = require('electron').remote;

import { Component, OnInit } from '@angular/core';

import { WorkingSetService } from '../../../../providers/workingset.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  fileName = '';

  constructor(public service: WorkingSetService) {
    console.log('InfoComponent ctor');
  }

  ngOnInit() {
    console.log('ngOnInit');
  }

  onOpenFileLoadDlg() {
    console.log('onOpenFileLoadDlg');

    // https://github.com/electron/electron/blob/master/docs/api/dialog.md
    // https://github.com/electron/electron/issues/2525
    const result = dialog.showOpenDialog(
      remote.getCurrentWindow(),
      {
        // defaultPath: 'c:/',
        filters: [
          { name: 'All Files', extensions: ['*'] },
          { name: 'Json', extensions: ['json'] },
        ],
        properties: ['openFile']
      }
    );

    if (result !== null && result !== undefined && result.length === 1) {
      const fileName = result[0];
      this.fileName = fileName;
    }

  }

  onNew() {
    console.log('onNew');
    this.service.newWorkingSet();
  }

  onLoad() {
    console.log('onLoad');
  }

  onSave() {
    console.log('onSave');

    swal({
      title: 'Confirmation',
      text: `My Text`,
      type: 'warning',
      showCloseButton: true,
      showCancelButton: true,
    }).then((result) => {

    });
  }

}
