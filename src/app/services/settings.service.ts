// angular basics
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

// project basics
import { BaseURL } from '../classes/baseURL';


@Injectable()
export class SettingsService extends BaseURL {

    settingsURL: any = this.getURL() + '/settings';

    constructor(private http: HttpClient) {
        super();
    }

    getSettings(): Observable<any> {
        let url = `${this.settingsURL}`;
        return this.http
            .get<any[]>(url).map(
            response => {
                // we get only the first setting because rn we're not handling store/region specific settings
                return response[0];
            });
    }

    editSettings(settings: any): Observable<any> {
        let url = `${this.settingsURL}/${settings.settingId}`;
        return this.http
            .patch(url, settings);
    }

    updateViews(): Observable<null> {
        let url = `${this.settingsURL}/updateViews`;
        let body = null;
        return this.http
            .patch<null>(url, body);
    }

}
