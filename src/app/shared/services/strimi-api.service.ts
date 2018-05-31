import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

import {
  ActiveVotes,
  CurrentMedianaHistoryPrice,
  CurrentMedianaHistoryPriceResponse,
  DynamicGlobalProp,
  DynamiGlobaPropResponse,
  FollowStats,
  FollowUser,
  MarketResponse,
  NotificationStrimi,
  PostResult,
  PostsData,
  RewardFund,
  RewardFundResponse,
  RewardsResponse,
  UserJsonMetadata,
  UserStrimi,
  UserStrimiResponse,
  VotesStrimiResponse,
  VotesUser
} from '..';
import {environment} from '../../../environments/environment';
import * as strimiUtil from './../utils/strimi-utils';
import * as steem from 'steem';

const parsePosts = strimiUtil.paresePosts;
const apiStrimi = environment.apiStrimi;

export class StrimiApiService {


  constructor(private http: HttpClient) {
  }


  getActiveVotes(author: string, permlink: string): Observable<Array<ActiveVotes>> {
    const param = new HttpParams().set('authorName', author).set('permlink', permlink);
    return this.http.get<any>(apiStrimi + '/votes/active', {params: param}).map(res => res.result);
  }

  public getUserFollowStats(userName: string): Observable<FollowStats> {
    const param = new HttpParams().set('userName', userName);
    return this.http.get<any>(apiStrimi + '/users/follow', {params: param}).map(res => res.result);
  }

  // get only user from steemd
  getUserStrimi(user: string): Observable<UserStrimi> {
    return this.http.get<UserStrimiResponse>(apiStrimi + `/users/${user}`).map(this.parseResponse);
  }


  getUserPosts(user: string): Observable<Array<PostResult>> {
    const param = new HttpParams().set('limit', '35');
    return this.http.get<PostsData>(apiStrimi + `/users/${user}/posts`, {params: param}).map(res => parsePosts(res.result));
  }

  getNextPosts(user: string, permLink: string): Observable<Array<PostResult>> {
    const param = new HttpParams().set('limit', '35').set('startAuthor', user).set('startPermlink', permLink);
    return this.http.get<PostsData>(apiStrimi + `/users/${user}/posts`, {params: param}).map(res => parsePosts(res.result));
  }

  getUserFeedPosts(user: string): Observable<Array<PostResult>> {
    const param = new HttpParams().set('tag', user).set('limit', '35');
    return this.http.get<PostsData>(apiStrimi + '/posts/feed', {params: param}).map(res => parsePosts(res.result));
  }

  getNextFeedPosts(startAuthor: string, permLink: string, user: string): Observable<Array<PostResult>> {
    const param = new HttpParams().set('limit', '35').set('startAuthor', startAuthor).set('startPermlink', permLink).set('tag', user);
    return this.http.get<PostsData>(apiStrimi + '/posts/feed', {params: param}).map(res => parsePosts(res.result));
  }

  getUsersComments(user: string): Observable<Array<PostResult>> {
    const param = new HttpParams().set('limit', '35');
    return this.http.get<PostsData>(apiStrimi + `/users/${user}/comments`, {params: param}).map(res => parsePosts(res.result));
  }

  getNextUsersComments(user: string, permLink: string): Observable<Array<PostResult>> {
    const param = new HttpParams().set('limit', '35').set('startPermlink', permLink);
    return this.http.get<PostsData>(apiStrimi + `/users/${user}/comments`, {params: param}).map(res => parsePosts(res.result));
  }

  getUsersReplies(user: string): Observable<Array<PostResult>> {
    const param = new HttpParams().set('limit', '35');
    return this.http.get<PostsData>(apiStrimi + `/users/${user}/replies`, {params: param}).map(res => parsePosts(res.result));
  }

  getNextUsersReplies(user: string, permLink: string): Observable<Array<PostResult>> {
    const param = new HttpParams().set('limit', '35').set('startPermlink', permLink);
    return this.http.get<PostsData>(apiStrimi + `/users/${user}/replies`, {params: param}).map(res => parsePosts(res.result));
  }

  getUsersFollowing(user: string): Observable<Array<FollowUser>> {
    const param = new HttpParams().set('userName', user).set('limit', '35');
    return this.http.get<any>(apiStrimi + '/users/follow/following', {params: param}).map(res => res.result);
  }

  getNextUsersFollowing(user: string, lastFollowing: string): Observable<Array<FollowUser>> {
    const param = new HttpParams().set('userName', user).set('startFollowing', lastFollowing).set('limit', '35');
    return this.http.get<any>(apiStrimi + '/users/follow/following', {params: param}).map(res => res.result);
  }

  getUsersFollowers(user: string): Observable<Array<FollowUser>> {
    const param = new HttpParams().set('userName', user).set('limit', '35');
    return this.http.get<any>(apiStrimi + '/users/follow/followers', {params: param}).map(res => res.result);
  }

  getNextUsersFollowers(user: string, startFollower: string): Observable<Array<FollowUser>> {
    const param = new HttpParams().set('userName', user).set('startFollower', startFollower).set('limit', '35');
    return this.http.get<any>(apiStrimi + '/users/follow/followers', {params: param}).map(res => res.result);
  }

  getUsersVotes(user: string): Observable<Array<VotesUser>> {
    return this.http.get<VotesStrimiResponse>(apiStrimi + `/users/${user}/votes`).map(res => res.result);
  }

  // get user ranking
  getUserRanking(user: string): Observable<any> {
    return this.http.get<any>(apiStrimi + `/elastic/users/${user}/ranking`);
  }

  getRewards(user: string): Observable<RewardsResponse> {
    return this.http.get<RewardsResponse>(apiStrimi + `/users/${user}/rewards`);
  }

  getDynamicGlobalProperties(): Observable<DynamicGlobalProp> {
    return this.http.get<DynamiGlobaPropResponse>(apiStrimi + '/dynamicGlobalProperties').map(res => res.result);
  }

  getRewardFund(): Observable<RewardFund> {
    return this.http.get<RewardFundResponse>(apiStrimi + '/getRewardFund').map(res => res.result);
  }

  getCurrentMedianaHistoryPrice(): Observable<CurrentMedianaHistoryPrice> {
    return this.http.get<CurrentMedianaHistoryPriceResponse>(apiStrimi + '/currentMedianaHistoryPrice').map(res => res.result);
  }

  getExchangeRates(): Observable<Array<MarketResponse>> {
    return this.http.get<Array<MarketResponse>>(apiStrimi + '/exchange/rates');
  }

  getOpenOrders(userName: string) {
    return this.http.get<any>(apiStrimi + `/users/${userName}/orders/open`);
  }

  getStateAsync(userName: string): any {
    return this.http.get<any>(apiStrimi + `/users/${userName}/state`);
  }

  getSavingsWithdrawFrom(userName: string) {
    return this.http.get<any>(apiStrimi + `/users/${userName}/savingsWithdraw`);
  }

  getNotification(userName: string) {
    return this.http.get<Array<NotificationStrimi>>(apiStrimi + `/mongo/users/${userName}/notifications`);
  }

  accountUpdate(userJson: UserJsonMetadata, activeWIF, memoKey, userName): Observable<any> {
    const promise = steem.broadcast.accountUpdateAsync(activeWIF, userName, undefined, undefined, undefined, memoKey, userJson);
    return Observable.fromPromise(promise);
  }

  // convert string to object
  private parseResponse = (res: UserStrimiResponse): UserStrimi => {
    if (res.result[0].json_metadata) {
      res.result[0].json_metadata = JSON.parse(res.result[0].json_metadata.toString());
    }
    return res.result[0];
  };


}
