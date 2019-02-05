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
import { RouterTestingModule } from '@angular/router/testing';
import { Constants } from '../../classes/constants';
import { ChartsModule } from 'ng2-charts';

// Testing basics
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async } from '@angular/core/testing';

// component
import { ReportVisitorsComponent } from '../../components/report-visitors/report-visitors.component';

// service & stub :)
import { FloorsService } from '../../services/floors.service';
import { FloorsServiceStub } from '../stubs/floors.service.stub';
import { MapsService } from '../../services/maps.service';
import { MapsServiceStub } from '../stubs/maps.service.stub';
import { StoresServiceStub } from '../stubs/stores.service.stub';
import { StoresService } from '../../services/stores.service';
import { RegionsService } from '../../services/regions.service';
import { RegionsServiceStub } from '../stubs/regions.service.stub';
import { AuthService } from '../../services/auth.service';
import { AuthServiceStub } from '../stubs/auth.service.stub';
import { UserService } from '../../services/user.service';
import { UserServiceStub } from '../stubs/user.service.stub';
import { KpisService } from '../../services/kpis.service';
import { KpisServiceStub } from '../stubs/kpis.service.stub';


// Translation
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { Region } from '../../classes/region';
import { Store } from '../../classes/store';
import { Floor } from '../../classes/floor';
import { Blueprint } from '../../classes/blueprint';
import { Subscription } from 'rxjs';

const translationsMock = {
    'reportRegion': {
        'titleChartVisit': 'Visitors per day',
        'titleChartAverage': 'Average Dwell time',
        'minute': 'Minutes',
        'errorTitle': 'There\'s something wrong... that just ain\'t right'
    }
};
class FakeLoader implements TranslateLoader {
    getTranslation(lang: string): Observable<any> {
        return Observable.of(translationsMock);
    }
}

