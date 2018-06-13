import {Component, EventEmitter, Input, Output} from '@angular/core';

import {PostResult} from '../../..';

@Component({
  selector: 'app-post-detail-selector',
  templateUrl: './post-detail-selector.component.html'
})
export class PostDetailSelectorComponent {

  postType: string;
  postResult: PostResult;

  @Input()
  showEdit: boolean;
  @Input()
  showDelete: boolean;
  @Input()
  showDownVote: boolean;
  @Output()
  postToEdit = new EventEmitter<PostResult>();

  @Output()
  postToDelete = new EventEmitter<PostResult>();

  @Input()
  set post(post: PostResult) {
    this.postResult = post;
    if (post.json_metadata.strimi_metadata) {
      this.postType = post.json_metadata.strimi_metadata.type.type;
    }
  }
}
