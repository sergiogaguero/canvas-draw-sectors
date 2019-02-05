// angular basics
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

// classes
import { BaseURL } from '../classes/baseURL';
import { Language } from '../classes/language';

@Injectable()

export class LanguagesService extends BaseURL {

  private api: string;

  constructor(private http: HttpClient) {
    super();
    this.api = this.getURL() + '/languages';
  }

  getLanguages(): Observable<Language[]> {
    let url = `${this.api}`;
    return this.http
      .get<Language[]>(url);
  }

}
