import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class AuthGuardLogin implements CanActivate {
  constructor(private router: Router) { }
  canActivate(): boolean {
    if (!((localStorage.getItem('currentUser')) || (sessionStorage.getItem('currentUser')))) {
      return true;
    } else {
      this.router.navigateByUrl('');
      return false;
    }
  }
}