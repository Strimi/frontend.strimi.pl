import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { UserStrimiService } from '../../../../shared/services/user-strimi.service';
import { CommonContent } from '../../../../shared/index';

@Component({
  selector: 'app-user-followers',
  templateUrl: './user-followers.component.html',
  styles: []
})
export class UserFollowersComponent extends CommonContent implements OnInit {

  constructor(private userService: UserStrimiService, private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.route.parent.params.subscribe((params: Params) => {
      const authorName = params['authorName'].replace('@', '');
      this.getData(this.userService.getUsersFollowersWithUsers(authorName));
    });
  }

  nextPosts() {
    const last = this.data[this.data.length - 1];
    this.getNext(this.userService.getNextUsersFollowersWithUsers(last.following, last.follower));
  }
}
