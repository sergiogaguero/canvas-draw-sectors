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
import { ConfigStoreNewComponent } from '../../components/config-store-new/config-store-new.component';

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
import { Router } from '@angular/router';
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


describe('ConfigStoreNewComponent', () => {
    let comp: ConfigStoreNewComponent;
    let fixture: ComponentFixture<ConfigStoreNewComponent>;
    let _storesService: StoresService;
    let _userService: UserService;
    let _regionsService: RegionsService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ConfigStoreNewComponent,
                MessageDialog
            ],
            imports: [
                MaterialModule,
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
                { provide: RouterTestingModule, useClass: MockRouter }
            ]
        });

        TestBed.overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [
                    MessageDialog
                ]
            }
        });
        TestBed.compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfigStoreNewComponent);
        _storesService = TestBed.get(StoresService);
        _userService = TestBed.get(UserService);
        _regionsService = TestBed.get(RegionsService);

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

        it('shouldn\'t let you save', () => {
            comp.saveStore();
            expect(comp.addStore.valid).toBeFalsy('Form should be invalid!');
        });
    });

    it('should let you create a store with valid data',
        inject([Router], (router: Router) => {
            comp.store = {
                name: 'New store!',
                idinCustomerDB: 'totally new store',
                companyId: 1,
                regionId: 1,
                responsableId: 1,
                timeZoneOffset: 0,
                locationLat: '0',
                locationLong: '0',
                address: 'asda',
                storeId: 3
            };
            fixture.detectChanges();
            spyOn(_storesService, 'addStore').and.returnValue(Observable.of(comp.store));
            const spy = spyOn(router, 'navigateByUrl');
            comp.saveStore();
            expect(comp.addStore.valid).toBeTruthy('Form should be ok');
            expect(_storesService.addStore).toHaveBeenCalled();
            const url = spy.calls.first().args[0];
            expect(url.toString()).toBe('/settings/stores/' + comp.store.storeId);
        })
    );

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
