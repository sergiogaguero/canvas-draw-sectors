// basic for testing
import {
    inject, TestBed, getTestBed
} from '@angular/core/testing';
// basic for testing services
import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import * as moment from 'moment';

// services
import { RegionsService } from '../../services/regions.service';
import { Moment } from 'moment';
import { Region } from '../../classes/region';


function makeRegionsAdmin() {
    return [
        {
            regionId: 0,
            stores: [
                {
                    storeId: 0,
                    name: '',
                    address: '',
                    regionId: 0,
                },
                {
                    storeId: 1,
                    name: '',
                    address: '',
                    regionId: 0,
                },
            ]
        },
        {
            regionId: 1,
            stores: [
                {
                    storeId: 4,
                    name: '',
                    regionId: 1,
                    address: '',
                },
                {
                    storeId: 5,
                    name: '',
                    regionId: 1,
                    address: '',
                },
            ]
        }
    ]
}

function makeRegionGteRed() {
    return [
        {
            regionId: 1,
            name: '',
            responsableId: 35,
            responsable: {
                accountId: 35,
                userId: 47,
                name: '',
                lastname: '',
                roleId: 3,
            },
            stores: [
                {
                    storeId: 1,
                    name: '',
                    address: '',
                    regionId: 1,
                    responsableId: 161
                },
                {
                    storeId: 48,
                    name: '',
                    regionId: 1,
                    address: '',
                    responsableId: 111,
                },
                {
                    storeId: 49,
                    name: '',
                    address: '',
                    regionId: 1,
                    responsableId: 35,
                }
            ]
        }
    ]
}

function makeRegionGteStore() {
    return [
        {
            regionId: 1,
            name: '',
            responsableId: 35,
            responsable: {
                accountId: 35,
                userId: 47,
                name: '',
                lastname: '',
                roleId: 3,
            },
            stores: [
                {
                    storeId: 1,
                    name: '',
                    regionId: 1,
                    responsableId: 161,
                    locationLong: '0',
                    locationLat: '0',
                    companyId: 1,
                    idinCustomerDB: '',
                    address: '',
                    timeZoneOffset: 0
                },
                {
                    storeId: 48,
                    name: '',
                    regionId: 1,
                    responsableId: 111,
                    locationLong: '0',
                    locationLat: '0',
                    companyId: 1,
                    idinCustomerDB: '',
                    address: '',
                    timeZoneOffset: 0
                },
            ],
        },
        {
            regionId: 3,
            name: '',
            responsableId: 3,
            responsable: {
                accountId: 3,
                userId: 3,
                name: '',
                lastname: '',
                roleId: 1,
            },
            stores: []
        },

    ]
}

