import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { environment } from '../../../environments/environment';
import { Constants, PostDataDetails, PostResult, PostsData, VotesUser } from '../../shared';
import { ApplicationService } from '../../shared/services/application.service';
import { LoggedData } from '../models/user-login.model';
import { SortModel } from '../models/utils.model';
import * as strimiUtil from './../../shared/utils';
import { AuthService } from './auth/auth.service';
import { PostApiService } from './post-api.service';

const api_url = environment.apiStrimi;
const parsePost = strimiUtil.paresePost;
const parsePosts = strimiUtil.paresePosts;

@Injectable()
export class PostService extends PostApiService {

  /**
   * subscribe if service should reload posts after change stream post language
   */
  loadPosts = new Subject<void>();
  loggedData: LoggedData;

  tagLang;

  // keep information about all posts
  private numberCreatedPosts = new BehaviorSubject<number>(0);
  private numberCreatedTags = new BehaviorSubject<number>(0);

  constructor(private applicationService: ApplicationService,
    private http: HttpClient,
    private authService: AuthService) {
    super(http);
    this.authService.isLogged().subscribe(value => this.loggedData = value);
    this.tagLang = this.getPostLang(); // must be first to set tag
    this.numberOfPosts(new HttpParams().set('tag', this.tagLang)); // init on start number post in header
    this.applicationService.getPostLang().subscribe((tagPostLang: string) => {
      this.tagLang = tagPostLang;
      this.loadPosts.next(); // after set posts lang, trigger to load posts
    });
  }

  getCreatedPosts(sortParams: SortModel): Observable<Array<PostResult>> {
    this.numberOfPosts(new HttpParams().set('tag', this.tagLang));
    return this.getPosts(this.getPostParams(sortParams, this.tagLang), 'created').map(res => res.result)
      .mergeMap(posts => this.setVotedPosts(posts)).map(posts => this.parse(posts));
  }

  getCreatedNextPosts(author: string, permLink: string, sortParams: SortModel): Observable<Array<PostResult>> {
    const params = this.getNextPostParams(sortParams, this.tagLang, author, permLink);
    return this.getPosts(params, 'created').map(res => res.result)
      .mergeMap(posts => this.setVotedPosts(posts)).map(posts => this.parse(posts));
  }

  getTrendingPosts(sortParams: SortModel): Observable<Array<PostResult>> {
    return this.getPosts(this.getPostParams(sortParams, this.tagLang), 'trending').map(res => res.result)
      .mergeMap(posts => this.setVotedPosts(posts)).map(posts => this.parse(posts));
  }

  getTrendingNextPosts(author: string, permLink: string, sortParams: SortModel): Observable<Array<PostResult>> {
    const params = this.getNextPostParams(sortParams, this.tagLang, author, permLink);
    return this.getPosts(params, 'trending').map(res => res.result)
      .mergeMap(posts => this.setVotedPosts(posts)).map(posts => this.parse(posts));
  }

  getHotPosts(): Observable<Array<PostResult>> {
    return this.getPosts(this.getPostParams(null, this.tagLang), 'hot').map(res => res.result)
      .mergeMap(posts => this.setVotedPosts(posts)).map(posts => this.parse(posts));
  }

  getHotNextPosts(author: string, permLink: string): Observable<Array<PostResult>> {
    const params = this.getNextPostParams(null, this.tagLang, author, permLink);
    return this.getPosts(params, 'hot').map(res => res.result)
      .mergeMap(posts => this.setVotedPosts(posts)).map(posts => this.parse(posts));
  }

  getPostsStream(sortParams: SortModel): Observable<Array<PostResult>> {
    let param = new HttpParams().set('limit', '70').set('onlyStrimiPosts', 'true');
    param = this.prepareParams(param, sortParams);

    return this.http.get<PostsData>(api_url + '/stream/posts', { params: param })
      .map(res => res.result)
      .mergeMap(posts => this.setVotedPosts(posts)).map(posts => this.parse(posts));
  }

  getNextPostsStream(author: string, permLink: string, sortParams: SortModel): Observable<Array<PostResult>> {
    let param = new HttpParams().set('limit', '35').set('startAuthor', author)
      .set('startPermlink', permLink).set('onlyStrimiPosts', 'true');
    param = this.prepareParams(param, sortParams);

    return this.http.get<PostsData>(api_url + '/stream/posts', { params: param })
      .map(res => res.result)
      .mergeMap(posts => this.setVotedPosts(posts)).map(posts => this.parse(posts));
  }

  getDetailPostStream(authorName: string, permlink: string): Observable<PostResult> {
    const param = new HttpParams().set('authorName', authorName).set('permlink', permlink);
    return this.http.get<PostDataDetails>(api_url + '/posts', { params: param }).map(res => res.result)
    .mergeMap(post => this.setVotedPost(post)).map(post => parsePost(post));
  }

  getCommentsPostStream(authorName: string, permlink: string): Observable<Array<PostResult>> {
    const param = new HttpParams().set('authorName', authorName).set('permlink', permlink);
    return this.http.get<PostsData>(api_url + '/comments/all', { params: param }).map(res => res.result)
      .mergeMap(posts => this.setVotedPosts(posts)).map(posts => this.parse(posts));
  }

  // build params for posts request
  private getPostParams(sortParams: SortModel, tag) {
    let param = new HttpParams().set('tag', tag).set('limit', '35').set('onlyStrimiPosts', '1');
    param = this.prepareParams(param, sortParams);
    return param;
  }

