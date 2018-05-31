import { Component, OnInit, Input } from '@angular/core';

/**
 * Used to show description for stream post
 */
@Component({
  selector: 'app-stream-description',
  templateUrl: './stream-description.component.html',
  styles: []
})
export class StreamDescriptionComponent {


  @Input()
  textLength: number;

  showButton: boolean;
  showButtonLess: boolean;

  description: string;
  fullBody: string;


  @Input()
  set body(body: string) {
    this.fullBody = body;
    if (body.length > this.textLength) {
      this.description = this.cutText(body);
      this.showButton = true;
    } else {
      this.description = body;
    }
  }

  cutText(body: string) {
    return body.substring(0, this.textLength) + '<span class="dotted-more">...</span>';
  }

  showMoreLess() {
    this.showButtonLess = !this.showButtonLess;
    if (this.showButtonLess === true) {
      this.description = this.fullBody;
    } else {
      this.description = this.cutText(this.fullBody);
    }
  }

}
