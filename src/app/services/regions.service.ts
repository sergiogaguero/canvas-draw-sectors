import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BaseURL } from '../classes/baseURL';
import { observableToBeFn } from 'rxjs/testing/TestScheduler';
import { Region } from '../classes/region';
import { Constants } from '../classes/constants';

@Injectable()
export class RegionsService extends BaseURL {

    regionsURL: string;
    constructor(private http: HttpClient) {
        super();
        this.regionsURL = this.getURL() + '/regions';
    }

    addRegion(region: Region): Observable<Region> {
        return this.http.post<Region>(this.regionsURL, region);
    }

    getRegions(): Observable<Region[]> {
        const url = `${this.regionsURL}?filter={"include": ["responsable", "stores"]}`;
        return this.http.get<Region[]>(url);
    }

    getRegionsByRole(account: any): Observable<any[]> {
        const filters = {
            'Admin': () => '{"include": ["responsable", "stores"]}',
            'GteRed': () => `{"where": {"responsableId":${account.accountId}}, "include": ["responsable", "stores"]}`,
            'GteTienda': () => `{"include":["responsable", {"relation":"stores","scope":{"where":{"responsableId":${account.accountId}}}}]}`
        };
        const url = `${this.regionsURL}?filter=${filters[account.role.name]()}`;
        const res = this.http
            .get<any[]>(url);
        if (account.role.name === Constants.roles.storeMgr) {
            return res.map(response => {
                return response.filter(region => region.stores.length > 0);
            });
        }
        return res;
    }

    getRegionByManager(responsableId: number): Observable<Region> {
        const url = `${this.regionsURL}?filter={"where": {"responsableId": ${responsableId}}, "include": ["stores", "responsable"]}`;
        return this.http
            .get<Region[]>(url)
            .map(response => {
                // Keep only the first region since managers can't have more than one region
                return response[0];
            });
    }

    editRegion(region: Region): Observable<Region> {
        const url = `${this.regionsURL}/${region.regionId}`;
        return this.http.patch<Region>(url, region);
    }

    deleteRegion(regionId: number) {
        const url = `${this.regionsURL}/${regionId}`;
        return this.http.delete(url);
    }

}
