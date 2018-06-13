import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PostResult, StrimiMetadata} from '../../../../index';

@Component({
  selector: 'app-post-image',
  templateUrl: './post-image.component.html'
})
export class PostImageComponent {

  post: PostResult;
  metaStrimi: StrimiMetadata;

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
    this.metaStrimi = postResult.json_metadata.strimi_metadata;
  }
}
