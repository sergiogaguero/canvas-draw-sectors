// project basics
import { By, BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { MaterialModule } from '../../material.module';
import { DebugElement } from '@angular/core';
import * as moment from 'moment';

// Testing basics
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async } from '@angular/core/testing';

// component
import {
    ConfigFloorsEditComponent,
    EditMapDialog,
    DeleteMapDialog,
    NewMapDialog
} from '../../components/config-floors-edit/config-floors-edit.component';

// service & stub :)
import { FloorsService } from '../../services/floors.service';
import { FloorsServiceStub } from '../stubs/floors.service.stub';
import { MapsService } from '../../services/maps.service';
import { MapsServiceStub } from '../stubs/maps.service.stub';

// Translation
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { MessageDialog } from '../../components/message-dialog/message-dialog.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Constants } from '../../classes/constants';
import { Router, ActivatedRoute } from '@angular/router';
import { Floor } from '../../classes/floor';
import { MatDialogRef } from '@angular/material';
import { Blueprint } from '../../classes/blueprint';

const translationsMock = {
    'config': {
        'store': {
            'edit': {
                'floor': {
                    'loadNewMap': 'Load a new blueprint',
                    'mapHistory': 'Blueprints history',
                    'mapStart': 'Home',
                    'activeSince': 'Valid from',
                    'widthInMts': 'Width in meters',
                    'noMaps': 'Currently, there are no blueprints for this floor.',
                    'addMap': 'Add blueprint',
                    'editMap': 'Edit blueprint',
                    'deleteMap': 'Delete blueprint',
                    'alertDeleteMap': 'Are you sure you want delete the blueprint?',
                    'namePlaceholder': 'Blueprint name',
                    'nameTooltip': 'This name must match with the name that was defined in the Meraki Dashboard',
                    'noNameError': 'Enter a name that matches with the name that was defined in the Meraki Dashboard',
                    'startingDatePlaceholder': 'Valid From Date',
                    'noStartingDateError': 'Select a Valid From Date for this map',
                    'imagePlaceholder': 'Blueprint image',
                    'imageHint': 'Image maximum size: 10Mb',
                    'noImageError': 'Please, select an image for this map',
                    'commentsPlaceholder': 'Comments',
                    'widthPlaceholder': 'Blueprint width (meters)',
                    'noWidthError': 'You must enter the width in meters',
                    'minWidthError': 'The map width must be of 1 meter or more',
                    'heightPlaceholder': 'Blueprint height (meters)',
                    'noHeightError': 'You must enter the height in meters',
                    'minHeightError': 'The map height must be of 1 meter or more',
                    'editSuccessTitle': 'Map edited successfully',
                    'editSuccessMessage': 'The map was edited successfully',
                    'mapErrorTitle': 'There was a problem',
                    'mapErrorMessage': 'We couldn\'t save the map. Please, try again.',
                    'addSuccessTitle': 'Map created',
                    'addSuccessMessage': 'The map has been saved successfully',
                    'deleteSuccessTitle': 'Map deleted',
                    'deleteSuccessMessage': 'The map has been deleted successfully'
                }
            }
        }
    },
    'general': {
        'cancel': 'Cancel',
        'save': 'Save',
        'accept': 'Accept',
        'delete': 'Delete',
    }
};
class FakeLoader implements TranslateLoader {
    getTranslation(lang: string): Observable<any> {
        return Observable.of(translationsMock);
    }
}

