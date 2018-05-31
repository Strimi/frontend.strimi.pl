import {Component} from '@angular/core';
import {AuthService} from '../../../services/auth/auth.service';
import {CommonVote} from '../../../index';

/**
 * Shows information about number of votes.
 * Voting: If user has vesting_shares > 1000000 can self use value to vote.
 * Otherwise voting is directly send.
 */
@Component({
  selector: 'app-vote-post',
  templateUrl: './vote-post.component.html'
})
export class VotePostComponent extends CommonVote {

  constructor(public authService: AuthService) {
    super(authService);
  }
}
