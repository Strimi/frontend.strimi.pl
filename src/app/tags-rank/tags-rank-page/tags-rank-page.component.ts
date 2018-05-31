import { Component, OnInit, OnDestroy } from '@angular/core';
import { PopularTag } from '../../shared/index';
import { TagRankingService } from '../../shared/services/tag-ranking.service';

@Component({
  selector: 'app-tags-rank-page',
  templateUrl: './tags-rank-page.component.html'
})
export class TagsRankPageComponent implements OnInit, OnDestroy {

  // use for table
  displayedColumns = ['name', 'top_posts', 'comments', 'total_payouts'];

  tagsList: Array<PopularTag>;
  hiddenButton = false;

  constructor(private tagService: TagRankingService) { }

  ngOnInit() {
    this.tagService.popularTags.subscribe(tags => this.tagsList = tags);
    this.tagService.revertTags();
  }


  ngOnDestroy(): void {
    this.tagService.revertTags();
  }

  nextTags(): void {
    this.tagService.getNextTag(this.tagsList[this.tagsList.length - 1].name);
  }

  onValueChange(value) {
    if (value) {
      this.hiddenButton = true;
      this.tagService.getTagsSuggestFor(value);
    } else {
      this.hiddenButton = false;
      this.tagService.revertTags();
    }
  }

}
