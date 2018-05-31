import 'rxjs/add/operator/catch';

import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { PostResult } from '../..';
import { PostService } from '../post.service';

@Injectable()
export class PostResolve implements Resolve<PostResult> {

  constructor(private postService: PostService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PostResult> {
    const authorName = route.params['authorName'].replace('@', '');
    const permlink = route.params['permlink'];
    return this.postService.getDetailPost(authorName, permlink).map(post => {
      return post;
    }).catch(err => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 404) {
          this.router.navigate(['/page-404']);
        } else if (err.status === 403) {
          this.router.navigate(['/content-403', 'post']);
        }
      }
      return Observable.of(null);
    });
  }

}
