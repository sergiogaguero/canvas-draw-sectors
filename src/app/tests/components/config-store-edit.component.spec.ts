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

// Testing basics
import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async } from '@angular/core/testing';

// component
import { ConfigStoreEditComponent, EditFloorDialog, DeleteFloorDialog } from '../../components/config-store-edit/config-store-edit.component';

// service & stub :)
import { StoresService } from '../../services/stores.service';
import { StoresServiceStub } from '../stubs/stores.service.stub';

// Translation
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { MessageDialog } from '../../components/message-dialog/message-dialog.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '../../classes/store';
import { Constants } from '../../classes/constants';
import { UserService } from '../../services/user.service';
import { UserServiceStub } from '../stubs/user.service.stub';
import { RegionsService } from '../../services/regions.service';
import { RegionsServiceStub } from '../stubs/regions.service.stub';
import { AgmCoreModule } from '@agm/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FloorsService } from '../../services/floors.service';
import { FloorsServiceStub } from '../stubs/floors.service.stub';
import { Floor } from '../../classes/floor';
import { MatDialogRef } from '@angular/material';
const translationsMock = {
    'config': {
        'store': {
            'idTooltip': 'This value must match with the ID that will be sent with the POS data',
            'idPlaceholder': 'Store ID',
            'noIdError': 'Please, enter an ID for this store',
            'usedIdError': 'This store ID is already taken',
            'namePlaceholder': 'Store Name',
            'noNameError': 'Please, enter a name for this store',
            'responsableDefault': 'Select the Store Responsible',
            'noResponsableError': 'Please, select a responsible for this store',
            'regionDefault': 'Select the region',
            'noRegionError': 'Please, select a region for this store',
            'addressPlaceholder': 'Enter the store\'s address',
            'noAddressError': 'Please, enter an address for this store.',
            'noStoresErrorTitle': 'Sorry, but you don\'t have any stores',
            'noStoresError': 'But you can create your first store right now!',
            'edit': {
                'editStore': 'Edit store',
                'numberFloors': 'Quantity of floors',
                'addFloor': 'Add floor',
                'deleteFloor': 'Delete floor',
                'alertDeleteFloor': 'Are you sure to delete the floor {{name}}?',
                'editFloor': 'Edit floor',
                'floorName': 'Floor name',
                'noFloorName': 'Please, enter a name for this floor',
                'editSuccessTitle': 'Store assigned',
                'editSuccessMessage': 'The changes were saved correctly.',
                'addFloorSuccessTitle': 'Floor created',
                'addFloorSuccessMessage': 'The floor was created successfully.',
                'editFloorSuccessTitle': 'Floor saved',
                'editFloorSuccessMessage': 'The floor was edited correctly.',
                'deleteFloorSuccessTitle': 'Floor deleted',
                'deleteFloorSuccessMessage': 'The floor was deleted correctly.',
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
            },
            'list': {
                'storeList': 'Stores Listing',
                'newStore': 'New Store',
                'id': '#ID',
                'noFloors': 'No data',
                'deleteStore': 'Delete store',
                'seeFloors': 'See floors',
                'deleteStoreWithFloors': 'The store {{name}} has associated floors. You must delete these floors before deleting the store.',
                'deleteStoreWithNoFloors': 'Are you sure to delete the store {{name}}?',
                'deleteSuccessTitle': 'Store deleted',
                'deleteSuccessMessage': 'The store was deleted successfully.',
                'deleteErrorTitle': 'Error',
                'deleteErrorMessage': 'It was not possible to delete the store. Please, try again.'
            },
            'add': {
                'addStore': 'Add store'
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

class MockRouter {
    navigate(url: string) { return url; }
}


describe('ConfigStoreEditComponent', () => {
    let comp: ConfigStoreEditComponent;
    let fixture: ComponentFixture<ConfigStoreEditComponent>;
    let _storesService: StoresService;
    let _userService: UserService;
    let _regionsService: RegionsService;
    let _floorsService: FloorsService;
    let store : Store;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ConfigStoreEditComponent,
                MessageDialog,
                EditFloorDialog,
                DeleteFloorDialog
            ],
            imports: [
                MaterialModule,
                RouterTestingModule,
                FormsModule,
                BrowserModule,
                ReactiveFormsModule,
                BrowserAnimationsModule,
                RouterTestingModule,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                }),
                AgmCoreModule.forRoot({
                    apiKey: Constants.googleMapsKey,
                    libraries: ['places']
                }),
            ], providers: [
                { provide: StoresService, useClass: StoresServiceStub },
                { provide: UserService, useClass: UserServiceStub },
                { provide: RegionsService, useClass: RegionsServiceStub },
                { provide: RouterTestingModule, useClass: MockRouter },
                { provide: FloorsService, useClass: FloorsServiceStub },
                {
                    provide: ActivatedRoute, useValue: {
                        params: Observable.of({ id: 1 })
                    }
                },
            ]
        });

        TestBed.overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [
                    MessageDialog,
                    EditFloorDialog,
                    DeleteFloorDialog
                ]
            }
        });
        TestBed.compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfigStoreEditComponent);
        _storesService = TestBed.get(StoresService);
        _userService = TestBed.get(UserService);
        _regionsService = TestBed.get(RegionsService);
        _floorsService = TestBed.get(FloorsService);
        store = {
            'storeId': 1,
            'name': 'sarasa',
            'regionId': 1,
            'responsableId': 3,
            'locationLat': '-37.326238700000005',
            'locationLong': '-59.13289109999999',
            'companyId': 1,
            'idinCustomerDB': '123456789',
            address: '',
            timeZoneOffset: 0,
            'floors': [
                {
                    'floorId': 1,
                    'name': 'piso 1',
                    'startingDate': null,
                    'endingDate': null,
                    'storeId': 1
                },
                {
                    'floorId': 2,
                    'name': 'piso 2',
                    'startingDate': null,
                    'endingDate': null,
                    'storeId': 1
                }
            ]
        };
        comp = fixture.componentInstance; // test instance
    });

    describe('onInit', () => {
        it('should have some regions and region managers', () => {
            fixture.detectChanges();
            _userService.getUsersByRole(Constants.roles.storeMgr).subscribe(storeMgrs => {
                fixture.detectChanges();
                expect(comp.empleados.length).toBe(storeMgrs.length,
                    'Should have expected store managers to load');
            });
            _regionsService.getRegions().subscribe(regions => {
                fixture.detectChanges();
                expect(comp.regiones).toBe(regions,
                    'Should have expected regions to load');
            });
        });

        it('should go fetch the store info', () => {
            spyOn(comp, 'getCurrentStore');
            comp.store = store;
            fixture.detectChanges();
            expect(comp.getCurrentStore).toHaveBeenCalledTimes(1);
        });
    });

    it('should set the store info correctly on setCurrentStore()', () => {
        
        spyOn(comp, 'recenterMap');
        comp.setCurrentStore(store);
        fixture.detectChanges();
        expect(comp.recenterMap).toHaveBeenCalled();
        expect(comp.pisos.length).toBe(store.floors.length);
    });

    describe('when saving a store', () => {
        it('shouldn\'t save if the form is missing info', () => {
            comp.store = {
                'storeId': 1,
                'name': 'sarasa',
                'regionId': 1,
                'responsableId': 3,
                'locationLat': '-37.326238700000005',
                'locationLong': '-59.13289109999999',
                'companyId': 1,
                'idinCustomerDB': '123456789',
                address: '',
                timeZoneOffset: 0,
            };
            comp.saveStore();

            expect(comp.editStore.valid).toBeFalsy('The form should be invalid when a field is null');
        });

        it('should let you edit a store with valid data',
            inject([Router], (router: Router) => {
                comp.store = {
                    name: 'Edited store!',
                    idinCustomerDB: 'totally edited store',
                    companyId: 1,
                    regionId: 1,
                    responsableId: 1,
                    locationLat: '0',
                    locationLong: '0',
                    timeZoneOffset: 0,
                    address: 'lalala',
                    storeId: 1
                };
                fixture.detectChanges();
                spyOn(_storesService, 'editStore').and.returnValue(Observable.of(comp.store));
                comp.saveStore();
                expect(comp.editStore.valid).toBeTruthy('Form should be ok');
                expect(_storesService.editStore).toHaveBeenCalled();
            })
        );
    });

    describe('on floor creation', () => {
        let floor: Floor;

        beforeEach(() => {
            floor = {
                name: 'New floor',
                storeId: 1
            };
        });

        it('shouldn\'t let you load a floor without info', () => {
            comp.nuevoPiso();
            fixture.detectChanges();
            expect(comp.addFloor.valid).toBeFalsy();
        });

        it('should let you create a floor with info', () => {
            comp.newFloorFormToggle();
            expect(comp.mostrarNuevoPiso).toBeTruthy();
            fixture.detectChanges();
            comp.newFloor = floor;
            fixture.detectChanges();

            floor.floorId = 9999;
            spyOn(_floorsService, 'addFloor').and.returnValue(Observable.of(floor));
            comp.nuevoPiso();
            expect(comp.addFloor.valid).toBeTruthy();
            expect(_floorsService.addFloor).toHaveBeenCalled();
        });
    });

    describe('on floor edition', () => {
        let dialogRef: MatDialogRef<EditFloorDialog>;
        beforeEach(() => {
            comp.pisos = [{
                floorId: 9999,
                name: 'Floor 2',
                storeId: 1
            }];
        });

        it('should open the editing popup', () => {
            fixture.detectChanges();
            dialogRef = comp.openEditFloorDialog(comp.pisos[0].floorId, comp.pisos[0].name);
            fixture.detectChanges();

            expect(dialogRef.componentInstance instanceof EditFloorDialog)
                .toBeTruthy('The dialog should be an instance of EditFloorDialog');
            expect(dialogRef.componentInstance.data.name)
                .toBe(comp.pisos[0].name, 'The name should match the name we set');
        });

        it('shouldn\'t let you save if the floor has no name', () => {
            fixture.detectChanges();
            const newFloorName = '';
            dialogRef = comp.openEditFloorDialog(comp.pisos[0].floorId, newFloorName);
            fixture.detectChanges();

            dialogRef.componentInstance.saveFloor();
            fixture.detectChanges();
            expect(dialogRef.componentInstance.editFloor.valid).toBeFalsy();
        });

        it('should call editFloor() when closed with data', () => {
            // i open the dialog
            spyOn(comp, 'editFloor');
            fixture.detectChanges();
            dialogRef = comp.openEditFloorDialog(comp.pisos[0].floorId, comp.pisos[0].name);
            fixture.detectChanges();

            // set the new name
            const newFloorName = 'This floor was edited';
            dialogRef.componentInstance.data.name = newFloorName;
            const floor = dialogRef.componentInstance.data;
            dialogRef.afterClosed().subscribe(res => {
                expect(comp.editFloor).toHaveBeenCalledWith(floor);
            });
            fixture.detectChanges();
            expect(dialogRef.componentInstance.data.name)
                .toBe(newFloorName, 'Floor name should have changed');

            // close the dialog
            dialogRef.componentInstance.saveFloor();
            fixture.detectChanges();
        });
    });

    describe('on floor deletion', () => {
        let dialogRef: MatDialogRef<DeleteFloorDialog>;
        beforeEach(() => {
            comp.pisos = [{
                floorId: 9999,
                name: 'Floor 2',
                storeId: 1
            }];
            fixture.detectChanges();
        });

        it('should open the deletion popup', () => {
            dialogRef = comp.openDeleteFloorDialog(comp.pisos[0]);
            fixture.detectChanges();

            expect(dialogRef.componentInstance instanceof DeleteFloorDialog)
                .toBeTruthy('The dialog should be an instance of DeleteFloorDialog');
            expect(dialogRef.componentInstance.data.name)
                .toBe(comp.pisos[0].name, 'The name should match the name we set');
        });

        it('on deleteFloor() should delete the floor', () => {
            spyOn(_floorsService, 'deleteFloor').and.returnValue(Observable.of(null));
            const floorId = comp.pisos[0].floorId;
            comp.deleteFloor(floorId);
            fixture.detectChanges();

            expect(_floorsService.deleteFloor).toHaveBeenCalledWith(floorId);
        });
    });



    /*    it('should set the store lat/long correctly when the autocomplete changes', () => {
            const de = fixture.debugElement.query(By.css('agm-map'));
            const map = de.nativeElement;
            const autocomplete = new google.maps.places.Autocomplete(comp.searchElementRef.nativeElement, {
                types: ['address']
            });
            const placeService = new google.maps.places.PlacesService(map);
            let place;
            placeService.getDetails({
                placeId: 'ChIJm7VqvtDKvJURIdwhRLU4E7M'
            }, function (result, status) {
                place = result;
                autocomplete.set('place', place);
                comp.whenPlaceChanges(autocomplete);
                console.log(place.name);
                expect(comp.store.locationLat).toBe(place.geometry.location.lat);
                expect(comp.store.locationLong).toBe(place.geometry.location.lng);
            });
        })*/
});
