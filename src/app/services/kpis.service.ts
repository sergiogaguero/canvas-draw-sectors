import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Moment } from 'moment';

// classes
import { BaseURL } from '../classes/baseURL';


@Injectable()
export class KpisService extends BaseURL {

    urlBase: any;

    constructor(private http: HttpClient) {
        super();
        this.urlBase = this.getURL() + '/KPIs';
    }

    getKpis(storeId: number, date: string): Observable<any> {
        const url: string = `${this.urlBase}/homeForStoreManager?date=${date}&store=${storeId}`;
        return this.http
            .get<any>(url);
    }

    getSalesforceByTennant(startingDate: Moment, endingDate: Moment): Observable<any> {
        const sDate = startingDate.format('YYYY-MM-DD');
        const eDate = endingDate.format('YYYY-MM-DD');
        let url = `${this.urlBase}/salesforce?startingDate=${sDate}&endingDate=${eDate}`;
        return this.http
            .get<any>(url);
    }

    getSalesforceByRegion(regionId: number, startingDate: Moment, endingDate: Moment): Observable<any> {
        const sDate = startingDate.format('YYYY-MM-DD');
        const eDate = endingDate.format('YYYY-MM-DD');
        let url = `${this.urlBase}/salesforce?regionId=${regionId}&startingDate=${sDate}&endingDate=${eDate}`;
        return this.http
            .get<any>(url);
    }

    getSalesforceByStore(storeId: number, startingDate: Moment, endingDate: Moment): Observable<any> {
        const sDate = startingDate.format('YYYY-MM-DD');
        const eDate = endingDate.format('YYYY-MM-DD');
        let url = `${this.urlBase}/salesforce?storeId=${storeId}&startingDate=${sDate}&endingDate=${eDate}`;
        return this.http
            .get<any>(url);
    }

    getCockPit(params): Observable<any> {
        const urlParams = Object.keys(params)
            .filter(key => params[key] !== null && params[key] !== undefined)
            .map(key => `${key}=${params[key]}`)
            .join('&');
        const url = `${this.urlBase}/cockpit?${urlParams}`;
        return this.http
            .get(url, { observe: 'response' });
    }

    getKpisChainOperations(params): Observable<any> {
        const urlParams = Object.keys(params)
            .filter(key => params[key] !== null && params[key] !== undefined)
            .map(key => `${key}=${params[key]}`)
            .join('&');
        const url = `${this.urlBase}/storeChainOperations?${urlParams}`;
        const headers = new HttpHeaders()
            .append('Authorization', this.getAccessToken());
        return this.http
            .get(url, { headers, observe: 'response' });
    }

    getVisitors(
        year: string,
        month: string,
        optionalParams?: any
    ): Observable<any[]> {
        let optionalQueryParams = '';
        if (optionalParams !== undefined) {
            if (optionalParams.storeManager !== undefined) {
                optionalQueryParams = '&storeManager=' + optionalParams.storeManager
            }
            if (optionalParams.regionId !== undefined) {
                optionalQueryParams = '&regionId=' + optionalParams.regionId
            }
            if (optionalParams.regionManager !== undefined) {
                optionalQueryParams = '&regionManager=' + optionalParams.regionManager
            }
        }
        const url = `${this.urlBase}/visitors?year=${year}&month=${month}${optionalQueryParams}`;
        return this.http
            .get<any[]>(url);
    }

}
