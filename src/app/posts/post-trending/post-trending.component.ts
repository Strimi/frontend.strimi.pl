import { Component } from '@angular/core';


import { CommonContent, SortModel } from '../../shared/index';
import { PostService } from '../../shared/services/post.service';
import { LocalStorageSrvice } from '../../shared/services/local-storage.service';

@Component({
  selector: 'app-post-trending',
  templateUrl: './post-trending.component.html'
})
export class PostTrendingComponent extends CommonContent {

  sortParams = new SortModel();

  constructor(private postService: PostService, public localStorage: LocalStorageSrvice) {
    super();
    this.getPosts();
    this.postService.loadPosts.subscribe(() => this.getPosts());
  }

  getPosts() {
    this.getData(this.postService.getTrendingPosts(this.sortParams));
  }

  nextPosts(): void {
    const last = this.data[this.data.length - 1];
    this.getNext(this.postService.getTrendingNextPosts(last.author, last.permlink, this.sortParams));
  }

  onSort(params: SortModel) {
    this.sortParams = params;
    this.getPosts();
  }
}
