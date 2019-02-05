import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

import {
    MatDialog, MatDialogRef, MAT_DIALOG_DATA
} from '@angular/material';

import { OpenMessageDialog } from '../components/message-dialog/message-dialog.component';


import {  Router, ActivatedRoute } from '@angular/router';
import { BaseURL } from '../classes/baseURL'
import { Constants } from '../classes/constants';
// operators
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import 'rxjs/add/observable/of';

@Injectable()
export class OcpHttpInterceptor extends BaseURL implements HttpInterceptor {

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog){
                super()
    }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let status: string;
    let requestToHandle = request;
    const storage = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
    if (storage !== null && storage !== undefined) {
      const token = storage.id;
      requestToHandle = request.clone({
        headers: request.headers.set('Authorization', `${token}`)
      })
    }
    return next.handle(requestToHandle)
      .catch((error, caught) => {
      status =  error.status;
      if(Constants.STATUS_CODE.indexOf(error.status) !== -1){
        this.router.navigate(['/error-handling'], {queryParams: {status: status}});
        //return the error to the method that called it
        return Observable.throw(error);
      }else{
        const internalStatus = Constants.INTERNAL_STATUS_CODE.find(e => {
          return e.code == error.status;
        });
        if (internalStatus){
          OpenMessageDialog(internalStatus.title, internalStatus.message, this.dialog);
        }
      }
      return Observable.throw(error);
    }) as any;
  }
}
