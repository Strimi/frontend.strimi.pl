import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { PostsData } from '..';
import { environment } from '../../../environments/environment';
import { Constants } from '../settings/settings';

const api_url = environment.apiStrimi;
/**
 * Instance of this service should be in all application.
 * Generala service for common methods.
 */
@Injectable()
export class ApplicationService {

  constructor() {
  }

  // keep information about stram post language
  private selectedPostLang = new Subject<string>();


  setPostLang(streamLang: string) {
    this.selectedPostLang.next(streamLang);
  }

  getPostLang(): Observable<string> {
    return this.selectedPostLang.asObservable();
  }

}
