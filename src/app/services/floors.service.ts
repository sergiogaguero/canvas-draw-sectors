// angular basics
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

// classes
import { BaseURL } from '../classes/baseURL';
import { Floor } from '../classes/floor';


@Injectable()
export class FloorsService extends BaseURL {

  pisosURL: string = this.getURL() + '/floors';

  constructor(private http: HttpClient) {
    super();
  }

  addFloor(piso: Floor) {
    let body = piso;
    return this.http.post(this.pisosURL, body);
  }

  editFloor(piso: Floor) {
    let body = piso;
    let url = `${this.pisosURL}/${piso.floorId}`;
    return this.http.patch(url, body);
  }

  deleteFloor(id: number) {
    let url = `${this.pisosURL}/${id}`;
    return this.http.delete(url);
  }

  getFloorsByStore(idTienda: number): Observable<Floor[]> {
    let url = `${this.pisosURL}?filter={"where":{"storeId":"${idTienda}"}, "include":{"relation":"maps"}}`;
    return this.http
      .get<Floor[]>(url);
  }

  getFloorById(idPiso: number): Observable<Floor> {
    let url = `${this.pisosURL}/${idPiso}?filter={"include":[{"relation":"store","scope":{"include":["responsable","region"]}}, {"relation": "maps"}]}`;
    return this.http
      .get<Floor>(url);
  }

  getFloors(): Observable<Floor[]> {
    let url = `${this.pisosURL}`;
    return this.http
      .get<Floor[]>(url);
  }
}
