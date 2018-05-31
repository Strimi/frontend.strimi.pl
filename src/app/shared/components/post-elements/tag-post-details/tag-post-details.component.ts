import {Component, Input} from '@angular/core';
import {Constants, JsonMetadata} from '../../../index';


/**
 * Shows all tags for post
 */
@Component({
  selector: 'app-tag-post-details',
  templateUrl: './tag-post-details.component.html'
})
export class TagPostDetailsComponent {

  tags: Array<string>;

  @Input()
  set jsonMeta(jsonMeta: JsonMetadata) {
    if (jsonMeta.strimi_metadata && jsonMeta.tags.length > 0) {
      this.setStrimiTag(jsonMeta.tags);
    } else {
      this.tags = jsonMeta.tags;
    }
  }

  setStrimiTag(tags: Array<string>) {
    this.tags = tags.filter(this.removeStrimiTag).map(this.removePrefixStrimi);
  }

  removeStrimiTag = (tag: string) => {
    return tag !== Constants.STRIMI_TAG && tag !== Constants.STRIMI_TAG_PL;
  };

  removePrefixStrimi = (tag: string) => {
    if (tag) {
      return tag.split(Constants.STRIMI_PREFIX).pop();

    } else {
      return 'noTag';
    }
  };

}
