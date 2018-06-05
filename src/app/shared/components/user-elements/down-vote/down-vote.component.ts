import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth/auth.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {PostResult, UserLogin} from '../../../index';

@Component({
  selector: 'app-down-vote',
  templateUrl: './down-vote.component.html',
  styles: []
})
export class DownVoteComponent implements OnInit {

  @Input()
  post: PostResult;
  showSpinner: boolean;
  showError: boolean;
  canVote: boolean;
  loginData: UserLogin;

  startValue = 100;
  step = 1;
  min = 0;
  max = 100;
  thumbLabel = false;
  value = this.startValue;

  constructor(public activeModal: NgbActiveModal,
              private authService: AuthService) {
    this.authService.isLogged().subscribe(login => {
      this.loginData = login.loginData;
      this.canVote = parseFloat(login.user.vesting_shares) >= 1000000;
    });
  }


  ngOnInit() {
  }

  close() {
    this.activeModal.close();
  }

  vote() {
    this.showError = false;
    this.showSpinner = true;
    const value = this.value * -1;
    this.authService.vote(this.authService.loggedData.getValue().loginData, this.post.author, this.post.permlink, value, this.handleVote);
  }

  handleVote = (value, error) => {
    this.showSpinner = false;
    this.showError = false;
    if (value) {
      value = value * -1;
      console.log('GŁOSOWANIE', value);
      this.close();
      if (this.post['upvotes']) { // posts have a upvotes
        this.post.upvotes = value;
      } else {
        this.post.net_votes = value; // comments have net_votes
      }
      this.post.isVoted = true;
    } else if (error) {
      console.log('ERRROR', error);
      this.showError = true;
    }
  };
}
