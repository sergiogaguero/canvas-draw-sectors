// Testing basics
import { ComponentFixture, TestBed, inject, getTestBed, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async } from '@angular/core/testing';
import { By, BrowserModule } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { DebugElement } from '@angular/core';

// Components
import { StoreOperationsComponent } from '../../components/store-operations/store-operations.component';

// Translations
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

// services
import { RegionsService } from '../../services/regions.service';
import { UserService } from '../../services/user.service';
import { KpisService } from '../../services/kpis.service';


// pipes
import { CapitalizePipe } from '../../pipes/capitalize.pipe';
import { FormatPipe } from '../../pipes/format.pipe';

// import { Moment } from 'moment';
import { environment as env } from '../../../environments/environment';
import { Constants } from '../../classes/constants';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableDataSource } from '@angular/material';
import { UserServiceStub } from 'app/tests/stubs/user.service.stub';
import { RegionsServiceStub } from 'app/tests/stubs/regions.service.stub';
import { KpisServiceStub } from 'app/tests/stubs/kpis.service.stub';
import { format } from 'path';
import { AuthService } from 'app/services/auth.service';
import { AuthServiceStub } from 'app/tests/stubs/auth.service.stub';
import { StoresServiceStub } from 'app/tests/stubs/stores.service.stub';
import { StoresService } from 'app/services/stores.service';
import { FloorsServiceStub } from 'app/tests/stubs/floors.service.stub';
import { FloorsService } from 'app/services/floors.service';
import { MapsServiceStub } from 'app/tests/stubs/maps.service.stub';
import { MapsService } from 'app/services/maps.service';
import { Floor } from 'app/classes/floor';

const baseURL = `http://${env.host}:${env.port}/api/`;

const translationsMock = {
    'store-operations': {
        'storeOperations': 'Store Operations',
        'noStoreError': 'There are no stores for this region.',
        'noFloorsErrorTitle': 'Ops! We ve found no floors.',
        'noFloorsError': 'It seems like there are no floors uploaded for this store.',
        'isAssociate': 'Hello! The mobile application for the seller will be available soon',
        'noMapErrorTitle': 'This floor doesnt have a blueprint!',
        'noMapError': 'Due to this, we cant log any visitors who may have stopped by.',
        'noActiveMapErrorTitle': 'Oops! We cant show you anything here',
        'noActiveMapError': 'There are no active for this floor in the date you selected.',
        'seeMaps': 'See blueprints',
        'quantityOfVisitors': 'Visitors',
        'averageTime': 'average time',
        'minutes': '[minutes]',
        'conversionToBuyers': 'Conversion',
        'averageTicket': 'average ticket',
        'moneyTicket': '[$ / tickets]'
    },
    'config': {
        'store': {
            'add': {
                'addStore': 'Add Store'
            },
            'edit': {
                'floor': {
                    'addMap': 'Add blueprint'
                }
            }
        },
        'regions': {
            'addRegion': 'New region'
        }
    },
    'general': {
        'regions': 'Regions',
        'stores': 'Stores',
        'dateDefault': 'Date',
        'floors': 'Floors'
    },
    'errors': {
        'contactAdmin': 'Get in touch with an admin to make sure that they upload the information that we need.',
        'noRegionError': 'There are no regions for this company.',
    }
}

class FakeLoader implements TranslateLoader {
    getTranslation(lang: string): Observable<any> {
        return Observable.of(translationsMock);
    }
}

