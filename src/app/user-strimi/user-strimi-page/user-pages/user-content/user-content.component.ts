import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { CommonContent } from '../../../../shared';
import { UserStrimiService } from '../../../../shared/services/user-strimi.service';

@Component({
  selector: 'app-user-content',
  templateUrl: './user-content.component.html',
  styles: []
})
export class UserContentComponent extends CommonContent implements OnInit {

  constructor(private userService: UserStrimiService, private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.route.paramMap.subscribe((param: Params) => {
      const authorName = param.get('authorName').replace('@', '');
      this.getData(this.userService.getUserPosts(authorName));
    });
  }

  nextPosts() {
    const last = this.data[this.data.length - 1];
    this.getNext(this.userService.getNextPosts(last.author, last.permlink));
  }

}
