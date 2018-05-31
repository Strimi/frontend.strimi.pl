import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LoggedData, PostResult} from '../../../shared/index';
import {postAfter7Days} from '../../../shared';

@Component({
  selector: 'app-stream-container',
  templateUrl: './stream-container.component.html'
})
export class StreamContainerComponent implements OnInit {

  @Input()
  posts: Array<PostResult> = null;

  @Input()
  loggedData: LoggedData;

  @Output()
  onEditPost = new EventEmitter<PostResult>();
  @Output()
  onDeletePost = new EventEmitter<PostResult>();

  constructor() {
  }

  ngOnInit() {
  }

  showEdit(post: PostResult) {
    return this.loggedData
      && this.loggedData.loginData.login === post.author
      && postAfter7Days(post.created);
  }

  showDelete(post: PostResult) {
    return this.loggedData
      && this.loggedData.user.name === post.author
      && postAfter7Days(post.created)
      && post.children === 0 && post.net_votes === 0;
  }

}
