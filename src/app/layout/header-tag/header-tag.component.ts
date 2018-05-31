import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';

import { PostService } from '../../shared/services/post.service';

@Component({
  selector: 'app-header-tag',
  templateUrl: './header-tag.component.html'
})
export class HeaderTagComponent implements OnInit {

  tag;

  constructor(private route: ActivatedRoute, public postService: PostService) { }

  ngOnInit() {
    this.route.url.subscribe((segment: UrlSegment[]) => {
      this.tag = segment[1].path;
    });
  }
}