describe('ReportVisitorsComponent', () => {
    let comp: ReportVisitorsComponent;
    let fixture: ComponentFixture<ReportVisitorsComponent>;
    let _authService: AuthService;
    let _userService: UserService;
    let _regionsService: RegionsService;
    let _storesService: StoresService;
    let _floorsService: FloorsService;
    let _blueprintsService: MapsService;
    let _kpisService: KpisService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ReportVisitorsComponent
            ],
            imports: [
                MaterialModule,
                RouterTestingModule,
                FormsModule,
                BrowserModule,
                ReactiveFormsModule,
                BrowserAnimationsModule,
                HttpClientTestingModule,
                ChartsModule,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                })
            ], providers: [
                { provide: MapsService, useClass: MapsServiceStub },
                { provide: FloorsService, useClass: FloorsServiceStub },
                { provide: StoresService, useClass: StoresServiceStub },
                { provide: RegionsService, useClass: RegionsServiceStub },
                { provide: AuthService, useClass: AuthServiceStub },
                { provide: UserService, useClass: UserServiceStub },
                { provide: KpisService, useClass: KpisServiceStub },
            ]
        });

        TestBed.compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ReportVisitorsComponent);
        comp = fixture.componentInstance; // test instance
        _authService = TestBed.get(AuthService);
        _userService = TestBed.get(UserService);
        _regionsService = TestBed.get(RegionsService);
        _storesService = TestBed.get(StoresService);
        _floorsService = TestBed.get(FloorsService);
        _blueprintsService = TestBed.get(MapsService);
        _kpisService = TestBed.get(KpisService);
    });

    it('onInit() should go fetch the user info', () => {
        spyOn(comp, 'getUsersRole');
        fixture.detectChanges();
        expect(comp.getUsersRole).toHaveBeenCalled();
    });

    it('on getUserRole should fetch the user role', () => {
        const fakeUserId = 1;
        spyOn(comp, 'checkUserPermissions');
        spyOn(_userService, 'getDetailUser').and.returnValue(Observable.of([{
            'accountId': 1,
            'userId': 1,
            'name': 'Javier',
            'lastname': 'Coppis',
            'roleId': 3,
            'timezone': null,
            'user': {
                'userId': 1,
                'tenantId': 1,
                'email': 'j@grupoassa.com',
                'emailVerified': true,
                'langId': 1
            },
            'role': {
                'roleId': 4,
                'name': 'Vendedor'
            }
        }]));
        fixture.detectChanges();
        expect(_userService.getDetailUser).toHaveBeenCalled();
        expect(comp.checkUserPermissions).toHaveBeenCalled();
    });

    it('on checkUserPermissions() fetch the roles permissions', () => {
        comp.roleName = Constants.roles.admin;
        spyOn(_authService, 'isRoleAuthorized').and.returnValue(Observable.of(true).toPromise());
        comp.checkUserPermissions();
        expect(_authService.isRoleAuthorized).toHaveBeenCalled();
    });

    it('on changeMonth() fetch report data', () => {
        spyOn(comp, 'getReportData');
        comp.changeMonth(-1);
        expect(comp.getReportData).toHaveBeenCalled();
    });

    it('on getDaysInMonth() load labels for the report', () => {
        comp.getDaysInMonth();
        expect(comp.barChartLabels.length).toBe(comp.currentlyShownMonth.daysInMonth());
    });

    describe('on getReportsData()', () => {
        let data;
        beforeEach(() => {
            data = {
                store: 'Store 1',
                averageDwellTimePerDay: [],
                visitsPerDay: []
            };
        });

        it('if there\'s no data, the error flag should pop up', () => {
            spyOn(_kpisService, 'getVisitors').and.returnValue(Observable.of([]));
            comp.getReportData();
            expect(comp.noDataError).toBeTruthy();
            expect(_kpisService.getVisitors).toHaveBeenCalled();
        });


        it('if there\'s any data, the chart variables should populate', () => {
            spyOn(_kpisService, 'getVisitors').and.returnValue(Observable.of([data]));
            comp.getReportData();
            expect(comp.noDataError).toBeFalsy();
            expect(_kpisService.getVisitors).toHaveBeenCalled();
            expect(comp.barChartDataDwell[0].data).toBe(data.averageDwellTimePerDay);
            expect(comp.barChartDataVisit[0].data).toBe(data.visitsPerDay);
        });

        it('if there\'s a region selected on the dropdown and it doesn\'t have any stores, there should be an error',
            () => {
                comp.reportSubscription = _kpisService.getVisitors('', '').subscribe();
                comp.selectedRegion = 1;
                comp.regions = [{
                    regionId: 1,
                    name: 'Region 1',
                    stores: [],
                    responsableId: 1
                }];
                comp.getReportData();
                expect(comp.noStoresError).toBeTruthy();
                expect(comp.loading).toBeFalsy();
            });

        it('if you\'re a store mgr should get the data with your account ID',
            () => {
                comp.selectedRegion = -1;
                comp.regions = [{
                    regionId: 1,
                    name: 'Region 1',
                    stores: [],
                    responsableId: 1
                }];
                comp.roleName = Constants.roles.storeMgr;
                comp.accountId = 1;
                spyOn(_kpisService, 'getVisitors').and.returnValue(Observable.of([data]));
                comp.getReportData();

                expect(_kpisService.getVisitors).toHaveBeenCalledWith(
                    comp.currentlyShownMonth.format('YYYY'),
                    comp.currentlyShownMonth.format('MM'),
                    { storeManager: 1 }
                );
            });

        it('if you\'re a regional mgr and have picked "all regions" it should get the data with your account ID',
            () => {
                comp.selectedRegion = -1;
                comp.roleName = Constants.roles.regionMgr;
                comp.accountId = 1;
                spyOn(_kpisService, 'getVisitors').and.returnValue(Observable.of([data]));
                comp.getReportData();

                expect(_kpisService.getVisitors).toHaveBeenCalledWith(
                    comp.currentlyShownMonth.format('YYYY'),
                    comp.currentlyShownMonth.format('MM'),
                    { regionManager: 1 }
                );
            });

        it('if you\'ve picked a specific region it should get the data of all stores in said region',
            () => {
                comp.selectedRegion = 1;
                comp.regions = [{
                    regionId: 1,
                    name: 'Region 1',
                    stores: [{
                        name: 'Store 1',
                        storeId: 1,
                        responsableId: 1,
                        regionId: 1,
                        locationLat: '',
                        locationLong: '',
                        address: '',
                        companyId: 1,
                        idinCustomerDB: '',
                        timeZoneOffset: 0
                    }],
                    responsableId: 1
                }];
                spyOn(_kpisService, 'getVisitors').and.returnValue(Observable.of([data]));
                comp.getReportData();

                expect(_kpisService.getVisitors).toHaveBeenCalledWith(
                    comp.currentlyShownMonth.format('YYYY'),
                    comp.currentlyShownMonth.format('MM'),
                    { regionId: 1 }
                );
            });
    });

    describe('on checkForBasicSystemInfo()', () => {
        let regions: Region[];
        let stores: Store[];
        let floors: Floor[];
        let blueprints: Blueprint[];

        beforeEach(() => {
            regions = [{
                regionId: 2,
                name: 'Region 2',
                responsableId: 2,
                responsable: {
                    name: 'John',
                    lastname: 'Region',
                    accountId: 2
                }
            }];
            stores = [{
                'storeId': 1,
                'name': 'sarasa',
                'regionId': 1,
                'responsableId': 3,
                'locationLat': '-37.326238700000005',
                'locationLong': '-59.13289109999999',
                'companyId': 1,
                address: '',
                'idinCustomerDB': '123456789',
                timeZoneOffset: 0
            }];
            floors = [{
                name: 'Floor 1',
                storeId: 1
            }];
            blueprints = [{
                mapId: 1,
                name: 'Blueprint #1',
                startingDate: new Date().toDateString(),
                floorId: 1,
                width: 10,
                height: 10
            }];
        });

        it('should show an error if no regions', () => {
            spyOn(_regionsService, 'getRegions').and.returnValue(Observable.of([]));
            comp.checkForBasicSystemInfo();
            expect(_regionsService.getRegions).toHaveBeenCalled();
            expect(comp.noRegionsError).toBeTruthy();
            expect(comp.noStoresError).toBeFalsy();
            expect(comp.noFloorsError).toBeFalsy();
            expect(comp.noMapsError).toBeFalsy();
        });

        describe('when there\'s regions but no stores', () => {
            it('should load your regions if you\'re a regional manager', () => {
                spyOn(_regionsService, 'getRegions').and.returnValue(Observable.of(regions));
                spyOn(_storesService, 'getStores').and.returnValue(Observable.of([]));
                comp.accountId = 2;
                comp.roleName = Constants.roles.regionMgr;
                comp.checkForBasicSystemInfo();
                expect(_regionsService.getRegions).toHaveBeenCalled();
                expect(_storesService.getStores).toHaveBeenCalled();
                expect(comp.regions[0]).toBe(regions[0]);
                expect(comp.noRegionsError).toBeFalsy();
                expect(comp.noStoresError).toBeTruthy();
                expect(comp.noFloorsError).toBeFalsy();
                expect(comp.noMapsError).toBeFalsy();
            });

            it('should raise the regional flag if you\'re a regional manager with no associated regions', () => {
                spyOn(_regionsService, 'getRegions').and.returnValue(Observable.of(regions));
                comp.accountId = 9999;
                comp.roleName = Constants.roles.regionMgr;
                comp.checkForBasicSystemInfo();
                expect(_regionsService.getRegions).toHaveBeenCalled();
                expect(comp.regions.length).toBe(0);
                expect(comp.noRegionsError).toBeTruthy('Should raise the "no regions" flag');
                expect(comp.noStoresError).toBeFalsy();
                expect(comp.noFloorsError).toBeFalsy();
                expect(comp.noMapsError).toBeFalsy();
            });

            it('should load all regions if you\'re an admin', () => {
                spyOn(_regionsService, 'getRegions').and.returnValue(Observable.of(regions));
                spyOn(_storesService, 'getStores').and.returnValue(Observable.of([]));
                comp.accountId = 1;
                comp.roleName = Constants.roles.admin;
                comp.checkForBasicSystemInfo();
                expect(comp.regions).toBe(regions);
                expect(_regionsService.getRegions).toHaveBeenCalled();
                expect(_storesService.getStores).toHaveBeenCalled();
                expect(comp.noRegionsError).toBeFalsy();
                expect(comp.noStoresError).toBeTruthy();
                expect(comp.noFloorsError).toBeFalsy();
                expect(comp.noMapsError).toBeFalsy();
            });
        })

        it('should show an error if no floors', () => {
            spyOn(_regionsService, 'getRegions').and.returnValue(Observable.of(regions));
            spyOn(_storesService, 'getStores').and.returnValue(Observable.of(stores));
            spyOn(_floorsService, 'getFloors').and.returnValue(Observable.of([]));
            comp.checkForBasicSystemInfo();
            expect(_regionsService.getRegions).toHaveBeenCalled();
            expect(_storesService.getStores).toHaveBeenCalled();
            expect(_floorsService.getFloors).toHaveBeenCalled();
            expect(comp.noRegionsError).toBeFalsy();
            expect(comp.noStoresError).toBeFalsy();
            expect(comp.noFloorsError).toBeTruthy();
            expect(comp.noMapsError).toBeFalsy();
        });

        it('should show an error if no blueprints', () => {
            spyOn(_regionsService, 'getRegions').and.returnValue(Observable.of(regions));
            spyOn(_storesService, 'getStores').and.returnValue(Observable.of(stores));
            spyOn(_floorsService, 'getFloors').and.returnValue(Observable.of(floors));
            spyOn(_blueprintsService, 'getMaps').and.returnValue(Observable.of([]));
            comp.checkForBasicSystemInfo();
            expect(_regionsService.getRegions).toHaveBeenCalled();
            expect(_storesService.getStores).toHaveBeenCalled();
            expect(_floorsService.getFloors).toHaveBeenCalled();
            expect(_blueprintsService.getMaps).toHaveBeenCalled();
            expect(comp.noRegionsError).toBeFalsy();
            expect(comp.noStoresError).toBeFalsy();
            expect(comp.noFloorsError).toBeFalsy();
            expect(comp.noMapsError).toBeTruthy();
        });

        it('should show no errors if data is found for all levels', () => {
            spyOn(_regionsService, 'getRegions').and.returnValue(Observable.of(regions));
            spyOn(_storesService, 'getStores').and.returnValue(Observable.of(stores));
            spyOn(_floorsService, 'getFloors').and.returnValue(Observable.of(floors));
            spyOn(_blueprintsService, 'getMaps').and.returnValue(Observable.of(blueprints));
            comp.checkForBasicSystemInfo();
            expect(_regionsService.getRegions).toHaveBeenCalled();
            expect(_storesService.getStores).toHaveBeenCalled();
            expect(_floorsService.getFloors).toHaveBeenCalled();
            expect(_blueprintsService.getMaps).toHaveBeenCalled();
            expect(comp.noRegionsError).toBeFalsy();
            expect(comp.noStoresError).toBeFalsy();
            expect(comp.noFloorsError).toBeFalsy();
            expect(comp.noMapsError).toBeFalsy();
        });
    });

});
