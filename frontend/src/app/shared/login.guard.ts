import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private login: LoginService,
    private router: Router,
  ) { }

  // this function is called when the user attempts to navigate to the login page
  // if the user is already signed in, redirect to home page
  // if the user is not signed in, allow them to go to the login page
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.login.user.pipe(
      // ADD TAKE TO ENSURE THAT THERE ISN'T AN ONGOING LISTENER, OR ELSE MEMORY LEAK IN SITE AND BROKEN GUARD
      take(1),
      map(user => { 
        const isAuthenticated = !!user;
        // if the user is not signed in, allow them to go to the login page
        if (!isAuthenticated) 
          return true;
        // if the user is already signed in, redirect to home page
        else 
          return this.router.createUrlTree(['/']);
      }),
    );
  }
  
}
