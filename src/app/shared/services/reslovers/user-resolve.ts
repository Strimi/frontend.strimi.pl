import {HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';

import {UserStrimi} from '../..';
import {UserStrimiService} from '../user-strimi.service';


@Injectable()
export class UserResolve implements Resolve<UserStrimi> {

  constructor(private userStrimiService: UserStrimiService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UserStrimi> {
    this.checkUserName(route.params['authorName']);
    const userName = route.params['authorName'].replace('@', '');

    return this.userStrimiService.getUserStrimi(userName).map(user => {
      return user;
    }).catch(err => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 404) {
          this.router.navigate(['/page-404']);
        } else if (err.status === 403) {
          this.router.navigate(['/content-403', 'user']);
        }
      }
      return Observable.of(err);
    });
  }

  // if user nick in url dont inclde '@'
  checkUserName(authorName) {
    const result = authorName.includes('@');
    if (!result) {
      this.router.navigate(['/page-404']);
      return false;
    }
  }

}
