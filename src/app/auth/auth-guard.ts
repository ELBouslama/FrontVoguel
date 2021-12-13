

import { CanActivate , ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise <boolean> {
    const isAuth = this.authService.getIsAuth(); //check if user is authenticated
    if (!isAuth) {
      this.router.navigate(['/login']); // if not, navigate user to login page
    }
    return isAuth;
  }
}
