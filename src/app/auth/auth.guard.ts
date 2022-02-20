import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanDeactivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanDeactivate<unknown>, CanLoad {
constructor(private router: Router, private app: AppService) { }    
canActivate(
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  let url: string = state.url;
  return this.checkUserLogin(next, url);
}
canActivateChild(
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  return this.canActivate(next, state);
}
canDeactivate(
  component: unknown,
  currentRoute: ActivatedRouteSnapshot,
  currentState: RouterStateSnapshot,
  nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  return true;
}
canLoad(
  route: Route,
  segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
  return true;
}
  checkUserLogin(route: ActivatedRouteSnapshot, url: any): boolean {
    let logedIn: boolean = false;
    if(localStorage.getItem("access_token") != null){
      logedIn = true;
    }
    if (logedIn == true) {
      return true;
    }
    else this.router.navigate(['/login']);
    return false;
  }
}  
