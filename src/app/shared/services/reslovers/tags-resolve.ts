import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { PostResult, SortModel } from '../..';
import { PostService } from '../post.service';


@Injectable()
export class TagsResolve implements Resolve<Array<PostResult>> {

  // this is used to switch to spinner durign fetch data
  // should subscribe in component PostTagComponent
  isLoading = new BehaviorSubject<boolean>(false);

  constructor(private postService: PostService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PostResult[]> {
    this.isLoading.next(true);
    const sortOrder = route.url[0].path;
    const tag = route.url[1].path;
    return this.postService.getTagPost(sortOrder, tag, new SortModel()).map(posts => {
      return Observable.of(posts);
    }).catch(err => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 404) {
          this.router.navigate(['/page-404']);
        } else if (err.status === 403) {
          this.router.navigate(['/content-403', 'tag']);
        }
      }
      return Observable.of(null);
    });
  }
}
