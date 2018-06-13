import {Component, EventEmitter, Input, Output} from '@angular/core';

import { PostResult } from '../../../..';



@Component({
  selector: 'app-post-external',
  templateUrl: './post-external.component.html'
})
export class PostExternalComponent {

  post: PostResult;

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
  set postResult(postResult: PostResult) {
    this.post = postResult;
  }

}
