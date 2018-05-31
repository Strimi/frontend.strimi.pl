import { Component } from '@angular/core';

import { CommonContent, SortModel } from '../../shared';
import { PostService } from '../../shared/services/post.service';

@Component({
  selector: 'app-post-created',
  templateUrl: './post-created.component.html'
})
export class PostCreatedComponent extends CommonContent {

  sortParams = new SortModel();

  constructor(private postService: PostService) {
    super();
    this.getPosts();
    this.postService.loadPosts.subscribe(() => this.getPosts());
  }

  getPosts() {
    this.getData(this.postService.getCreatedPosts(this.sortParams));
  }

  nextPosts(): void {
    const last = this.data[this.data.length - 1];
    this.getNext(this.postService.getCreatedNextPosts(last.author, last.permlink, this.sortParams));
  }

  onSort(params: SortModel) {
    this.sortParams = params;
    this.getPosts();
  }
}


