import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Store } from '../../classes/store';

export class StoresServiceStub {
    stores: Store[] = [
        {
            'storeId': 1,
            'name': 'sarasa',
            'regionId': 1,
            'responsableId': 3,
            'locationLat': '-37.326238700000005',
            'locationLong': '-59.13289109999999',
            'companyId': 1,
            'idinCustomerDB': '123456789',
            timeZoneOffset: 0,
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
            },
            address: ''
        },
        {
            'storeId': 2,
            'name': 'sarasa',
            'regionId': 2,
            'responsableId': 5,
            'locationLat': '-37.326238700000005',
            'locationLong': '-59.13289109999999',
            'companyId': 1,
            timeZoneOffset: 0,
            'idinCustomerDB': '123456789',
            'responsable': {
                'accountId': 5,
                'userId': 5,
                'name': 'Javier',
                'lastname': 'Coppis',
                'roleId': 2,
            },
            'floors': [
                {
                    'floorId': 3,
                    'name': 'piso 1',
                    'startingDate': null,
                    'endingDate': null,
                    'storeId': 2
                },
                {
                    'floorId': 4,
                    'name': 'piso 2',
                    'startingDate': null,
                    'endingDate': null,
                    'storeId': 2
                }
            ],
            'company': {
                'companyId': 1,
                'name': 'MULTIMAX',
                'legalName': 'MULTIMAX',
                'language': 1
            },
            'region': {
                'regionId': 9,
                'name': 'javotilandia ',
                'responsableId': 38
            },
            address: ''
        }
    ];

    getStores(): Observable<Store[]> {
        return Observable.of(this.stores);
    }

    getStoreById(storeId: number): Observable<Store> {
        return Observable.of(this.stores.filter(s => s.storeId === storeId)[0]);
    }

    getStoreByManager(accountId: number): Observable<Store> {
        const filteredStores = this.stores.filter(s => s.responsableId === accountId)[0];
        return Observable.of(filteredStores);
    }

    deleteStore(storeId: number): Observable<null> {
        this.stores = this.stores.filter(s => s.storeId !== storeId);
        return Observable.of(null);
    }

    addStore(store: Store): Observable<Store> {
        store.floors = [];
        store.responsable = {
            name: 'Joseph',
            lastname: 'Store'
        };
        store.region = {
            name: 'Some region',
            responsableId: 2
        };
        store.storeId = this.stores.length + 1;
        this.stores.push(store);
        return Observable.of(store);
    }

    editStore(store: Store): Observable<Store> {
        const storeToModify = this.stores.filter(s => s.storeId === store.storeId)[0];
        for (const key in store) {
            if (store[key] !== storeToModify[key]) {
                storeToModify[key] = store[key];
            }
        }
        this.stores = this.stores.filter(s => s.storeId !== store.storeId);
        this.stores.push(storeToModify);
        return Observable.of(store);
    }

    getStoreByIdInCustomerDB(idinCustomerDB: string): Observable<Store[]> {
        return Observable.of(this.stores.filter(s => s.idinCustomerDB === idinCustomerDB));
    }

    getStoreByRegionId(selectedRegion: number): Observable<Store[]> {
        return Observable.of(this.stores);
    }
}