////////  Tests  /////////////
describe('RegionsService', () => {
    let httpMock: HttpTestingController;
    let injector: TestBed;
    let _regionsService: RegionsService;
    let fakeRegions: Region[];

    let baseURL: string;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [RegionsService]
        });
        injector = getTestBed();
        httpMock = TestBed.get(HttpTestingController);

        _regionsService = injector.get(RegionsService);

        fakeRegions = makeRegionGteStore();
        baseURL = _regionsService.regionsURL;
    });

    it('can instantiate service when inject service',
        inject([RegionsService], (service: RegionsService) => {
            expect(service instanceof RegionsService).toBe(true);
        })
    );

    it('should call the correct url on getRegions()', () => {
        const filter = '?filter={"include": ["responsable", "stores"]}';
        _regionsService.getRegions().subscribe();
        httpMock.expectOne(baseURL + filter).flush(fakeRegions);
        httpMock.verify();
    });

    it('should call the correct url on addRegion()', () => {
        _regionsService.addRegion(fakeRegions[0]).subscribe();
        httpMock.expectOne(baseURL).flush(fakeRegions[0]);
        httpMock.verify();
    });

    it('should call the correct url on getRegionByManager()', () => {
        const responsableId = 1;
        const filter = '?filter={"where": {"responsableId": ' + responsableId + '}, "include": ["stores", "responsable"]}';
        _regionsService.getRegionByManager(1).subscribe();
        httpMock.expectOne(baseURL + filter).flush(fakeRegions[0]);
        httpMock.verify();
    });

    it('should call the correct url on editRegion()', () => {
        const regionId = fakeRegions[0].regionId;
        _regionsService.editRegion(fakeRegions[0]).subscribe();
        httpMock.expectOne(baseURL + '/' + regionId).flush(fakeRegions[0]);
        httpMock.verify();
    });

    it('should call the correct url on deleteRegion()', () => {
        const regionId = fakeRegions[0].regionId;
        _regionsService.deleteRegion(regionId).subscribe();
        httpMock.expectOne(baseURL + '/' + regionId).flush(fakeRegions[0]);
        httpMock.verify();
    });

    describe('when getRegionsByRole', () => {
        let accounts: any;
        let filterAdmin: any;
        let filterGteRed: any;
        let filterGteStore: any;
        let fakeRegionAdmin: any;
        let fakeRegionGteRed: any;
        let fakeRegionGteStore: any;

        beforeEach(() => {
            accounts = {
                admin: {
                    accountId: 1,
                    role: {
                        name: 'Admin'
                    }
                },
                red: {
                    accountId: 35,
                    role: {
                        name: 'GteRed'
                    }
                },
                store: {
                    accountId: 111,
                    role: {
                        name: 'GteTienda'
                    }
                }
            };
            filterAdmin = '{"include": ["responsable", "stores"]}';
            filterGteRed = '{"where": {"responsableId":' + accounts.red.accountId + '}, "include": ["responsable", "stores"]}';
            filterGteStore = '{"include":["responsable", {"relation":"stores","scope":{"where":{"responsableId":'
                + accounts.store.accountId + '}}}]}';

            fakeRegionAdmin = makeRegionsAdmin();
            fakeRegionGteRed = makeRegionGteRed();
            fakeRegionGteStore = makeRegionGteStore();

        });

        it('should call to /regions endpoint with Admin', () => {
            _regionsService.getRegionsByRole(accounts.admin).subscribe();
            httpMock.expectOne(`${baseURL}?filter=${filterAdmin}`, 'the URL called was not the expected').flush(fakeRegionAdmin);
            httpMock.verify();
        });

        it(`should have expected Object with Admin data`, () => {
            _regionsService.getRegionsByRole(accounts.admin)
                .subscribe(region => {
                    expect(_regionsService).toBeDefined('should have expected object Admin');
                });
            httpMock.expectOne(`${baseURL}?filter=${filterAdmin}`).flush(fakeRegionAdmin);
            httpMock.verify();
        });

        it('should call to /regions endpoint with GteRed', () => {
            _regionsService.getRegionsByRole(accounts.red).subscribe();
            httpMock.expectOne(`${baseURL}?filter=${filterGteRed}`).flush(fakeRegionGteRed);
            httpMock.verify();
        });

        it(`should have expected Object with GteRed data`, () => {
            _regionsService.getRegionsByRole(accounts.red)
                .subscribe(region => {
                    expect(_regionsService).toBeDefined('should have expected object gteRed');
                });
            httpMock.expectOne(`${baseURL}?filter=${filterGteRed}`).flush(fakeRegionGteRed);
            httpMock.verify();
        });

        it('should call to /regions endpoint with GteStore', () => {
            _regionsService.getRegionsByRole(accounts.store).subscribe();
            httpMock.expectOne(`${baseURL}?filter=${filterGteStore}`).flush(fakeRegionGteStore);
            httpMock.verify();
        });

        it(`should have expected Object with GteStore data`, () => {
            _regionsService.getRegionsByRole(accounts.store)
                .subscribe(region => {
                    expect(_regionsService).toBeDefined('should have expected object gteRed');
                });
            httpMock.expectOne(`${baseURL}?filter=${filterGteStore}`).flush(fakeRegionGteStore);
            httpMock.verify();
        });

    });

});
