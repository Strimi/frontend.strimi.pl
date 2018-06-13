import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PostResult, StrimiMetadata} from '../../../../index';

@Component({
  selector: 'app-post-link',
  templateUrl: './post-link.component.html'
})
export class PostLinkComponent {

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
