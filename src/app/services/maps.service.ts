// Angular basics
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map'

// Project basics
import { BaseURL } from '../classes/baseURL';
import { Blueprint } from '../classes/blueprint';
import * as moment from 'moment';

@Injectable()
export class MapsService extends BaseURL {

    blueprintsURL: string = this.getURL() + '/maps';

  constructor(private http: HttpClient) {
    super();
  }

  addMap(map: any) {
    const form_data = new FormData();
    for (const key in map) {
      if (map[key] != null) {
        if (key === 'startingDate') {
          map[key] = moment(map.startingDate).format('YYYY-MM-DD');
        }
        form_data.append(key, map[key]);
      }
    }
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'multipart/form-data');
    headers.set('Accept', 'application/json');
    headers.set('Accept', 'image/webp');
    headers.set('Accept', 'image/apng');
    let url = `${this.blueprintsURL}/upload`;
    return this.http.post(url, form_data, { headers });
  }

  editMap(map: any) {
    map.startingDate = moment(map.startingDate).format('YYYY-MM-DD');
    const url = `${this.blueprintsURL}/${map.mapId}`;
    return this.http.patch(url, map);
  }

  deleteMap(mapId: number) {
    const url = `${this.blueprintsURL}/${mapId}`;
    return this.http.delete(url);
  }

  getMapsByFloor(floorId: number): Observable<Blueprint[]> {
    let url = `${this.blueprintsURL}?filter={"where": {"floorId":"${floorId}"}, "order":["startingDate ASC"]}`;
    return this.http
      .get<Blueprint[]>(url);
  }

  getMapById(idPlano: any): Observable<Blueprint> {
    let url = `${this.blueprintsURL}/${idPlano}`;
    return this.http
      .get<Blueprint>(url);
  }

  getCurrentMapByFloor(floorId: number): Observable<Blueprint> {
    const today = moment().format('YYYY-MM-DD');
    let url = `${this.blueprintsURL}?filter={"where":{"startingDate":{"lte":"${today}"}, "floorId": ${floorId}}, "order":["startingDate DESC"],  "limit":"1"}`;
    return this.http
      .get<Blueprint[]>(url)
      .map(response => {
        if (response.length > 0) {
          return response[0];
        } else {
          return null;
        }
      });
  }

  getActiveMapForDate(floorId: number, date: string): Observable<Blueprint> {
    const parsedDate = moment(date).format('YYYY-MM-DD');
    let url = `${this.blueprintsURL}?filter={"where":{"startingDate":{"lte":"${parsedDate}"}, "floorId": ${floorId}}, "order":["startingDate DESC"],  "limit":"1"}`;
    return this.http
      .get<Blueprint[]>(url)
      .map(response => {
        if (response.length > 0) {
          return response[0];
        } else {
          return null;
        }
      });
  }

  getMapUrlByGuid(guid: string): string {
    return this.blueprintsURL + '/download/' + guid + '?access_token=' + this.getAccessToken();
  }

  getSectionsByMap(idPlano: any) {
    const url = `${this.blueprintsURL}/${idPlano}/?filter={"include":"sectors"}`;
    return this.http
      .get<Blueprint>(url);
  }

  getMaps(): Observable<Blueprint[]> {
    const url = `${this.blueprintsURL}`;
    return this.http
      .get<Blueprint[]>(url);
  }

}
