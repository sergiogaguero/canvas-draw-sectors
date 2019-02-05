// angular basics
import { Injectable } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

// project basics
import { BaseURL } from '../classes/baseURL';
import { Role } from '../classes/role';


@Injectable()
export class RolesService extends BaseURL {

    rolesURL: any = this.getURL() + '/roles';

    constructor(private http: HttpClient) {
        super();
    }

    getRoles(): Observable<Role[]> {
        let url = `${this.rolesURL}`;
        return this.http
            .get<Role[]>(url);
    }

}
