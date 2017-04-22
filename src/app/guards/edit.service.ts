import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";

@Injectable()
export class EditGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let currentUser = localStorage.getItem('currentUser');
    if (currentUser && JSON.parse(currentUser).role === 'admin'){
      return true;
    }
    // TODO: route back to some login page
    return false;
  }
}
