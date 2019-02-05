import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

// classes
import { BaseURL } from '../classes/baseURL';
import { ApiType } from '../classes/apiType';


@Injectable()
export class ApiTypesService extends BaseURL {

  apiTypesURL: any = this.getURL() + '/apiTypes';

  constructor(private http: HttpClient) {
      super();
  }

  getApiTypes(): Observable<ApiType[]> {
    const url = `${this.apiTypesURL}`;
    return this.http
      .get<ApiType[]>(url);
  }
}
