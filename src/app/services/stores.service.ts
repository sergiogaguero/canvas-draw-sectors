// angular basics
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

// classes
import { BaseURL } from '../classes/baseURL';
import { Store } from '../classes/store';


@Injectable()
export class StoresService extends BaseURL {

    storesURL: string;
    constructor(private http: HttpClient) {
        super();
        this.storesURL = this.getURL() + '/stores';
    }

    getStores(): Observable<Store[]> {
        const url = `${this.storesURL}?filter={"include": ["responsable", "region", "floors"]}`;
        return this.http.get<Store[]>(url);
    }

    getStoreById(storeId: number): Observable<Store> {
        const url = `${this.storesURL}/${storeId}?filter={"include": "floors"}`;
        return this.http.get<Store>(url);
    }

    getStoreByManager(idManager: number): Observable<Store> {
        const url = `${this.storesURL}?filter={"where" : {"responsableId": ${idManager}}, "include": ["floors", "region"]}`;
        return this.http
            .get<Store[]>(url)
            .map(response => {
                // keep the first store only because managers can have only 1 store rn
                return response[0];
            });
    }

    getStoreByRegionId(regionId: number): Observable<Store[]> {
        const url = `${this.storesURL}?regionId=${regionId}`;
        return this.http.get<Store[]>(url);
    }

    getStoreByIdInCustomerDB(idinCustomerDB: string): Observable<Store[]> {
        const url = `${this.storesURL}?idinCustomerDB=${idinCustomerDB}`;
        return this.http.get<Store[]>(url);
    }

    addStore(store: Store): Observable<Store> {
        return this.http.post<Store>(this.storesURL, store);
    }

    editStore(store: Store): Observable<Store> {
        const url = `${this.storesURL}/${store.storeId}`;
        return this.http.patch<Store>(url, store);
    }

    deleteStore(storeId: number) {
        const url = `${this.storesURL}/${storeId}`;
        return this.http.delete(url);
    }

}