  // build params for next posts request
  private getNextPostParams(sortParams: SortModel, tag, author, permLink) {
    let param = new HttpParams().set('tag', tag).set('limit', '35').set('startAuthor', author)
      .set('startPermlink', permLink).set('onlyStrimiPosts', '1');
    param = this.prepareParams(param, sortParams);
    return param;
  }

  getDetailPost(authorName: string, permlink: string): Observable<PostResult> {
    const params = new HttpParams().set('authorName', authorName).set('permlink', permlink);
    return this.getPostDetail(params).map(res => res.result)
    .mergeMap(post => this.setVotedPost(post)).map(post => parsePost(post));
  }

  getCommentsPost(authorName: string, permlink: string): Observable<Array<PostResult>> {
    const params = new HttpParams().set('authorName', authorName).set('permlink', permlink);
    return this.getComments(params).map(res => res.result)
      .mergeMap(posts => this.setVotedPosts(posts)).map(posts => this.parse(posts));
  }

  getTagPost(sortOrder: string, tag: string, sortParams: SortModel): Observable<Array<PostResult>> {
    let param = new HttpParams().set('tag', tag).set('limit', '35');
    param = this.prepareParams(param, sortParams);
    this.numberOfTagPosts(new HttpParams().set('tag', tag)); // only to get info about number of created posts
    if (sortOrder === 'trending') {
      return this.getTrendingTagPosts(param);
    } else if (sortOrder === 'created') {
      return this.getCreatedTagPosts(param);
    } else if (sortOrder === 'hot') {
      return this.getHotTagPosts(param);
    }
  }

  getTrendingTagPosts(param: HttpParams): Observable<Array<PostResult>> {
    return this.getPosts(param, 'trending').map(res => parsePosts(res.result));
  }

  getCreatedTagPosts(param: HttpParams): Observable<Array<PostResult>> {
    return this.getPosts(param, 'created').map(res => {
      return parsePosts(res.result);
    });
  }

  numberOfTagPosts(param: HttpParams) {
    this.getCount(param).subscribe(res => {
      this.setNumberCreatedTags(res.count);
    });
  }

  numberOfPosts(param: HttpParams) {
    this.getCount(param).subscribe(res => {
      this.setNumberCreatedPosts(res.count);
    });
  }

  getHotTagPosts(param: HttpParams): Observable<Array<PostResult>> {
    return this.getPosts(param, 'hot').map(res => parsePosts(res.result));
  }

  getNextTags(sortOrder: string, tag: string, author: string, permLink: string, sortParams: SortModel): Observable<Array<PostResult>> {
    let param = new HttpParams().set('tag', tag).set('limit', '35').set('startAuthor', author).set('startPermlink', permLink);
    param = this.prepareParams(param, sortParams);
    return this.getPosts(param, sortOrder).map(res => parsePosts(res.result));
  }

  setVotedPost(post: PostResult): Observable<PostResult> {
    // tslint:disable-next-line:curly
    if (!this.loggedData) return Observable.of(post);
    return this.authService.userService.getUsersVotes(this.loggedData.user.name).map(votes => {
      // newest are on bottom, so reverse
      const value = votes.reverse().find(vote => vote.authorperm === post.author + '/' + post.permlink);
      if (value) {
        post.isVoted = true;
      }
      return post;
    });
  }

  setVotedPosts(posts: Array<PostResult>): Observable<Array<PostResult>> {
    // tslint:disable-next-line:curly
    if (!this.loggedData) return Observable.of(posts);
    return this.authService.userService.getUsersVotes(this.loggedData.user.name).map(votes => {
      // newest are on bottom, so reverse
      return this.markVotedPosts(posts, votes.reverse());
    });
  }

  markVotedPosts(posts: Array<PostResult>, votes: Array<VotesUser>) {
    return posts.map(post => {
      const value = votes.find(vote => vote.authorperm === post.author + '/' + post.permlink);
      if (value) {
        post.isVoted = true;
      }
      if (post.comments && post.comments.length > 0) {
        this.markVotedPosts(post.comments, votes);
      }
      return post;
    });
  }


  // Read from local Storage selected post tag. If empty, set tag 'strimi'
  getPostLang(): string {
    const lang = localStorage.getItem(Constants.STORAGE_KEY_POST_LANG);
    return lang ? lang : Constants.STRIMI_TAG;
  }

  // parse posts
  private parse = (posts: Array<PostResult>): Array<PostResult> => {
    return posts.map(parsePost);
  };

  private prepareParams(param: HttpParams, sortParams: SortModel) {
    // tslint:disable-next-line:curly
    if (!sortParams) return param;
    if (sortParams.selectedOrder) {
      param = param.append('customSortOrder', sortParams.selectedOrder);
    }
    if (sortParams.selectedTime) {
      param = param.append('time', sortParams.selectedTime);
    }
    return param;
  }

  setNumberCreatedPosts(num: number) {
    this.numberCreatedPosts.next(num);
  }

  getNumberCreatedPosts(): Observable<number> {
    return this.numberCreatedPosts.asObservable();
  }

  setNumberCreatedTags(num: number) {
    this.numberCreatedTags.next(num);
  }

  getNumberCreatedTags(): Observable<number> {
    return this.numberCreatedTags.asObservable();
  }

}
