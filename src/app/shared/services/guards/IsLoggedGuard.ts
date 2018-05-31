import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../auth/auth.service';
import {Observable} from 'rxjs/Observable';
import {Injectable} from '@angular/core';

@Injectable()
export class IsLoggedGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {

  }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const user = this.authService.loggedData.getValue();
    if (user) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }

}
