// Angular basics
import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog, MatDialogRef, MAT_DIALOG_DATA
} from '@angular/material';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

// services
import { SettingsService } from '../../services/settings.service';

// Classes
import { Constants } from '../../classes/constants';

// components
import { OpenMessageDialog } from './../message-dialog/message-dialog.component';

@Component({
  selector: 'app-config-general',
  templateUrl: './config-general.component.html',
  styleUrls: [
    './config-general.component.scss',
    '../../styles/headerBar.style.scss'
  ]
})

export class ConfigGeneralComponent implements OnInit {

  GENERAL_SETTINGS = Constants.getGeneralSettings();

  // default values for the settings, will be overriden with data from the service
  settings = {
    settingId: 0,
    visits: 5,
    passByBegin: 1,
    passByEnd: 5,
    ratio: 0,
    knownPeriod: this.GENERAL_SETTINGS.KNOWN_VISITOR_PERIODS[0].dbValue,
    discarded: this.GENERAL_SETTINGS.DEVICE_DISCARD_SIGHTINGS[0]
  };

  constructor(
    public dialog: MatDialog,
    private _settingsService: SettingsService,
  ) { }

  ngOnInit() {
    this.getCurrentSettings();
  }

  openSavingDialog() {
    const dialogRef = this.dialog.open(SettingsConfirmationDialog, {
      width: Constants.dialogWidth,
      data: {
        updateNow: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.saveSettings(result);
    });
    return dialogRef;
  }


  saveSettings(data) {
    if (data !== undefined) {
      this.settings.visits = this.settings.visits * 60;
      this.settings.passByEnd = this.settings.visits;
      this.settings.ratio = this.settings.ratio / 100;

      this._settingsService.editSettings(this.settings).subscribe(res => {
        if (data.updateNow) {
          this._settingsService.updateViews().subscribe(response => {
            OpenMessageDialog('config.general.refreshSuccessTitle', 'config.general.refreshSuccessMessage', this.dialog);
          })
        } else {
          OpenMessageDialog('config.general.saveSuccessTitle', 'config.general.saveSuccessMessage', this.dialog);
        }
        this.settings.visits = this.settings.visits / 60;
        this.settings.ratio = this.settings.ratio * 100;
      });
    };
  }

  getCurrentSettings() {
    this._settingsService.getSettings().subscribe(currentSettings => {
      this.settings = currentSettings;
      this.settings.visits = currentSettings.visits / 60;
      this.settings.ratio = this.settings.ratio * 100;
    });
  }


}



// CONFIRMATION DIALOG CONSTRUCTOR
@Component({
  selector: 'app-settings-confirmation-dialog',
  styleUrls: [
    '../../styles/dialog.style.scss'
  ],
  // refers to another html template in the same folder
  templateUrl: 'settings-confirmation-dialog.component.html'
})
export class SettingsConfirmationDialog {

  constructor(
    public dialogRef: MatDialogRef<SettingsConfirmationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
