import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Moment } from 'moment';
import { BaseURL } from 'app/classes/baseURL';


@Injectable()
export class ProcessingStatusService extends BaseURL {

    urlBase: any;
    statusUrl: string;

    constructor(private http: HttpClient) {
        super();

        this.urlBase = this.getURL();

        this.statusUrl = this.urlBase + '/stores/status';
    }

    getStoresStatus(date: string): Observable<any> {
        const url: string = `${this.statusUrl}?date=${date}`;
        return this.http
            .get<any>(url);
    }

}



