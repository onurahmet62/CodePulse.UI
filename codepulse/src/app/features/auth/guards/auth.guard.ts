import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, UrlSegment } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private cookieService: CookieService,
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const user = this.authService.getUser();
    const token = this.cookieService.get('Authorization');

    if (token && user) {
      const decodedToken: any = jwtDecode(token.replace('Bearer', ''));
      const expirationDate = decodedToken.exp * 1000;
      const currentTime = new Date().getTime();

      if (expirationDate < currentTime) {
        this.authService.logout();
        return this.router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
      } else {
        if (user.roles.includes('Writer')) {
          return true;
        } else {
          alert('Unauthorized');
          return false;
        }
      }
    } else {
      this.authService.logout();
      return this.router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    }
  }
}
