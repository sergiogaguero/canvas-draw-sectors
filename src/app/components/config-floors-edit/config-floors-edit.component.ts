// angular basics
import {
    Component,
    OnInit,
    Inject,
    ElementRef,
    ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA
} from '@angular/material';
import {
    FormGroup,
    FormControl,
    Validators
} from '@angular/forms';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE
} from '@angular/material/core';
import {
    MAT_MOMENT_DATE_FORMATS,
    MomentDateAdapter
} from '@angular/material-moment-adapter';


// project basics
import * as moment from 'moment';

// Services
import { FloorsService } from '../../services/floors.service';
import { MapsService } from '../../services/maps.service';

// classes
import { Floor } from '../../classes/floor';
import { Pattern } from '../../classes/patterns';

// components
import { OpenMessageDialog } from './../message-dialog/message-dialog.component';
import { Moment } from 'moment';
import { Constants } from '../../classes/constants';
import { Blueprint } from '../../classes/blueprint';

@Component({
    selector: 'app-config-floors-edit',
    templateUrl: './config-floors-edit.component.html',
    styleUrls: [
        './config-floors-edit.component.scss',
        '../../styles/headerBar.style.scss'
    ]
})

export class ConfigFloorsEditComponent implements OnInit {
    @ViewChild('imgPlano') divImagenPlano: ElementRef;

    // list of all maps
    maps: any = [];

    // selected map and floor that are shown to the user
    planoVigente: any = null;
    currentMapIndex: 0;
    planoSeleccionado: any = {
        mapId: 0
    };
    pisoInfo: any = {
        store: {
            storeId: 0,
        }
    };
    imagenPlano = '';


    constructor(
        public dialog: MatDialog,
        private _floorsService: FloorsService,
        private _mapsService: MapsService,
        private activatedRoute: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.activatedRoute.params
            .subscribe(params => this.getCurrentFloor(params['id']));
    }

    getCurrentFloor(floorId: number): void {
        /* Obtiene el piso actual */
        this._floorsService.getFloorById(floorId)
            .subscribe(floor => this.setCurrentFloor(floor));
    }

    setCurrentFloor(floor: Floor) {
        this.pisoInfo = floor;
        this.refreshMaps();
    }

    // THIS METHOD OPENS THE NEW MAP DIALOG
    openNewMapDialog(): MatDialogRef<NewMapDialog> {
        const dialogRef = this.dialog.open(NewMapDialog, {
            width: Constants.dialogWidth,
            data: {
                storeName: this.pisoInfo.store.name,
                floorName: this.pisoInfo.name,
                map: {
                    name: '',
                    startingDate: moment().add(1, 'days'),
                    floorId: this.pisoInfo.floorId,
                    width: 1,
                    height: 1,
                    comments: '',
                    uploadedfile: null
                }
            }
        });

        dialogRef.afterClosed().subscribe(result => this.addMap(result.map));
        return dialogRef;
    }

    addMap(map): void {
        if (map) {
            map.startingDate = moment(map.startingDate).format('YYYY-MM-DD');

            this._mapsService.addMap(map).subscribe(result => {
                this.refreshMaps();
                OpenMessageDialog('config.store.edit.floor.addSuccessTitle', 'config.store.edit.floor.addSuccessMessage', this.dialog);
            }, error => {
                OpenMessageDialog('config.store.edit.floor.mapErrorTitle', 'config.store.edit.floor.mapErrorMessage', this.dialog);
            });
        }
    }


    // THIS METHOD OPENS THE EDIT MAP DIALOG
    openEditMapDialog(map: Blueprint): MatDialogRef<EditMapDialog> {
        const dialogRef = this.dialog.open(EditMapDialog, {
            width: Constants.dialogWidth,
            data: {
                storeName: this.pisoInfo.store.name,
                floorName: this.pisoInfo.name,
                map: {
                    mapId: map.mapId,
                    name: map.name,
                    startingDate: map.startingDate,
                    floorId: this.pisoInfo.floorId,
                    width: map.width,
                    height: map.height,
                    comments: map.comments
                }
            }
        });

        dialogRef.afterClosed().subscribe(result => this.editMap(result.map));
        return dialogRef;
    }

