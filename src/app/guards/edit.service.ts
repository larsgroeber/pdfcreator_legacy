import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";

@Injectable()
export class EditGuard implements CanActivate {

  constructor(private router: Router) { }

  jwt(): string {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
      return currentUser.token;
    }
    return '';
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let currentUser = localStorage.getItem('currentUser');
    if (currentUser && JSON.parse(currentUser).role === 'admin'){
      return true;
    }
    // TODO: route back to some login page
    return false;
  }
}
