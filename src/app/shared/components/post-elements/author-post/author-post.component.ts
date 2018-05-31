import { Component, OnInit, Input } from '@angular/core';
import * as steem from 'steem';

/**
 * Shows author nick and reputation
 */
@Component({
  selector: 'app-author-post',
  templateUrl: './author-post.component.html'
})
export class AuthorPostComponent {

  @Input()
  author: string;

  @Input()
  classAuthor: string;

  @Input()
  classRep: string;

  rep: string;

  @Input()
  set reputation(reputation: string) {
    this.rep = steem.formatter.reputation(reputation);
  }
}
