// angular basics
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

// project basics
import { BaseURL } from '../classes/baseURL';


@Injectable()

// Dedicated service for user authentication (login, logout, logged user data, etc)
export class AuthService extends BaseURL {

    loginUrl = 'login';
    apiUrl: string = this.getURL();
    permissionsUrl = '../assets/permissions.json';

    // this attribute will allow us to redirect the user when they try to access a specific route but are not logged in
    redirectUrl = '';

    constructor(
        private http: HttpClient
    ) {
        super();
    }

    setRedirectUrl(url: string): void {
        this.redirectUrl = url;
    }

    getRedirectUrl(): string {
        return this.redirectUrl;
    }

    getLoginUrl(): string {
        return this.loginUrl;
    }

    isUserLoggedIn(): boolean {
        const storage = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
        if (storage) {
            return true;
        }
        return false;
    }

    getLoggedInUser(): any {
        const storage = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
        if (storage) {
            return storage.userId;
        }
        return null;
    }

    // get the whole permissions file
    getPermissions(): Observable<any> {
        return this.http.get(this.permissionsUrl);
    }

    // get a filtered version with only the routes for a certain role
    getPermissionsByRole(role: string): Promise<any> {
        return this.http
            .get<any[]>(this.permissionsUrl)
            .toPromise()
            .then(response => {
                return response.filter(p => p.role === role)[0];
            }, error => {
                return false;
            });
    }

    isRoleAuthorized(role: string, url: string): Promise<boolean> {
        // get the routes that this role is allowed to access
        return this.getPermissionsByRole(role).then(response => {
            // for each route, split them into their components
            for (const route in response.routes) {
                if (response.routes[route]) {
                    const splitRoute = response.routes[route].split('/');
                    const splitUrl = url.split('/');

                    // try to match the desired route's components with the available route's components
                    for (const i in splitRoute) {
                        // if the components in the route don't match, and the component is not a parameter, just stop trying
                        if (splitRoute[i] !== splitUrl[i] && splitRoute[i].indexOf(':') !== 0) {
                            break;
                        } else if ((parseInt(i) + 1) === splitRoute.length && splitRoute.length === splitUrl.length) {
                            // if there were no problems and you're at the end of the routes and they have the same length, this is the one!
                            return true;
                        }
                    }
                }
            }
            return false;
        }, error => {
            return false;
        });
    }

    login(dataLogin: any) {
        let url = `${this.apiUrl}/globalUsers/login`;
        let body = `email=${dataLogin.email}&password=${dataLogin.password}`;
        let httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
        };
        return this.http
            .post(url, body, {
                headers:
                    httpOptions.headers
            });
    }

    logout(): Promise<any> {
        let url = `${this.apiUrl}/globalUsers/logout`;
        return this.http
            .post(url, '')
            .toPromise();
    }

    clearCache() {
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
    }

}
