import {Injectable} from '@angular/core';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import * as steem from 'steem';

import {UserLogin, UserStrimi} from '../../models';
import {LocalStorageSrvice} from '../local-storage.service';
import {UserStrimiService} from '../user-strimi.service';
import {VoteService} from './vote.service';
import {LoggedData, PostDataDetails, PostResult} from '../../index';
import {PostApiService} from '../post-api.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {SocketService} from '../notifications/socket.service';
import {Router} from '@angular/router';

const apiUrl = environment.apiStrimi;

@Injectable()
export class AuthService extends PostApiService {

  loggedData = new BehaviorSubject<LoggedData>(null);

  // after voted post is emitted
  private votedPost = new BehaviorSubject<PostResult>(null);

  constructor(public userService: UserStrimiService,
              private localStorageService: LocalStorageSrvice,
              private voteService: VoteService,
              private http: HttpClient,
              private socketService: SocketService,
              private router: Router) {
    super(http);
    this.initLogIn();
  }

  isLogged() {
    return this.loggedData.asObservable();
  }

  getVotedPost() {
    return this.votedPost.asObservable();
  }

  public logIn(userLogin: UserLogin, callback: Function, modal: NgbModalRef) {
    this.userService.getUser(userLogin.login).subscribe(user => {
      const isWif = steem.auth.isWif(userLogin.pass);
      if (isWif) {
        this.loginWithPosting(user, userLogin, callback, modal);
      } else {
        this.loginWithMaster(user, userLogin, callback, modal);
      }
    });
  }

  private loginWithPosting(user: UserStrimi, userLogin: UserLogin, callback: Function, modal: NgbModalRef) {
    const wifToPublic = steem.auth.wifToPublic(userLogin.pass);
    const pubPostingKey = user.posting.key_auths[0][0];
    if (wifToPublic === pubPostingKey) {
      this.saveLogin(user, userLogin.login, userLogin.pass);
      modal.close();
    } else {
      callback('header.top_menu.my_strimi.bad_pas');
    }
  }

  private loginWithMaster(user: UserStrimi, userLogin: UserLogin, callback: Function, modal: NgbModalRef) {
    const pubPostingKey = user.posting.key_auths[0][0];
    const privPosting = steem.auth.toWif(userLogin.login, userLogin.pass, ['posting']);
    const isValid = steem.auth.wifIsValid(privPosting, pubPostingKey);
    if (isValid) {
      this.saveLogin(user, userLogin.login, privPosting);
      modal.close();
    } else {
      callback('header.top_menu.my_strimi.bad_pas');
    }
  }

  private saveLogin(user: UserStrimi, login, pass) {
    const userLogin = new UserLogin(login, pass);
    this.localStorageService.logIn(login, pass);
    this.loggedData.next(new LoggedData(userLogin, user));
    this.initSocket(login);
    this.router.navigate(['/']);
    window.location.reload();
  }

  private logOut() {
    this.loggedData.next(null);
    this.localStorageService.logOutUser();
    this.socketService.closeSocket();
    this.router.navigate(['/']);
    window.location.reload();
  }

  private initLogIn() {
    const userData = this.localStorageService.getUserData();
    if (userData) {
      this.userService.getUser(userData.login).subscribe(user => {
        this.loggedData.next(new LoggedData(userData, user));
        this.initSocket(userData.login);
      });
    }
  }

  private initSocket(userName: string) {
    this.socketService.initSocket(userName);
  }

  vote(userLogin: UserLogin, author: string, permLink: string, weight: number, callback: Function) {
    this.voteService.votePost(userLogin, author, permLink, weight, callback, this.updateData);
  }

  updateData = (author, permlink) => {
    const name = this.loggedData.getValue().loginData.login;
    this.userService.getUser(name).subscribe(user => {
      const logginData = this.loggedData.getValue().loginData;
      this.loggedData.next(new LoggedData(logginData, user));
    });

    const param = new HttpParams().set('authorName', author).set('permlink', permlink);
    return this.http.get<PostDataDetails>(apiUrl + '/posts', {params: param})
      .subscribe(res => {
        this.votedPost.next(res.result);
      });
  };

}
