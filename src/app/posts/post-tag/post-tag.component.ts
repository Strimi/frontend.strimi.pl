import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';

import { CommonContent, SortModel } from '../../shared';
import { PostService } from '../../shared/services/post.service';
import { TagsResolve } from '../../shared/services/reslovers/tags-resolve';

@Component({
  selector: 'app-post-tag',
  templateUrl: './post-tag.component.html'
})
export class PostTagComponent extends CommonContent implements OnInit {

  sortParams = new SortModel();
  sortOrder: string;
  tag: string;

  constructor(private route: ActivatedRoute, private postService: PostService, private tagsResolve: TagsResolve) {
    super();
    this.tagsResolve.isLoading.asObservable().subscribe(isLoading => {
      if (isLoading) {
        this.data = null;
        this.showSpinner = true;
      }
    });
  }

  ngOnInit() {
    this.route.url.subscribe((segment: UrlSegment[]) => {
      this.sortOrder = segment[0].path;
      this.tag = segment[1].path;
    });
    // recived from TagsResolver
    this.route.data.subscribe(dataRoute => {
      const posts = dataRoute['tagPosts'];
      this.getData(posts);
    });
  }

  getTagPosts(sortOrder: string, tag: string) {
    this.getData(this.postService.getTagPost(sortOrder, tag, this.sortParams));
  }

  nextTags() {
    const last = this.data[this.data.length - 1];
    this.getNext(this.postService.getNextTags(this.sortOrder, this.tag, last.author, last.permlink, this.sortParams));
  }

  // recive sort params and fetch posts with new params
  onSort(params: SortModel) {
    this.sortParams = params;
    this.getTagPosts(this.sortOrder, this.tag);
  }
}
