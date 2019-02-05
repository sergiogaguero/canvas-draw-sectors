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
    ConfigRegionsComponent,
    AddRegionDialog,
    DeleteRegionDialog,
    EditRegionDialog
} from '../../components/config-regions/config-regions.component';

// service & stub :)
import { RegionsService } from '../../services/regions.service';
import { RegionsServiceStub } from '../stubs/regions.service.stub';
import { UserService } from '../../services/user.service';
import { UserServiceStub } from '../stubs/user.service.stub';

// Translation
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { MessageDialog } from '../../components/message-dialog/message-dialog.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Region } from '../../classes/region';
import { Constants } from '../../classes/constants';
const translationsMock = {
    'config': {
        'regions': {
            'title': 'Regions',
            'subtitle': 'Regions Listing',
            'listStores': 'Stores Listings',
            'deleteRegion': 'Delete Region',
            'has': 'has',
            'msjDeleteRegion': 'assigned stores',
            'textDeleteRegion': 'to be able to delete it, you must re-assign',
            'textDeleteRegion2': 'the associated stores to a different region',
            'seeStores': 'See stores',
            'editRegion': 'Edit region',
            'addRegion': 'New region',
            'namePlaceholder': 'Reion name',
            'responsablePlaceholder': 'Region responsible',
            'region': 'Region',
            'responsable': 'Responsible',
            'stores': 'Stores',
            'actions': 'Actions',
            'noRegionsErrorTitle': 'No regions have been uploaded... yet',
            'noRegionsError': 'It\'s never a bad time to create the first region for your company.',
            'edit': {
                'title': 'Regions',
                'editRegion': 'Edit Region',
                'regionNameError': 'The region name accepts only letters or numbers.',
                'selectResponsableRegion': 'Select the responsible name',
                'regionResponsableError': 'Please, select a responsible for this region.'
            },
            'add': {
                'title': 'Regions',
                'newRegion': 'New region',
                'regionNameError': 'The region name accepts only letters or numbers.',
                'selectResponsableRegion': 'Select the responsible name',
                'regionResponsableError': 'Please, select a responsible for this region.'
            },
            'delete': {
                'title': 'Regions',
                'deleteRegion': 'Delete Region',
                'showStores': 'see stores'
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


describe('ConfigRegionsComponent ', () => {
    let comp: ConfigRegionsComponent;
    let fixture: ComponentFixture<ConfigRegionsComponent>;
    let _regionsService: RegionsService;
    let _userService: UserService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ConfigRegionsComponent,
                AddRegionDialog,
                DeleteRegionDialog,
                EditRegionDialog,
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
                { provide: RegionsService, useClass: RegionsServiceStub },
                { provide: UserService, useClass: UserServiceStub }
            ]
        });

        TestBed.overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [
                    AddRegionDialog,
                    DeleteRegionDialog,
                    EditRegionDialog,
                    MessageDialog
                ]
            }
        });
        TestBed.compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfigRegionsComponent);
        _regionsService = TestBed.get(RegionsService);
        _userService = TestBed.get(UserService);

        comp = fixture.componentInstance; // test instance
    });

    it('should have some regions onInit', () => {
        _regionsService.getRegions().subscribe(response => {
            fixture.detectChanges();
            expect(comp.regiones).toBe(response,
                'Should have expected the correct regions to be loaded');
        });
    });

    it('should update regions on refreshRegion()', () => {
        comp.regiones = [];
        _regionsService.getRegions().subscribe(response => {
            comp.refreshRegion();
            fixture.detectChanges();
            expect(comp.regiones).toBe(response,
                'Should have expected the correct regions to be loaded');
        });
    });

    describe('when adding regions', () => {
        it('should open the dialog when openCreateRegion()', () => {
            const dialogRef = comp.openCreateRegion();
            fixture.detectChanges();
            // make sure it starts with the appropiate info
            expect(dialogRef.componentInstance instanceof AddRegionDialog).toBe(true);
            expect(dialogRef.componentInstance.data.name).toBe('');
            expect(dialogRef.componentInstance.data.responsableId).toBe(null);
            // make sure the managers list is properly populated
            _userService.getUsersByRole(Constants.roles.regionMgr).subscribe(managers => {
                expect(dialogRef.componentInstance.responsables.length).toBe(managers.length);
            });

            // make sure the form is not valid by default
            dialogRef.componentInstance.validate();
            fixture.detectChanges();
            expect(dialogRef.componentInstance.addRegion.valid).toBe(false);
        });

        it('createRegion() should create the region', () => {
            _regionsService.getRegions().subscribe(regions => {
                const futureRegionId = regions.length + 1;
                const region = { name: 'New region', responsableId: 1 };
                comp.createRegion(region);
                fixture.detectChanges();

                _regionsService.getRegions().subscribe(resultRegions => {
                    expect(resultRegions.filter(r => r.regionId === futureRegionId)[0].name).toBe(region.name);
                });
            });
        });
    });

    describe('when editing regions', () => {
        let regionToModify: Region;
        beforeEach(() => {
            regionToModify = {
                regionId: 1,
                name: 'Region 1',
                responsableId: 1,
                responsable: {
                    name: 'Peter',
                    lastname: 'Region',
                    accountId: 1
                },
                stores: []
            };
        });

        it('should open the dialog when openEditRegion()', () => {
            const dialogRef = comp.openEditRegion(regionToModify);
            fixture.detectChanges();
            expect(dialogRef.componentInstance instanceof EditRegionDialog).toBe(true,
                'The dialog class should match EditRegionDialog');
            expect(dialogRef.componentInstance.data.name).toBe(regionToModify.name,
                'The region name should match the one from the object that was sent to the dialog');
            expect(dialogRef.componentInstance.data.responsableId).toBe(regionToModify.responsableId,
                'The responsable id should match the one from the object that was sent to the dialog');

            dialogRef.componentInstance.validate();
            fixture.detectChanges();
            expect(dialogRef.componentInstance.editRegion.valid).toBe(true);
            // make sure the managers list is properly populated
            _userService.getUsersByRole(Constants.roles.regionMgr).subscribe(managers => {
                expect(dialogRef.componentInstance.responsables.length).toBe(managers.length,
                    'The Region Managers should match the ones in the service');
            });

            dialogRef.componentInstance.editRegion.controls['regionName'].setValue('');
            dialogRef.componentInstance.validate();
            expect(dialogRef.componentInstance.editRegion.valid).toBe(false,
                'An empty Region Name should make the form invalid');
        });

        it('editRegion() should modify the region', () => {
            regionToModify.name = 'Successfully modified';
            comp.editRegion(regionToModify);
            fixture.detectChanges();
            _regionsService.getRegions().subscribe(resultRegions => {
                expect(resultRegions.filter(r => r.regionId === regionToModify.regionId)[0].name).toBe(regionToModify.name,
                'Region name should\'ve changed after being edited');
            });
        });
    });

    describe('when deleting regions', () => {
        let regionToDelete: Region;
        beforeEach(() => {
            regionToDelete = {
                regionId: 1,
                name: 'Region 1',
                responsableId: 1,
                responsable: {
                    name: 'Peter',
                    lastname: 'Region',
                    accountId: 1
                },
                stores: []
            };
        });

        it('should open the dialog when openDeleteRegion()', () => {
            const dialogRef = comp.openDeleteRegion(regionToDelete);
            fixture.detectChanges();
            expect(dialogRef.componentInstance instanceof DeleteRegionDialog).toBe(true);
            expect(dialogRef.componentInstance.data.name).toBe(regionToDelete.name);
            expect(dialogRef.componentInstance.data.regionId).toBe(regionToDelete.regionId);
        });

        it('deleteRegion() should delete the region', () => {
            comp.deleteRegion(regionToDelete.regionId);
            fixture.detectChanges();
            _regionsService.getRegions().subscribe(resultRegions => {
                expect(resultRegions.filter(r => r.regionId === regionToDelete.regionId).length).toBe(0);
            });
        });
    });
});
