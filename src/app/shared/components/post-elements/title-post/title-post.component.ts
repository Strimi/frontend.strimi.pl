import { Component, Input } from '@angular/core';


/**
 * Shows title for posts with routerLink
 * @prop postResult
 */
@Component({
  selector: 'app-title-post',
  templateUrl: './title-post.component.html',
  styles: []
})
export class TitlePostComponent {


  titlePost: string;

  @Input()
  category: string;
  @Input()
  author: string;
  @Input()
  permlink: string;

  @Input()
  titleLength: number;

  @Input()
  set title(title: string) {
    this.titlePost = this.cutTitle(title);
  }

  cutTitle(title: string) {
    if (title.length > this.titleLength) {
      return title.substring(0, this.titleLength) + '...';
    }
    return title;
  }

  concatURL() {
    return `/${this.category}/@${this.author}/${this.permlink}`;
  }


}
