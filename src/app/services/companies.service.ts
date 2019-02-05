// angular basics
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

// project basics
import { BaseURL } from '../classes/baseURL';
import { Company } from '../classes/company';


@Injectable()

export class CompaniesService extends BaseURL {

  private api: string;

  constructor(private http: HttpClient) {
    super();
    this.api = this.getURL() + '/companies';
  }

  getCompanies(): Observable<Company[]> {
    const url = `${this.api}?filter={"include":"language"}`;
    return this.http
      .get<Company[]>(url);
  }

}
