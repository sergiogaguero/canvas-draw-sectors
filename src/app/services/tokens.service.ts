// angular basics
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

// classes
import { BaseURL } from '../classes/baseURL';
import { Token } from '../classes/token';


@Injectable()
export class TokensService extends BaseURL {

    tokensURL: any = this.getURL() + '/tokens';

    constructor(private http: HttpClient) {
        super();
    }

    getTokens(): Observable<Token[]> {
        let url = `${this.tokensURL}?filter={"include":"apiType"}`;
        return this.http
            .get<Token[]>(url);
    }

    addToken(token: any) {
        let url = `${this.tokensURL}`;
        return this.http
            .post(url, token);
    }

    deleteToken(tokenId: number) {
        let url = `${this.tokensURL}/${tokenId}`;
        return this.http
            .delete(url);
    }


}
