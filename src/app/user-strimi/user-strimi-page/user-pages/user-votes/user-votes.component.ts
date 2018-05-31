import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { VotesUser, CommonContent } from '../../../../shared';
import { UserStrimiService } from '../../../../shared/services/user-strimi.service';

@Component({
  selector: 'app-user-votes',
  templateUrl: './user-votes.component.html',
  styles: []
})
export class UserVotesComponent extends CommonContent implements OnInit {

  userName: string;

  constructor(private userService: UserStrimiService, private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.route.parent.params.subscribe((params: Params) => {
      const authorName = params['authorName'].replace('@', '');
      this.userName = authorName;
      this.getData(this.userService.getUsersVotesSlice(authorName));
    });
  }

  nextPosts() {
    const last = this.data[this.data.length - 1];
    this.getNext(this.userService.getNextUsersVotesSlice(this.userName, last.authorperm));
  }

  getAuthorName(vote: VotesUser) {
    return vote.authorperm.split('/')[0];
  }

  getPermLink(vote: VotesUser) {
    return vote.authorperm.split('/')[1];
  }

}