    editMap(blueprint: Blueprint): void {
        blueprint.startingDate = moment(blueprint.startingDate).format('YYYY-MM-DD');

        this._mapsService.editMap(blueprint).subscribe(result => {
            this.refreshMaps();
            OpenMessageDialog('config.store.edit.floor.editSuccessTitle', 'config.store.edit.floor.editSuccessMessage', this.dialog);
        }, error => {
            OpenMessageDialog('config.store.edit.floor.mapErrorTitle', 'config.store.edit.floor.mapErrorMessage', this.dialog);
        });
    }

    // deleting maps
    openDeleteMapDialog(map: Blueprint): MatDialogRef<DeleteMapDialog> {
        const dialogRef = this.dialog.open(DeleteMapDialog, {
            width: Constants.dialogWidth,
            data: {
                mapId: map.mapId
            }
        });

        dialogRef.afterClosed().subscribe(result => this.deleteMap(result));
        return dialogRef;
    }

    deleteMap(futureMap) {
        if (futureMap !== undefined) {
            this._mapsService.deleteMap(futureMap.mapId).subscribe(result => {
                this.refreshMaps();
                OpenMessageDialog('config.store.edit.floor.deleteSuccessTitle',
                    'config.store.edit.floor.deleteSuccessMessage', this.dialog);
            }, error => {
                OpenMessageDialog('config.store.edit.floor.mapErrorTitle', 'config.store.edit.floor.mapErrorMessage', this.dialog);
            });
        }
    }

    refreshMaps() {
        this._mapsService.getMapsByFloor(this.pisoInfo.floorId)
            .subscribe(blueprints => this.setBlueprints(blueprints));
    }

    setBlueprints(blueprints: Blueprint[]): void {
        this.maps = blueprints;
        if (this.maps.length > 0) {
            // looking out for current map for the floor
            this._mapsService.getCurrentMapByFloor(this.pisoInfo.floorId)
                .subscribe(blueprint => this.setCurrentBlueprint(blueprint));
        }
    }

    setCurrentBlueprint(blueprint: Blueprint) {
        if (blueprint !== null && blueprint !== undefined) {
            this.planoVigente = blueprint;
            this.planoSeleccionado = this.planoVigente;
            this.imagenPlano = this._mapsService.getMapUrlByGuid(this.planoSeleccionado.guid);

            // we'll cut the floor array at 3 prior maps
            this.currentMapIndex = this.maps.indexOf(this.maps.find(p => p.mapId === this.planoVigente.mapId));
            if (this.currentMapIndex - 3 >= 1) {
                this.maps = this.maps.slice(this.currentMapIndex - 3, this.maps.length);
                this.currentMapIndex = this.maps.indexOf(this.maps.find(p => p.mapId === this.planoVigente.mapId));
            }
        }
    }

    selectMap(blueprintId: number) {
        this.planoSeleccionado = this.maps.find(m => m.mapId === blueprintId);
        this.imagenPlano = this._mapsService.getMapUrlByGuid(this.planoSeleccionado.guid);
    }


    resizeCanvas() {
        this.planoSeleccionado.anchoPlano = this.divImagenPlano.nativeElement.offsetWidth;
        this.planoSeleccionado.altoPlano = this.divImagenPlano.nativeElement.offsetHeight;
    }

    isDateSuperior(date: string): boolean {
        const currentDate = moment().utc().startOf('day');
        const mapDate = moment(date).utc().startOf('day');
        if (mapDate > currentDate) {
            return true;
        }
        return false;
    }

