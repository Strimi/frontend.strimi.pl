import {PostDataDetails, PostsData} from '../index';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {RecognizedLink} from '../models/recognize-link.model';
import * as steem from 'steem';

const apiUrl = environment.apiStrimi;

/**
 * Service to call post API
 */
export class PostApiService {


  constructor(private httpClient: HttpClient) {
  }

  getPosts(params: HttpParams, url: string): Observable<PostsData> {
    return this.httpClient.get<PostsData>(apiUrl + `/posts/${url}`, {params: params});
  }

  getPostDetail(params: HttpParams) {
    return this.httpClient.get<PostDataDetails>(apiUrl + '/posts', {params: params});
  }

  getComments(params: HttpParams) {
    return this.httpClient.get<PostsData>(apiUrl + '/comments/all', {params: params});
  }

  getCount(params: HttpParams) {
    return this.httpClient.get<any>(apiUrl + '/posts/created/count', {params: params});
  }

  recognizeLink(url: string): Observable<RecognizedLink> {
    const param = new HttpParams().set('url', url);
    return this.httpClient.get<RecognizedLink>(apiUrl + `/recognize/url`, {params: param});
  }

  deletePost(wif: string, author: string, permlink: string) {
    const promise = steem.broadcast.deleteCommentAsync(wif, author, permlink);
    return Observable.fromPromise(promise);
  }

}
