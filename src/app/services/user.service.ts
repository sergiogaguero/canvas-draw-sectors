// angular basics
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

// project basics
import { BaseURL } from '../classes/baseURL';
import { AuthService } from './auth.service';

@Injectable()
export class UserService extends BaseURL {
    userDetails: any;
    api: string;
    accountsUrl: string;

    constructor(
        private http: HttpClient,
        private authService: AuthService,
        private router: Router
    ) {
        super();
        this.api = this.getURL();
        this.accountsUrl = this.api + '/accounts';
    }

    getDetailUser(globalUserId?: number): Observable<any[]> {
        const url = `${this.accountsUrl}/getDetail`;
        return this.http
            .get<any>(url).map(user => {
                // TODO REFACTOR EVERYWHERE SO WE DON'T NEED THIS SHIT
                const arrayUser = new Array();
                arrayUser.push(user);
                return arrayUser;
            });
    }

    createUser(user: any): Observable<any> {
        const url = `${this.accountsUrl}`;
        return this.http.post(url, user);
    }

    deleteUser(accountId: number): Promise<any> {
        const url = `${this.accountsUrl}/${accountId}`;
        return this.http
            .delete(url)
            .toPromise();
    }

    getUsers(): Observable<any[]> {
        const url = `${this.accountsUrl}?filter={"include":["user","role", "salesAssociate"]}`;
        return this.http.get<any[]>(url);
    }

    getUsersByRole(role: string): Observable<any[]> {
        const url = `${this.accountsUrl}?filter={"include":["user","role"]}`;
        return this.http
            .get<any[]>(url)
            .map(response => {
                const employees = response.filter(empleado => empleado.role.name === role);
                return employees;
            });
    }

    updateUser(user: any, accountId: number): Promise<any> {
        const url = `${this.accountsUrl}/${accountId}`;
        return this.http
            .patch(url, user)
            .toPromise();
    }

    updatelanguageUser(userId: number, langId: number): Promise<any> {
        const url = `${this.api}/globalUsers/${userId}`;
        return this.http
            .patch(url, {
                langId: langId
            })
            .toPromise();
    }

    requestPassword(email: string): Promise<any> {
        const url = `${this.api}/globalUsers/requestPassword?email=${email}`;
        return this.http
            .get(url)
            .toPromise();
    }

    resetPassword(password: string, token: string): Promise<any> {
        const url = `${this.api}/globalUsers/reset-password`;
        const body = `newPassword=${password}`;
        const headers = new HttpHeaders()
            .append('Content-Type', 'application/x-www-form-urlencoded')
            .append('Authorization', `${token}`);
        return this.http
            .post(url, body, { headers })
            .toPromise();
    }

    confirmAccount(uid: string, token: string): Promise<any> {
        const url = `${this.api}/globalUsers/confirm?uid=${uid}&token=${token}`;
        return this.http
            .get(url)
            .toPromise();
    }
}
