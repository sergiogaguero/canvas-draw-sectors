// Angular basics
import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// Services
import { RegionsService } from '../../services/regions.service';
import { UserService } from '../../services/user.service';

// dialog
import {
  MatDialog, MatDialogRef, MAT_DIALOG_DATA,
  MatTableDataSource
} from '@angular/material';

// Components
import { OpenMessageDialog, MessageDialog } from '../message-dialog/message-dialog.component';

// Classes
import { Pattern } from '../../classes/patterns';
import { Constants } from 'app/classes/constants';
import { Subscription, Subscriber } from 'rxjs';

@Component({
  selector: 'app-config-regions',
  templateUrl: './config-regions.component.html',
  styleUrls: [
    './config-regions.component.scss',
    '../../styles/headerBar.style.scss',
    '../../styles/table.style.scss',
    '../../styles/noDataError.style.scss'
  ]
})

export class ConfigRegionsComponent implements OnInit {

  regiones: any[] = [];
  displayedColumns = ['region', 'responsable', 'store', 'actions'];
  dataSource = new MatTableDataSource<any>(this.regiones);

  constructor(private _regionesService: RegionsService,
    private router: Router,
    public dialog: MatDialog) {
  }

  ngOnInit() {
    this.refreshRegion();
  }

  openCreateRegion(): MatDialogRef<AddRegionDialog> {
    const dialogRef = this.dialog.open(AddRegionDialog, {
      width: Constants.dialogWidth,
      data: {
        name: '',
        responsableId: null
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.createRegion(result);
      }
    });
    return dialogRef;
  }

  openEditRegion(region: any): MatDialogRef<EditRegionDialog> {
    const dialogRef = this.dialog.open(EditRegionDialog, {
      width: Constants.dialogWidth,
      data: {
        name: region.name,
        regionId: region.regionId,
        responsableId: region.responsableId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.editRegion(result);
      }
    });
    return dialogRef;
  }

  openDeleteRegion(region: any): MatDialogRef<DeleteRegionDialog> {
    const dialogRef = this.dialog.open(DeleteRegionDialog, {
      width: Constants.dialogWidth,
      data: region
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.deleteRegion(result.regionId)
      }
    });
    return dialogRef;
  }

  deleteRegion(regionId: any) {
    this._regionesService.deleteRegion(regionId).subscribe(data => {
      OpenMessageDialog('config.regions.delete.regionDeleteSuccess', 'config.regions.delete.regionDeleteMessageSuccess', this.dialog);
      this.refreshRegion();
    },
      error => {
        OpenMessageDialog('config.regions.delete.regionDeleteError', 'config.regions.delete.regionDeleteMessageError', this.dialog);
        console.error(error)
      }
    );
  }

  createRegion(region: any) {
    this._regionesService.addRegion(region).subscribe(data => {
      this.refreshRegion();
      OpenMessageDialog('config.regions.add.regionCreateSuccess', 'config.regions.add.regionCreateMessageSuccess', this.dialog);
    },
      error => {
        console.error(error);
        OpenMessageDialog('config.regions.add.regionCreateError', 'config.regions.add.regionCreateMessageError', this.dialog);
      }
    );
  }

  editRegion(region: any) {
    this._regionesService.editRegion(region).subscribe(data => {
      OpenMessageDialog('config.regions.edit.regionEditSuccess', 'config.regions.edit.regionEditMessageSuccess', this.dialog);
      this.refreshRegion();
    },
      error => {
        OpenMessageDialog('config.regions.edit.regionEditError', 'config.regions.edit.regionEditMessageError', this.dialog);
        console.error(error);
      }
    );
  }


  refreshRegion() {
    this._regionesService.getRegions()
      .subscribe(response => {
        if (response) {
          this.regiones = response;
          this.dataSource = new MatTableDataSource<any>(this.regiones);
        }
      }
      );
  }

}

// Dialog for creating regions
@Component({
  selector: 'add-region-dialog',
  templateUrl: 'add-region-dialog.component.html',
  styleUrls: ['config-regions.component.scss', '../../styles/dialog.style.scss']
})
export class AddRegionDialog implements OnInit {

  responsables: any[] = [];
  regex = Pattern.getRegionName();
  regionNameFormControl: FormControl;
  responsableIdFormControl: FormControl;
  addRegion: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddRegionDialog>,
    private _empleadosService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    // form validation
    this.regionNameFormControl = new FormControl('', [
      Validators.required,
      Validators.pattern(this.regex)
    ]);
    this.responsableIdFormControl = new FormControl('', [
      Validators.required
    ]);

    this.addRegion = new FormGroup({
      'regionName': this.regionNameFormControl,
      'responsableId': this.responsableIdFormControl,
    });
  }

  ngOnInit() {
    this._empleadosService.getUsersByRole(Constants.roles.regionMgr)
      .subscribe(response => this.responsables = response);
  }

  validate(): void {
    if (this.addRegion.valid) {
      this.dialogRef.close(this.data);
    } else {
      // validate all form fields
      Object.keys(this.addRegion.controls).forEach(field => {
        const control = this.addRegion.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

// Dialog for editing regions
@Component({
  selector: 'edit-region-dialog',
  templateUrl: 'edit-region-dialog.component.html',
  styleUrls: ['config-regions.component.scss', '../../styles/dialog.style.scss']
})
export class EditRegionDialog implements OnInit {

  responsables: any[] = [];
  regionNameFormControl: FormControl;
  responsableIdFormControl: FormControl;
  editRegion: FormGroup;
  regex = Pattern.getRegionName();

  constructor(
    public dialogRef: MatDialogRef<EditRegionDialog>,
    private _empleadosService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    // form validation
    this.regionNameFormControl = new FormControl('', [
      Validators.required,
      Validators.pattern(this.regex)
    ]);
    this.responsableIdFormControl = new FormControl('', [
      Validators.required
    ]);

    this.editRegion = new FormGroup({
      'regionName': this.regionNameFormControl,
      'responsableId': this.responsableIdFormControl,
    });
  }

  ngOnInit() {
    this._empleadosService.getUsersByRole(Constants.roles.regionMgr)
      .subscribe(response => this.responsables = response);
  }

  validate(): void {
    if (this.editRegion.valid) {
      this.dialogRef.close(this.data);
    } else {
      // validate all form fields
      Object.keys(this.editRegion.controls).forEach(field => {
        const control = this.editRegion.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

// Dialog for deleting regions
@Component({
  selector: 'delete-region-dialog',
  templateUrl: 'delete-region-dialog.component.html',
  styleUrls: ['config-regions.component.scss', '../../styles/dialog.style.scss']
})

export class DeleteRegionDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteRegionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
