import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { UserStrimiService } from '../../../../shared/services/user-strimi.service';
import { CommonContent } from '../../../../shared/index';

@Component({
  selector: 'app-user-following',
  templateUrl: './user-following.component.html',
  styles: []
})
export class UserFollowingComponent extends CommonContent implements OnInit {

  constructor(private userService: UserStrimiService, private route: ActivatedRoute) {
   super();
  }

  ngOnInit() {
    this.route.parent.params.subscribe((params: Params) => {
      const authorName = params['authorName'].replace('@', '');
      this.getData(this.userService.getUsersFollowingWithUsers(authorName));
    });
  }

  nextPosts() {
    const last = this.data[this.data.length - 1];
   this.getNext(this.userService.getNextUsersFollowingWithUsers(last.follower, last.following));
  }
}
