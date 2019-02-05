// angular basics
import { Component, OnInit, ViewChild, ElementRef, NgZone, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// project basics
import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';

// classes
import { Store } from '../../classes/store';
import { Floor } from '../../classes/floor';

// components
import { OpenMessageDialog } from '../message-dialog/message-dialog.component';

// Services
import { UserService } from '../../services/user.service';
import { StoresService } from '../../services/stores.service';
import { RegionsService } from '../../services/regions.service';
import { FloorsService } from '../../services/floors.service';

// validators
import { ValidateIdInCustomerDB } from '../../validators/idInCustomerDB.validator';
import { Constants } from '../../classes/constants';


@Component({
    selector: 'app-config-store-edit',
    templateUrl: './config-store-edit.component.html',
    styleUrls: [
        './config-store-edit.component.scss',
        '../../styles/headerBar.style.scss'
    ]
})

export class ConfigStoreEditComponent implements OnInit {

    store: Store;

    // arrays that'll be completed on init
    empleados: any;
    regiones: any;
    pisos: Floor[];

    // map handling
    public latitude = 0;
    public longitude = 0;
    public zoom = 16;
    @ViewChild('search') searchElementRef: ElementRef;

    // floor creation & edition
    mostrarNuevoPiso = false;
    newFloor: Floor = {
        name: '',
        startingDate: null,
        endingDate: null,
        storeId: 0
    };

    // form validation
    idFormControl: FormControl;
    nameFormControl = new FormControl('', [
        Validators.required,
    ]);
    responsableFormControl = new FormControl('', [
        Validators.required,
    ]);
    regionFormControl = new FormControl('', [
        Validators.required,
    ]);
    latitudeFormControl = new FormControl('', [
        Validators.required,
    ]);
    longitudeFormControl = new FormControl('', [
        Validators.required,
    ]);
    editStore: FormGroup;

    floorNameFormControl = new FormControl('', [
        Validators.required,
    ]);
    addFloor = new FormGroup({
        'floorName': this.floorNameFormControl
    });

    constructor(private _usersService: UserService,
        private _regionesService: RegionsService,
        private _tiendasService: StoresService,
        private _floorsService: FloorsService,
        private mapsAPILoader: MapsAPILoader,
        private activatedRoute: ActivatedRoute,
        private ngZone: NgZone,
        public dialog: MatDialog) {

        this.idFormControl = new FormControl('', [
            Validators.required
        ],
            ValidateIdInCustomerDB.createValidator(this._tiendasService, true));

        this.editStore = new FormGroup({
            'idinCustomerDB': this.idFormControl,
            'name': this.nameFormControl,
            'responsableId': this.responsableFormControl,
            'regionId': this.regionFormControl,
            'longitude': this.longitudeFormControl,
            'latitude': this.latitudeFormControl,
        });
    }

    ngOnInit() {
        // get initial data
        this.activatedRoute.params.subscribe(params => {
            this.getCurrentStore(params['id']);
        });

        this._regionesService.getRegions()
            .subscribe(response => this.regiones = response);

        this._usersService.getUsersByRole(Constants.roles.storeMgr)
            .subscribe(response => this.empleados = response);
    }

    getCurrentStore(storeId: number) {
        this._tiendasService.getStoreById(storeId)
            .subscribe(response => {
                this.setCurrentStore(response)
            });
    }

    setCurrentStore(store: Store) {
        if (store != null) {
            this.store = store;
            this.newFloor.storeId = this.store.storeId;
            this.pisos = this.store.floors;

            if (this.store.locationLat && this.store.locationLong) {
                this.recenterMap(parseFloat(this.store.locationLat), parseFloat(this.store.locationLong));
            }
            // load Places Autocomplete
            this.mapsAPILoader.load().then(() => {
                const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
                    types: ['address']
                });
                autocomplete.addListener('place_changed', () => {
                    this.ngZone.run(() => {
                        // get the place result
                        const place: google.maps.places.PlaceResult = autocomplete.getPlace();

                        // verify result
                        if (place.geometry === undefined || place.geometry === null) {
                            return;
                        }
                        this.store.address = place.formatted_address;
                        // set latitude, longitude
                        this.recenterMap(place.geometry.location.lat(), place.geometry.location.lng());
                        this.store.timeZoneOffset = place.utc_offset;
                    });
                });
            });
        }
    }

    recenterMap(lat: number, lng: number) {
        this.latitude = lat;
        this.longitude = lng;
        this.store.locationLat = lat.toString();
        this.store.locationLong = lng.toString();
    }

    // store saving
    saveStore() {
        if (this.editStore.valid) {
            this._tiendasService.editStore(this.store).subscribe(data => {
                OpenMessageDialog('config.store.edit.editSuccessTitle', 'config.store.edit.editSuccessMessage', this.dialog);
            },
                error => {
                    OpenMessageDialog('general.errorDialogTitle', 'general.errorDialogMessage', this.dialog);
                });
        } else {
            // validate all form fields
            Object.keys(this.editStore.controls).forEach(field => {
                const control = this.editStore.get(field);
                control.markAsTouched({ onlySelf: true });
            });
        }
    }

    // adding floors
    newFloorFormToggle(): void {
        this.mostrarNuevoPiso = !this.mostrarNuevoPiso;
    }

    nuevoPiso() {
        if (this.addFloor.valid) {
            this._floorsService.addFloor(this.newFloor)
                .subscribe(
                    newFloor => this.floorSavedSuccessfully(),
                    error => {
                        OpenMessageDialog('general.errorDialogTitle', 'general.errorDialogMessage', this.dialog);
                    });
        } else {
            // validate all form fields
            Object.keys(this.addFloor.controls).forEach(field => {
                const control = this.addFloor.get(field);
                control.markAsTouched({ onlySelf: true });
            });
        }
    }

    floorSavedSuccessfully() {
        OpenMessageDialog('config.store.edit.addFloorSuccessTitle', 'config.store.edit.addFloorSuccessMessage', this.dialog);
        this.newFloor.name = '';
        this.mostrarNuevoPiso = false;
        this.refreshFloors();
    }

    // deleting floors
    openDeleteFloorDialog(floor: Floor): MatDialogRef<DeleteFloorDialog> {
        const dialogRef = this.dialog.open(DeleteFloorDialog, {
            width: Constants.dialogWidth,
            data: {
                name: floor.name,
                floorId: floor.floorId
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.deleteFloor(result.floorId);
        });
        return dialogRef;
    }

    deleteFloor(floorId: number): void {
        this._floorsService.deleteFloor(floorId).subscribe(data => {
            this.refreshFloors();
            OpenMessageDialog('config.store.edit.deleteFloorSuccessTitle', 'config.store.edit.deleteFloorSuccessMessage', this.dialog);
        },
            error => {}
        );
    }

    // FLOOR EDITING
    openEditFloorDialog(floorId: number, name: string): MatDialogRef<EditFloorDialog> {
        const dialogRef = this.dialog.open(EditFloorDialog, {
            width: Constants.dialogWidth,
            data: {
                name: name,
                floorId: floorId
            }
        });

        dialogRef.afterClosed().subscribe(result => this.editFloor(result));
        return dialogRef;
    }

    editFloor(floor: any) {
        this._floorsService.editFloor(floor)
            .subscribe(data => {
                OpenMessageDialog('config.store.edit.editFloorSuccessTitle', 'config.store.edit.editFloorSuccessMessage', this.dialog);
                this.refreshFloors();
            },
                error => {
                    OpenMessageDialog('general.errorDialogTitle', 'general.errorDialogMessage', this.dialog);
                });
    }

    // floor list handling
    refreshFloors() {
        this._floorsService.getFloorsByStore(this.store.storeId)
            .subscribe(response => this.pisos = response);
    }
}


// EDIT FLOOR DIALOG
@Component({
    selector: 'app-edit-floor-dialog',
    styleUrls: [
        'config-store-edit.component.scss',
        '../../styles/dialog.style.scss'
    ],
    templateUrl: 'edit-floor-dialog.component.html',
})
export class EditFloorDialog {
    floorNameFormControl = new FormControl('', [
        Validators.required,
    ]);
    editFloor = new FormGroup({
        'floorName': this.floorNameFormControl
    });
    constructor(
        public dialogRef: MatDialogRef<EditFloorDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    saveFloor() {
        if (this.editFloor.valid) {
            this.dialogRef.close(this.data);
        } else {
            // validate all form fields
            Object.keys(this.editFloor.controls).forEach(field => {
                const control = this.editFloor.get(field);
                control.markAsTouched({ onlySelf: true });
            });
        }
    }

}


// DELETE FLOOR DIALOG
@Component({
    selector: 'app-delete-floor-dialog',
    templateUrl: 'delete-floor-dialog.component.html',
    styleUrls: ['../../styles/dialog.style.scss']
})
export class DeleteFloorDialog {

    constructor(
        public dialogRef: MatDialogRef<DeleteFloorDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
