import {Component, Input} from '@angular/core';
import {JsonMetadata} from '../../../index';
import {Constants} from '../../../settings/settings';

/**
 * Shows first tag and domain for post
 */
@Component({
  selector: 'app-tag-post',
  templateUrl: './tag-post.component.html'
})
export class TagPostComponent {

  tag: string;
  strimiDomain: string;
  urlSource: string;

  otherDomain: string;

  @Input()
  set jsonMeta(jsonMeta: JsonMetadata) {
    if (jsonMeta.strimi_metadata && jsonMeta.tags.length > 0) {
      this.setStrimiTag(jsonMeta.tags);
      this.strimiDomain = jsonMeta.strimi_metadata.domain ? jsonMeta.strimi_metadata.domain : 'strimi.it';
      this.urlSource = jsonMeta.strimi_metadata.source;
    } else {
      this.setTag(jsonMeta.tags);
      this.otherDomain = this.selectDomain(jsonMeta.app);
    }
  }

  setTag(tags: Array<string> | string) {
    if (Array.isArray(tags)) {
      this.tag = tags && tags.length > 0 ? tags[0] : '';
    } else {
      this.tag = tags;
    }
  }

  setStrimiTag(tags: Array<string> | string) {
    if (Array.isArray(tags)) {
      const arr = tags.filter(this.removeStrimiTag);
      if (arr.length > 0) {
        const tag = arr[0];
        if (tag) {
          this.tag = tag.split(Constants.STRIMI_PREFIX).pop();
        }
      }
    } else {
      this.tag = tags.split(Constants.STRIMI_PREFIX).pop();
    }

  }

  removeStrimiTag = (tag: string) => {
    return tag !== Constants.STRIMI_TAG && tag !== Constants.STRIMI_TAG_PL;
  };

  selectDomain(app: string): string {
    // tslint:disable-next-line:curly
    if (!app || app.length === 0 || app !== 'string') return '';
    if (app.includes(Constants.APP_STEEMIT)) {
      return Constants.APP_STEEMIT_URL;
    } else if (app.includes(Constants.APP_BUSSY)) {
      return Constants.APP_BUSSY_URL;
    } else if (app.includes(Constants.APP_DTUBE)) {
      return Constants.APP_DTUBE_URL;
    } else {
      return app.split('/').shift();
    }
  }
}
