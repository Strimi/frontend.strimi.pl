import { Component, OnInit } from '@angular/core';

import { PopularTag } from '../../..';
import { TagRankingService } from '../../../services/tag-ranking.service';

/**
 * Shows popular tags
 */
@Component({
  selector: 'app-popular-tags',
  templateUrl: './popular-tags.component.html'
})
export class PopularTagsComponent implements OnInit {

  tags: Array<PopularTag>;

  constructor(public tagService: TagRankingService) {
    this.tagService.popularTags.subscribe(res => {
      if (res) {
        this.tags = res.slice(0, 25);
      }
    });
  }

  ngOnInit() {
    this.tagService.revertTags();
  }

  onValueChange(value) {
    if (value) {
      this.tagService.getTagsSuggestFor(value);
    } else {
      this.tagService.revertTags();
    }
  }

}
