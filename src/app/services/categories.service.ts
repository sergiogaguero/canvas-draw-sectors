// angular basics
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

// project basics
import { BaseURL } from '../classes/baseURL';
import { Category } from 'app/classes/category';


@Injectable()
export class CategoriesService extends BaseURL {

  categoriesURL: any;

  constructor(private http: HttpClient) {
    super();
    this.categoriesURL = this.getURL() + '/categories';
  }

  getCategories(): Observable<Category[]> {
    let url = `${this.categoriesURL}`;
    return this.http
      .get<Category[]>(url);
  }

}
