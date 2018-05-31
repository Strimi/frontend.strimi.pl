import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PostResult } from '../../../index';

/**
 * Shows users comments in profile.
 */
@Component({
  selector: 'app-comments-user-profile',
  templateUrl: './comments-user-profile.component.html',
  styles: []
})
export class CommentsUserProfileComponent implements OnInit {

  @Input()
  comments: Array<PostResult> = [];
  constructor(private router: Router) { }

  ngOnInit() {
  }

  toPost(post: PostResult) {
    // extract url
    this.router.navigateByUrl(post.url.split('#')[0]);
  }

}
