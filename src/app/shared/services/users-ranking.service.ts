import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toArray';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { UserElastic, Hits, User } from '../index';

const apiStrimi = environment.apiStrimi;
/**
 * Fetch top users
 */
@Injectable()
export class UsersRankingService {

  users = new BehaviorSubject<Array<User>>([]);

  constructor(private http: HttpClient) { }

  getUsers(sortBy = 'upvoteWorth', sortOrder = 'desc'): void {
    const param = new HttpParams().set('limit', '50').set('sortBy', sortBy).set('sortOrder', sortOrder);
    this.http.get<UserElastic>(apiStrimi + '/elastic/users', { params: param })
      .mergeMap(this.mergeToArr).map(this.mapToSource).toArray().subscribe(userList => {
        this.users.next(userList);
      });
  }

  getNextUsers(sortBy = 'upvoteWorth', sortOrder = 'desc', from: string): void {
    const param = new HttpParams().set('limit', '50').set('sortBy', sortBy).set('sortOrder', sortOrder).set('from', from);
    this.http.get<any>(apiStrimi + '/elastic/users', { params: param })
      .mergeMap(this.mergeToArr).map(this.mapToSource).toArray().subscribe(users => {
        this.users.next([...this.users.value, ...users]);
      });
  }

  getUsersSuggestFor(name: string): void {
    const param = new HttpParams().set('suggestFor', name);
    this.http.get<any>(apiStrimi + '/elastic/users/suggest', { params: param })
      .mergeMap(this.mergeToArr).map(this.mapToSource).toArray().subscribe(users => {
        this.users.next(users);
      });
  }

  // merge structure to one array
  private mergeToArr = (arr: UserElastic) => arr.hits.hits;
  // map one element from arr to arr with this elem
  private mapToSource = (hits: Hits) => hits._source;

}
