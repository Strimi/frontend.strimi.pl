import { Component, OnInit, Input } from '@angular/core';
import { PostResult } from '../../../index';
import * as removeMarkdown from 'remove-markdown';

/**
 * Shows short descriptnion about post content
 */
@Component({
  selector: 'app-description-post',
  templateUrl: './description-post.component.html'
})
export class DescriptionPostComponent implements OnInit {

  @Input()
  post: PostResult;

  @Input()
  textLength: number;

  description: string;

  ngOnInit() {
    if (this.post.json_metadata.strimi_metadata) {
      this.description = this.post.json_metadata.strimi_metadata.body;
    } else {
      this.description = this.post.body;
    }
    this.description = removeMarkdown(this.description);
    this.description = this.cutText(this.description);
  }

  cutText(body: string) {
    return body.substring(0, this.textLength) + '...';
  }

}
