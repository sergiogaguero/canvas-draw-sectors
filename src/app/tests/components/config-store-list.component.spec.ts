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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async } from '@angular/core/testing';

// component
import {
    ConfigStoreListComponent,
    DeleteStoreDialog
} from '../../components/config-store-list/config-store-list.component';

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
import { AuthService } from '../../services/auth.service';
import { AuthServiceStub } from '../stubs/auth.service.stub';
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


describe('ConfigStoreListComponent', () => {
    let comp: ConfigStoreListComponent;
    let fixture: ComponentFixture<ConfigStoreListComponent>;
    let _storesService: StoresService;
    let _userService: UserService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ConfigStoreListComponent,
                DeleteStoreDialog,
                MessageDialog
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
                })
            ], providers: [
                { provide: StoresService, useClass: StoresServiceStub },
                { provide: UserService, useClass: UserServiceStub },
                { provide: AuthService, useClass: AuthServiceStub }
            ]
        });

        TestBed.overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [
                    DeleteStoreDialog,
                    MessageDialog
                ]
            }
        });
        TestBed.compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfigStoreListComponent);
        _storesService = TestBed.get(StoresService);
        _userService = TestBed.get(UserService);

        comp = fixture.componentInstance; // test instance
    });

    it('should have some stores onInit', () => {
        spyOn(_storesService, 'getStores').and.returnValue(Observable.of([]));
        fixture.detectChanges();
        expect(_storesService.getStores).toHaveBeenCalled();
    });

    describe('when deleting stores', () => {
        let storeToDelete: Store;
        beforeEach(() => {
            storeToDelete = {
                'storeId': 1,
                'name': 'sarasa',
                'regionId': 1,
                'responsableId': 3,
                'locationLat': '-37.326238700000005',
                'locationLong': '-59.13289109999999',
                'companyId': 1,
                'idinCustomerDB': '123456789',
                timeZoneOffset: 0,
                address: '',
                'floors': []
            };
        });

        it('should open the dialog when openDeleteStoreDialog()', () => {
            const dialogRef = comp.openDeleteStoreDialog(storeToDelete);
            expect(dialogRef.componentInstance instanceof DeleteStoreDialog).toBe(true);
            expect(dialogRef.componentInstance.data.name).toBe(storeToDelete.name);
            expect(dialogRef.componentInstance.data.regionId).toBe(storeToDelete.storeId);
            dialogRef.componentInstance.onNoClick();
        });

        it('deleteStore() should delete the store', () => {
            spyOn(_storesService, 'deleteStore').and.returnValue(Observable.of([]));
            comp.deleteStore(storeToDelete.storeId);
            expect(_storesService.deleteStore).toHaveBeenCalled();
        });
    });
});
