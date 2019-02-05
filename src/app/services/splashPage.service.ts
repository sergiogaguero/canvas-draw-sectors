// Angular basics
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map'
// Project basics
import { BaseURL } from '../classes/baseURL';
@Injectable()
export class SplashPageService extends BaseURL {
    splashPageURL: string = this.getURL() + '/splashPages';
    constructor(private http: HttpClient) {
        super();
    }
    postBackgroundImage(img: any) {
        const form_data = new FormData();
        form_data.append('uploadedfile', img);
        const headers = new HttpHeaders();
        headers.set('Content-Type', 'multipart/form-data');
        headers.set('Accept', 'application/json');
        headers.set('Accept', 'image/webp');
        headers.set('Accept', 'image/apng');
        const url = `${this.splashPageURL}/upload/background`;
        return this.http
        .post(url, form_data, {headers});
    }
    postLogo(logo: any) {
        const form_data = new FormData();
        form_data.append('uploadedfile', logo);
        const headers = new HttpHeaders();
        headers.set('Content-Type', 'multipart/form-data');
        headers.set('Accept', 'application/json');
        headers.set('Accept', 'image/webp');
        headers.set('Accept', 'image/apng');
        const url = `${this.splashPageURL}/upload/logo`;
        return this.http
        .post(url, form_data, {headers});
    }
    postText(text: string, color: string) {
        const data = {
            'uploadedText' : text,
            'backgroundColorImg': color
        };
        const url = `${this.splashPageURL}/upload/text`;
        return this.http
        .post(url, data);
    }
    postSplashPage() {
        const body = {}
        const url = `${this.splashPageURL}/upload/generatePage`;
        return this.http
        .post(url, body);
    }
    getImage() {
        const url = `${this.splashPageURL}/download/background` + '?access_token=' + this.getAccessToken();
        return this.http
        .get(url);
    };
    getLogo() {
        const url = `${this.splashPageURL}/download/logo` + '?access_token=' + this.getAccessToken();
        return this.http
        .get(url);
    };
    getText(): Observable<any> {
        const url = `${this.splashPageURL}/download/text` + '?access_token=' + this.getAccessToken();
        return this.http
        .get(url, {responseType: 'text'});
    };
}