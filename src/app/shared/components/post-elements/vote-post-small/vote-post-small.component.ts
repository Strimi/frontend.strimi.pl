import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { LoggedData } from '../../../models/user-login.model';
import { CommonVote } from '../../../index';
import { PostResult } from '../../../models/posts.model';

/**
 * Shows information about number of votes.
 * Voting: If user has vesting_shares > 1000000 can self use value to vote.
 * Otherwise voting is directly send.
 */
@Component({
  selector: 'app-vote-post-small',
  templateUrl: './vote-post-small.component.html'
})
export class VotePostSmallComponent extends CommonVote {


  constructor(public authService: AuthService) {
    super(authService);
  }

}
