import { Input } from '@angular/core';
import { LoggedData, PostResult } from '../index';
import { AuthService } from '../services/auth/auth.service';

export class CommonVote {

  @Input()
  public postResult: PostResult;

  @Input()
  set post(post: PostResult) {
    this.postResult = post;
  }

  public errorVote: boolean;
  public showSpinner: boolean;
  public loggedData: LoggedData;
  public canSelfVote: boolean;

  constructor(public authService: AuthService) {
    this.authService.isLogged().subscribe((logged: LoggedData) => {
      if (logged) {
        this.loggedData = logged;
        this.canSelfVote = logged && parseFloat(logged.user.vesting_shares) >= 1000000;
      }
    });
  }

  voteDirect() {
    this.showSpinner = true;
    this.vote(100);
  }

  voteSlider(value) {
    this.vote(value);
  }

  vote(value) {
    this.showSpinner = true;
    this.authService.vote(this.loggedData.loginData, this.postResult.author, this.postResult.permlink, value, this.handleVote);
  }

  handleVote = (value, error) => {
    this.showSpinner = false;
    this.errorVote = false;
    if (value) {
      if (this.postResult['upvotes']) { // posts have a upvotes
        this.postResult.upvotes = value;
      } else {
        this.postResult.net_votes = value; // comments have net_votes
      }

      this.postResult.isVoted = true;
    } else if (error) {
      this.errorVote = true;
    }
  }
}