    // verify if there's any maps created for today or for the future
    futureMapExists(): boolean {
        // if there's any mapsand there's a current map
        if (this.maps.length > 0 && this.currentMapIndex !== undefined) {
            return this.maps.length > (this.currentMapIndex + 1);
        } else if (this.maps.length > 0 && this.currentMapIndex === undefined) {
            // else if there's maps but there is no current map (there's only a map for the future)
            return true;
        }
        // if there's no maps, then surely there's nothing for the future
        return false;
    }

}


// NEW MAP DIALOG CONSTRUCTOR
@Component({
    selector: 'app-new-map-dialog',
    styleUrls: [
        'config-floors-edit.component.scss',
        '../../styles/dialog.style.scss'
    ],
    // refers to another html template in the same folder
    templateUrl: 'new-map-dialog.component.html'
})
export class NewMapDialog {
    minDate: Moment = moment().add(1, 'days');

    // form validation
    nameFormControl = new FormControl('', [
        Validators.required
    ]);
    startingDateFormControl = new FormControl('', [
        Validators.required
    ]);
    regexFileExtension = Pattern.getFileExtension();
    imageFormControl = new FormControl(
        { disabled: true },
        [
            Validators.required,
            // TODO: File extension validation Validators.pattern(this.regexFileExtension)
        ]);
    widthFormControl = new FormControl('', [
        Validators.required,
        Validators.min(1),
    ]);
    heightFormControl = new FormControl('', [
        Validators.required,
        Validators.min(1),
    ]);

    filename = '';

    addMap = new FormGroup({
        'name': this.nameFormControl,
        'startingDate': this.startingDateFormControl,
        'image': this.imageFormControl,
        'width': this.widthFormControl,
        'height': this.heightFormControl,
    });

    constructor(
        public dialogRef: MatDialogRef<NewMapDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    fileChange(event) {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            this.data.map.uploadedfile = file;
            this.filename = file.name;
        }
    }

    saveMap() {
        if (this.addMap.valid) {
            this.dialogRef.close(this.data);
        } else {
            // validate all form fields
            Object.keys(this.addMap.controls).forEach(field => {
                const control = this.addMap.get(field);
                control.markAsTouched({ onlySelf: true });
            });
        }
    }

}

// EDIT MAP DIALOG CONSTRUCTOR
@Component({
    selector: 'app-edit-map-dialog',
    styleUrls: [
        'config-floors-edit.component.scss',
        '../../styles/dialog.style.scss'
    ],
    // refers to another html template in the same folder
    templateUrl: 'edit-map-dialog.component.html',
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_LOCALE, useValue: 'es' },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
    ]
})
export class EditMapDialog {

    minDate = moment().add(1, 'days');

    // form validation
    nameFormControl = new FormControl('', [
        Validators.required
    ]);
    startingDateFormControl = new FormControl('', [
        Validators.required
    ]);
    widthFormControl = new FormControl('', [
        Validators.required,
        Validators.min(1),
    ]);
    heightFormControl = new FormControl('', [
        Validators.required,
        Validators.min(1),
    ]);

    editMap: FormGroup = new FormGroup({
        'name': this.nameFormControl,
        'startingDate': this.startingDateFormControl,
        'width': this.widthFormControl,
        'height': this.heightFormControl,
    });

    constructor(
        public dialogRef: MatDialogRef<EditMapDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private adapter: DateAdapter<any>
    ) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    saveBlueprint(): void {
        if (this.editMap.valid) {
            this.dialogRef.close(this.data);
        } else {
            // validate all form fields
            Object.keys(this.editMap.controls).forEach(field => {
                const control = this.editMap.get(field);
                control.markAsTouched({ onlySelf: true });
            });
        }
    }
}

// DELETE MAP DIALOG
@Component({
    selector: 'app-delete-map-dialog',
    templateUrl: 'delete-map-dialog.component.html',
    styleUrls: ['../../styles/dialog.style.scss',
        'config-floors-edit.component.scss']
})
export class DeleteMapDialog {

    constructor(
        public dialogRef: MatDialogRef<DeleteMapDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

}