import { Component, Input } from '@angular/core';

import { JsonMetadata } from '../../..';
import { environment } from '../../../../../environments/environment';

/**
 * Shows image for posts
 */
@Component({
  selector: 'app-image-post',
  templateUrl: './image-post.component.html'
})

export class ImagePostComponent {

  url: string;

  @Input()
  set jsonMeta(jsonMeta: JsonMetadata) {
    if (jsonMeta.strimi_metadata && jsonMeta.strimi_metadata.thumb) {
      this.url = `url(${environment.apiImages}/512x512/${jsonMeta.strimi_metadata.thumb}`;
    } else if (jsonMeta.image && jsonMeta.image[0]) {
      this.url = `url(${environment.apiImages}/512x512/${jsonMeta.image[0]}`;
    }
  }
}