describe('ConfigFloorsEditComponent', () => {
    let comp: ConfigFloorsEditComponent;
    let fixture: ComponentFixture<ConfigFloorsEditComponent>;
    let _floorsService: FloorsService;
    let _mapsService: MapsService;
    const floorId = 1;
    let floor: Floor;
    let blueprint: Blueprint;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ConfigFloorsEditComponent,
                MessageDialog,
                EditMapDialog,
                DeleteMapDialog,
                NewMapDialog,
            ],
            imports: [
                MaterialModule,
                RouterTestingModule,
                FormsModule,
                BrowserModule,
                ReactiveFormsModule,
                BrowserAnimationsModule,
                HttpClientTestingModule,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                })
            ], providers: [
                { provide: MapsService, useClass: MapsServiceStub },
                { provide: FloorsService, useClass: FloorsServiceStub },
                {
                    provide: ActivatedRoute, useValue: {
                        params: Observable.of({ id: floorId })
                    }
                },
            ]
        });

        TestBed.overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [
                    MessageDialog,
                    EditMapDialog,
                    DeleteMapDialog,
                    NewMapDialog
                ]
            }
        });
        TestBed.compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfigFloorsEditComponent);
        _mapsService = TestBed.get(MapsService);
        _floorsService = TestBed.get(FloorsService);
        comp = fixture.componentInstance; // test instance

        blueprint = {
            floorId: floorId,
            name: 'Floor 2',
            startingDate: '2018-02-01',
            width: 20,
            height: 30,
            guid: 'sarasa'
        };

        floor = {
            'floorId': 1,
            'name': 'piso 1',
            'startingDate': null,
            'endingDate': null,
            'storeId': 1,
            'store': {
                name: 'Store',
                responsableId: 3,
                regionId: 1,
                locationLong: '0',
                locationLat: '0',
                companyId: 1,
                idinCustomerDB: 'Id for the store',
                timeZoneOffset: 0,
                address: '',
                region: {
                    name: 'Region 1',
                    responsableId: 2
                },
                responsable: {
                    name: 'John',
                    lastname: 'Storemager'
                }
            }
        };
    });

    it('onInit() should go fetch the floor info', () => {
        spyOn(comp, 'getCurrentFloor');
        fixture.detectChanges();
        expect(comp.getCurrentFloor).toHaveBeenCalledWith(floorId);
    });

    it('should go fetch the blueprints on getCurrentFloor()', () => {
        spyOn(_floorsService, 'getFloorById').and.returnValue(Observable.of([floor]));
        comp.getCurrentFloor(floor.floorId);
        expect(_floorsService.getFloorById).toHaveBeenCalledWith(floor.floorId);
    });

    it('should set the floor info correctly on setCurrentFloor()', () => {
        spyOn(comp, 'refreshMaps');
        comp.setCurrentFloor(floor);
        expect(comp.refreshMaps).toHaveBeenCalled();
        expect(comp.pisoInfo).toBe(floor);
    });

    it('should go fetch the blueprints on refreshMaps()', () => {
        spyOn(_mapsService, 'getMapsByFloor').and.returnValue(Observable.of([blueprint]));
        comp.pisoInfo = floor;
        comp.refreshMaps();
        expect(_mapsService.getMapsByFloor).toHaveBeenCalledWith(floor.floorId);
    });

    it('should set the correct map as the current one if there\'s any on setCurrentBlueprint()', () => {
        comp.maps.push(blueprint);
        comp.pisoInfo = floor;
        comp.setCurrentBlueprint(blueprint);
        expect(comp.planoSeleccionado).toBe(blueprint);
    });

    it('should set the correct map as the selected one on selectMap()', () => {
        comp.maps.push(blueprint);
        comp.pisoInfo = floor;
        comp.selectMap(blueprint.mapId);
        expect(comp.planoSeleccionado).toBe(blueprint);
    });

    describe('on futureMapExists()', () => {
        it('should return false if there\'s no maps', () => {
            const result = comp.futureMapExists();
            expect(result)
                .toBeFalsy('This should be false, there can\'t be any future maps if there\'s no maps!');
        });

        it('should return true if there\'s maps but no current map', () => {
            comp.maps.push(blueprint);
            const result = comp.futureMapExists();
            expect(result)
                .toBeTruthy('This should be true, there must be some future map if none of the loaded maps are current!');
        });

        it('should return true if there\'s more maps than the current one', () => {
            comp.maps.push(blueprint);
            comp.maps.push(blueprint);
            comp.currentMapIndex = 0;
            const result = comp.futureMapExists();
            expect(result)
                .toBeTruthy('This should be true, there must be some future map if there\'s maps after the current one');
        });
    })

    describe('on isDateSuperior()', () => {
        it('should return false for a date from before today', () => {
            const date = moment().subtract(1, 'days').format('YYYY-MM-DD');
            const result = comp.isDateSuperior(date);
            expect(result).toBeFalsy('Previous date should return false');
        });

        it('should return false for today\'s date', () => {
            const date = moment().format('YYYY-MM-DD');
            const result = comp.isDateSuperior(date);
            expect(result).toBeFalsy('Today should return false');
        });

        it('should return false for today\'s date', () => {
            const date = moment().add(1, 'days').format('YYYY-MM-DD');
            const result = comp.isDateSuperior(date);
            expect(result).toBeTruthy('Tomorrow should return true');
        });
    });

    describe('on map creation', () => {
        let dialogRef: MatDialogRef<NewMapDialog>;

        it('should open the creation popup', () => {
            comp.pisoInfo = floor;
            dialogRef = comp.openNewMapDialog();

            expect(dialogRef.componentInstance instanceof NewMapDialog)
                .toBeTruthy('The dialog should be an instance of NewMapDialog');
            expect(dialogRef.componentInstance.data.map.name)
                .toBe('', 'The name should be empty');
        });

        it('shouldn\'t let you save if the map has no name', () => {
            comp.pisoInfo = floor;
            dialogRef = comp.openNewMapDialog();

            dialogRef.componentInstance.saveMap();
            expect(dialogRef.componentInstance.addMap.valid).toBeFalsy();
        });

        it('should call addMap() when closed with data', () => {
            comp.pisoInfo = floor;
            spyOn(comp, 'addMap');
            dialogRef = comp.openNewMapDialog();

            dialogRef.componentInstance.data.map = blueprint;
            dialogRef.afterClosed().subscribe(res => {
                expect(comp.addMap).toHaveBeenCalledWith(blueprint);
            });
            expect(dialogRef.componentInstance.data.map.name)
                .toBe(blueprint.name, 'Map name should have changed');

            // close the dialog
            dialogRef.componentInstance.saveMap();
        });

        it('addMap() should call the map service', () => {
            comp.pisoInfo = floor;
            blueprint.mapId = 1;
            spyOn(_mapsService, 'addMap').and.returnValue(Observable.of(blueprint));

            comp.addMap(blueprint);
            expect(_mapsService.addMap).toHaveBeenCalledWith(blueprint);
        });
    });


    describe('on map edition', () => {
        let dialogRef: MatDialogRef<EditMapDialog>;
        beforeEach(() => {
            comp.pisoInfo = floor;
        });

        it('should open the edition popup', () => {
            dialogRef = comp.openEditMapDialog(blueprint);

            expect(dialogRef.componentInstance instanceof EditMapDialog)
                .toBeTruthy('The dialog should be an instance of EditMapDialog');
            expect(dialogRef.componentInstance.data.map.name)
                .toBe(blueprint.name, 'The name should be the one from the map');
        });

        it('shouldn\'t let you save if the map has no name', () => {
            dialogRef = comp.openEditMapDialog(blueprint);
            dialogRef.componentInstance.data.map.name = '';

            dialogRef.componentInstance.saveBlueprint();
            expect(dialogRef.componentInstance.editMap.valid).toBeFalsy();
        });

        it('should call editMap() when closed with data', () => {
            spyOn(comp, 'editMap');
            dialogRef = comp.openEditMapDialog(blueprint);

            dialogRef.componentInstance.data.map.name = 'edited name';
            dialogRef.afterClosed().subscribe(res => {
                expect(comp.addMap).toHaveBeenCalledWith(blueprint);
            });
            blueprint.name = 'edited name';
            expect(dialogRef.componentInstance.data.map.name)
                .toBe(blueprint.name, 'Map name should have changed');

            // close the dialog
            dialogRef.componentInstance.saveBlueprint();
        });

        it('editMap() should call the map service', () => {
            blueprint.mapId = 1;
            spyOn(_mapsService, 'editMap').and.returnValue(Observable.of(blueprint));

            comp.editMap(blueprint);
            expect(_mapsService.editMap).toHaveBeenCalledWith(blueprint);
        });
    });


    describe('on map deletion', () => {
        let dialogRef: MatDialogRef<DeleteMapDialog>;
        beforeEach(() => {
            blueprint.mapId = 1;
        });

        it('should open the deletion popup', () => {
            comp.pisoInfo = floor;
            dialogRef = comp.openDeleteMapDialog(blueprint);

            expect(dialogRef.componentInstance instanceof DeleteMapDialog)
                .toBeTruthy('The dialog should be an instance of DeleteMapDialog');
        });

        it('shouldn\'t delete the map on cancel', () => {
            comp.pisoInfo = floor;
            dialogRef = comp.openDeleteMapDialog(blueprint);
            spyOn(dialogRef, 'close');
            dialogRef.componentInstance.onNoClick();
            expect(dialogRef.close).toHaveBeenCalledWith();
        });

        it('should call deleteMap() when closed with data', () => {
            comp.pisoInfo = floor;
            spyOn(comp, 'deleteMap');
            dialogRef = comp.openDeleteMapDialog(blueprint);

            dialogRef.afterClosed().subscribe(res => {
                expect(comp.deleteMap).toHaveBeenCalledWith(blueprint);
            });

            // close the dialog
            dialogRef.close(dialogRef.componentInstance.data);
        });

        it('deleteMap() should call the map service', () => {
            comp.pisoInfo = floor;
            spyOn(_mapsService, 'deleteMap').and.returnValue(Observable.of(null));

            comp.deleteMap(blueprint);
            expect(_mapsService.deleteMap).toHaveBeenCalledWith(blueprint.mapId);
        });
    });
});
