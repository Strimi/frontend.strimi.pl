import { Component } from '@angular/core';

import { CommonContent } from '../../shared';
import { PostService } from '../../shared/services/post.service';


@Component({
  selector: 'app-hot',
  templateUrl: './post-hot.component.html'
})
export class PostHotComponent extends CommonContent {

  constructor(private postService: PostService) {
    super();
    this.getPosts();
    this.postService.loadPosts.subscribe(() => this.getPosts());
  }

  getPosts() {
    this.getData(this.postService.getHotPosts());
  }

  nextPosts(): void {
    const last = this.data[this.data.length - 1];
    this.getNext(this.postService.getHotNextPosts(last.author, last.permlink));
  }
}