describe('StoreOperationsComponent', () => {
    let fixture: ComponentFixture<StoreOperationsComponent>;
    let _regionsService: RegionsService;
    let _storeService: StoresService;
    let _userService: UserService;
    let _authService: AuthService;
    let comp: StoreOperationsComponent;


    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule,
                NoopAnimationsModule,
                RouterTestingModule,
                MaterialModule,
                FormsModule,
                ReactiveFormsModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader, useClass: FakeLoader
                    },
                }),
            ],
            providers: [
                { provide: UserService, useClass: UserServiceStub },
                FormatPipe,
                { provide: RegionsService, useClass: RegionsServiceStub },
                { provide: KpisService, useClass: KpisServiceStub },
                { provide: AuthService, useClass: AuthServiceStub },
                { provide: StoresService, useClass: StoresServiceStub },
                { provide: FloorsService, useClass: FloorsServiceStub },
                { provide: MapsService, useClass: MapsServiceStub },
                CapitalizePipe
            ],
            declarations: [StoreOperationsComponent,
                CapitalizePipe,
                FormatPipe,
            ],
        })
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StoreOperationsComponent);
        _regionsService = TestBed.get(RegionsService);
        _storeService = TestBed.get(StoresService);
        _userService = TestBed.get(UserService);
        _authService = TestBed.get(AuthService);

        comp = fixture.componentInstance; // test instance
    });

    describe('On getAdminData()', () => {
        it('should bring regions for admin role', () => {
            spyOn(_regionsService, 'getRegions')
                .and
                .returnValue(Observable.of([]));
            comp.getAdminData();
            expect(_regionsService.getRegions).toHaveBeenCalled();
        });
    });

    describe('On responseAdminData()', () => {
        it('should return false if response.length < 1', () => {
            comp.dateDefault = moment();
            comp.responseAdminData([]);
            expect(comp.dataResponse).toBe(false);
        });

        it('should return true if response.length > 0', () => {
            comp.dateDefault = moment();
            comp.responseAdminData([1]);
            expect(comp.dataResponse).toBe(true);
        })
    });

    describe('On getRegionMgrData()', () => {
        it('should bring data for region manager role', () => {
            spyOn(_regionsService, 'getRegionByManager')
                .and
                .returnValue(Observable.of({
                    regionId: 2,
                    name: 'Region 2',
                    responsableId: 2,
                    responsable: {
                        name: 'John',
                        lastname: 'Region',
                        accountId: 2
                    },
                    stores: []
                }));
            comp.dateDefault = moment();
            comp.getRegionMgrData();
            expect(_regionsService.getRegionByManager).toHaveBeenCalled();
        });
    });

    describe('On responseRegionMgrData()', () => {
        it('should change value of dataResponse with parameter defined', () => {
            let response = {
                regionId: 2,
                name: 'Region 2',
                responsableId: 2,
                responsable: {
                    name: 'John',
                    lastname: 'Region',
                    accountId: 2
                },
                stores: []
            }
            comp.dateDefault = moment();
            comp.dataResponse = false;
            comp.responseRegionMgrData(response);
            expect(comp.dataResponse).toBeTruthy();
        });
    });

    describe('On responseRegionMgrData()', () => {
        it('should change value of dataResponse with parameter undefined', () => {
            comp.dataResponse = true;
            let parameter: undefined;
            comp.responseRegionMgrData(parameter);
            expect(comp.dataResponse).toBeFalsy();
        });
    });

    describe('On getStoreMgrData()', () => {
        it('should bring data for StoreMgr role', () => {
            spyOn(_storeService, 'getStoreByManager')
                .and
                .returnValue(Observable.of(
                    {
                        'storeId': 1,
                        'name': 'sarasa',
                        'regionId': 1,
                        'responsableId': 3,
                        'locationLat': '-37.326238700000005',
                        'locationLong': '-59.13289109999999',
                        'companyId': 1,
                        'idinCustomerDB': '123456789',
                        'responsable': {
                            'accountId': 3,
                            'userId': 3,
                            'name': 'Javier',
                            'lastname': 'Coppis',
                            'roleId': 2,
                        },
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
                        ],
                        'company': {
                            'companyId': 1,
                            'name': 'MULTIMAX',
                            'legalName': 'MULTIMAX',
                            'language': 1
                        },
                        'region': {
                            'regionId': 1,
                            'name': 'javotilandia ',
                            'responsableId': 38
                        }
                    }
                ));
            comp.dateDefault = moment();
            comp.getStoreMgrData();
            expect(_storeService.getStoreByManager).toHaveBeenCalled();
        })
    });

    describe('On responseStoreMgrData', () => {
        it('should set value dataResponse = false with null parameter', () => {
            this.dataResponse = true;
            let parameter: null;
            comp.responseStoreMgrData(parameter);
            expect(comp.dataResponse).toBeFalsy();
        });

        it('should ', () => {
            const stores = [
                {
                    'storeId': 1,
                    'name': 'sarasa',
                    'regionId': 1,
                    'responsableId': 3,
                    'locationLat': '-37.326238700000005',
                    'locationLong': '-59.13289109999999',
                    'companyId': 1,
                    'idinCustomerDB': '123456789',
                    'responsable': {
                        'accountId': 3,
                        'userId': 3,
                        'name': 'Javier',
                        'lastname': 'Coppis',
                        'roleId': 2,
                    },
                    'floors': [],
                    'company': {
                        'companyId': 1,
                        'name': 'MULTIMAX',
                        'legalName': 'MULTIMAX',
                        'language': 1
                    },
                    'region': {
                        'regionId': 1,
                        'name': 'javotilandia ',
                        'responsableId': 38
                    }
                }
            ];
            comp.dateDefault = moment();
            comp.responseStoreMgrData(stores);
            expect(comp.floors).toEqual([]);
        });
    });

    describe('On updateKpis()', () => {
        it('should set values on 0', () => {
            comp.averageTicket = 1;
            comp.visitsPerDay = 1;
            comp.averageTime = 1;
            comp.conversionToBuyers = 1;
            comp.dateDefault = moment();
            comp.updateKpis();
            expect(comp.averageTicket).toBeGreaterThan(-1);
            expect(comp.visitsPerDay).toBeGreaterThan(-1);
            expect(comp.averageTime).toBeGreaterThan(-1);
            expect(comp.conversionToBuyers).toBeGreaterThan(-1)
        });
    });

    describe('On responseGetStoreByRegionId()', () => {
        it('should set value loading = false and noStoreError = true', () => {
            comp.loading = true;
            this.noStoreError = false;
            comp.responseGetStoreByRegionId([]);
            expect(comp.loading).toBeFalsy();
            expect(comp.noStoreError).toBeTruthy();
        });
    });

    describe('On responseGetFloorsByStore()', () => {
        it('should set value noFloorsError = true and loading = false', () => {
            comp.noFloorsError = false;
            comp.loading = true;
            comp.dateDefault = moment();
            comp.responseGetFloorsByStore([]);
            expect(comp.noFloorsError).toBeTruthy();
            expect(comp.loading).toBeFalsy();
        });
    });

    describe('onInit()', () => {
        it('should check if services was called ', () => {
            spyOn(_userService, 'getDetailUser')
                .and
                .returnValue(Observable.of([
                    {
                        accountId: 1,
                        role: {
                            name: 'test'
                        }
                    }
                ]));
            spyOn(_authService, 'isRoleAuthorized')
                .and
                .returnValue(Observable.of(true).toPromise());
            comp.getUserRole();
            expect(_userService.getDetailUser).toHaveBeenCalled();
            expect(_authService.isRoleAuthorized).toHaveBeenCalled();
            fixture.detectChanges();
        });
    });

    describe('On getUserRole()', () => {
        it('should bring the correct data for Admin role', () => {
            spyOn(_userService, 'getDetailUser')
                .and
                .returnValue(Observable.of([
                    {
                        'accountId': 1,
                        'userId': 1,
                        'name': 'Sergo',
                        'lastname': 'Aguero',
                        'roleId': 1,
                        'timezone': '2017-08-29T12:12:31.949Z',
                        'user': {
                            'userId': 1,
                            'tenantId': 1,
                            'email': 'ocpqa@grupoassa.com',
                            'emailVerified': true,
                            'langId': 1,
                            'language': {
                                'key': 'ES'
                            }
                        },
                        'role': {
                            'roleId': 1,
                            'name': 'Admin'
                        }
                    }
                ]));
            comp.dateDefault = moment();
            spyOn(_authService, 'isRoleAuthorized')
                .and
                .returnValue(Observable.of(true).toPromise());

            comp.getUserRole();
            expect(comp.roleName).toBe(Constants.roles.admin);
            expect(_userService.getDetailUser).toHaveBeenCalled();
            expect(_authService.isRoleAuthorized).toHaveBeenCalled();
        });

        it('should bring the correct data for GteRed role', () => {
            spyOn(_userService, 'getDetailUser')
                .and
                .returnValue(Observable.of([
                    {
                        'accountId': 1,
                        'userId': 1,
                        'name': 'Sergo',
                        'lastname': 'Aguero',
                        'roleId': 1,
                        'timezone': '2017-08-29T12:12:31.949Z',
                        'user': {
                            'userId': 1,
                            'tenantId': 1,
                            'email': 'ocpqa@grupoassa.com',
                            'emailVerified': true,
                            'langId': 1,
                            'language': {
                                'key': 'ES'
                            }
                        },
                        'role': {
                            'roleId': 1,
                            'name': 'GteRed'
                        }
                    }
                ]));
            comp.dateDefault = moment();
            spyOn(_authService, 'isRoleAuthorized')
                .and
                .returnValue(Observable.of(true).toPromise());

            comp.getUserRole();
            expect(comp.roleName).toBe(Constants.roles.regionMgr);
            expect(_userService.getDetailUser).toHaveBeenCalled();
            expect(_authService.isRoleAuthorized).toHaveBeenCalled();
        });

        it('should bring the correct data for GteTienda role', () => {
            spyOn(_userService, 'getDetailUser')
                .and
                .returnValue(Observable.of([
                    {
                        'accountId': 1,
                        'userId': 1,
                        'name': 'Sergo',
                        'lastname': 'Aguero',
                        'roleId': 1,
                        'timezone': '2017-08-29T12:12:31.949Z',
                        'user': {
                            'userId': 1,
                            'tenantId': 1,
                            'email': 'ocpqa@grupoassa.com',
                            'emailVerified': true,
                            'langId': 1,
                            'language': {
                                'key': 'ES'
                            }
                        },
                        'role': {
                            'roleId': 1,
                            'name': 'GteTienda'
                        }
                    }
                ]));
            comp.dateDefault = moment();
            spyOn(_authService, 'isRoleAuthorized')
                .and
                .returnValue(Observable.of(true).toPromise());

            comp.getUserRole();
            expect(comp.roleName).toBe(Constants.roles.storeMgr);
            expect(_userService.getDetailUser).toHaveBeenCalled();
            expect(_authService.isRoleAuthorized).toHaveBeenCalled();
        });

    });

});
