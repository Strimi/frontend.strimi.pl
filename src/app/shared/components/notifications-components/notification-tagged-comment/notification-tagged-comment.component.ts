import { Component, OnInit, Input } from '@angular/core';
import { NotificationTaggedComment } from '../../../index';

@Component({
  selector: 'app-notification-tagged-comment',
  templateUrl: './notification-tagged-comment.component.html',
  styles: []
})
export class NotificationTaggedCommentComponent implements OnInit {

  @Input()
  notification: NotificationTaggedComment;

  constructor() { }

  ngOnInit() {
  }

}
