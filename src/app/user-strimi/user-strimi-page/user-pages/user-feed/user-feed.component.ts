import { Component, OnInit } from '@angular/core';
import { PostResult, CommonContent } from '../../../../shared/index';
import { UserStrimiService } from '../../../../shared/services/user-strimi.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-user-feed',
  templateUrl: './user-feed.component.html'
})
export class UserFeedComponent extends CommonContent implements OnInit {

  // public posts: Array<PostResult>;
  private userName: string;

  constructor(private userService: UserStrimiService, private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.route.parent.params.subscribe((params: Params) => {
      const authorName = params['authorName'].replace('@', '');
      this.userName = authorName;
      this.getData(this.userService.getUserFeedPosts(authorName));
    });
  }

  nextPosts() {
    const last = this.data[this.data.length - 1];
    this.getNext(this.userService.getNextFeedPosts(last.author, last.permlink, this.userName));
  }

}
