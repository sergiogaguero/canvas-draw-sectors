// basics for testing
import {
    inject, TestBed
} from '@angular/core/testing';

// basics for testing services
import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

// services
import { StoresService } from '../../services/stores.service'
import { Store } from '../../classes/store';

const makeStoreData = () => [
    {
        storeId: 1,
        name: 'Store 1',
        regionId: 1,
        responsableId: 1,
        locationLat: 'locationLat',
        locationLong: 'locationLong',
        companyId: 0,
        idinCustomerDB: 'idinCustomerDB'
    },
    {
        storeId: 2,
        name: 'Store 2',
        regionId: 2,
        responsableId: 2,
        locationLat: 'locationLat 2',
        locationLong: 'locationLong 2',
        companyId: 2,
        idinCustomerDB: 'idinCustomerDB 2'
    },
    {
        storeId: 3,
        name: 'Store 3',
        regionId: 3,
        responsableId: 3,
        locationLat: 'locationLat 3',
        locationLong: 'locationLong 3',
        companyId: 3,
        idinCustomerDB: 'idinCustomerDB 3'
    },
    {
        storeId: 4,
        name: 'Store 4',
        regionId: 4,
        responsableId: 4,
        locationLat: 'locationLat 4',
        locationLong: 'locationLong 4',
        companyId: 4,
        idinCustomerDB: 'idinCustomerDB 4'
    }] as Store[];

////////  Tests  /////////////
describe('StoresService', () => {
    let httpMock: HttpTestingController;
    let _storesService: StoresService;
    let fakeStores: Store[];

    let storeURL: string;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [StoresService]
        });

        httpMock = TestBed.get(HttpTestingController);

        _storesService = TestBed.get(StoresService);

        fakeStores = makeStoreData();
        storeURL = _storesService.storesURL;
    });

    it('can instantiate service when inject service',
        inject([StoresService], (service: StoresService) => {
            expect(service instanceof StoresService).toBe(true);
        })
    );

    it('should call the correct url on getStores()', () => {
        const filter = '?filter={"include": ["responsable", "region", "floors"]}';
        _storesService.getStores().subscribe();
        httpMock.expectOne(storeURL + filter).flush(fakeStores);
        httpMock.verify();
    });

    it('should call the correct url on getStoreById()', () => {
        const filter = '?filter={"include": "floors"}';
        const storeId = 1;
        _storesService.getStoreById(storeId).subscribe();
        httpMock.expectOne(storeURL + '/' + storeId + filter).flush(fakeStores);
        httpMock.verify();
    });

    it('should call the correct url on getStoreByManager()', () => {
        const managerId = 1;
        const filter = '?filter={"where" : {"responsableId": ' + managerId + '}, "include": ["floors", "region"]}';
        _storesService.getStoreByManager(managerId).subscribe();
        httpMock.expectOne(storeURL + filter).flush(fakeStores[0]);
        httpMock.verify();
    });

    it('should call the correct url on getStoreByRegionId()', () => {
        const regionId = 1;
        const filter = '?regionId=' + regionId;
        _storesService.getStoreByRegionId(regionId).subscribe();
        httpMock.expectOne(storeURL + filter).flush(fakeStores[0]);
        httpMock.verify();
    });

    it('should call the correct url on getStoreByIdInCustomerDB()', () => {
        const idinCustomerDB = '1';
        const filter = '?idinCustomerDB=' + idinCustomerDB;
        _storesService.getStoreByIdInCustomerDB(idinCustomerDB).subscribe();
        httpMock.expectOne(storeURL + filter).flush(fakeStores);
        httpMock.verify();
    });

    it('should call the correct url on addStore()', () => {
        _storesService.addStore(fakeStores[0]).subscribe();
        httpMock.expectOne(storeURL).flush(fakeStores[0]);
        httpMock.verify();
    });

    it('should call the correct url on editStore()', () => {
        _storesService.editStore(fakeStores[0]).subscribe();
        httpMock.expectOne(storeURL + '/' + fakeStores[0].storeId).flush(fakeStores[0]);
        httpMock.verify();
    });

    it('should call the correct url on deleteStore()', () => {
        _storesService.deleteStore(fakeStores[0].storeId).subscribe();
        httpMock.expectOne(storeURL + '/' + fakeStores[0].storeId).flush(fakeStores[0]);
        httpMock.verify();
    });
});

