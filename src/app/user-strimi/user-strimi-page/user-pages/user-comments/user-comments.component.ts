import { Component, OnInit } from '@angular/core';
import { UserStrimiService } from '../../../../shared/services/user-strimi.service';
import { ActivatedRoute, Params, Router, Routes } from '@angular/router';
import { PostResult, CommonContent } from '../../../../shared/index';

@Component({
  selector: 'app-user-comments',
  templateUrl: './user-comments.component.html',
  styles: []
})
export class UserCommentsComponent extends CommonContent implements OnInit {

  constructor(private userService: UserStrimiService, private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.route.parent.params.subscribe((params: Params) => {
      const authorName = params['authorName'].replace('@', '');
      this.getData(this.userService.getUsersComments(authorName));
    });
  }

  nextPosts() {
    const last = this.data[this.data.length - 1];
    this.getNext(this.userService.getNextUsersComments(last.author, last.permlink));
  }
}
