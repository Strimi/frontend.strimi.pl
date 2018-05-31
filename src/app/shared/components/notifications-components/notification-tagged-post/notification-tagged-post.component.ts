import { Component, OnInit, Input } from '@angular/core';
import { NotificationTaggedPost } from '../../../index';

@Component({
  selector: 'app-notification-tagged-post',
  templateUrl: './notification-tagged-post.component.html',
  styles: []
})
export class NotificationTaggedPostComponent implements OnInit {

  @Input()
  notification: NotificationTaggedPost;

  constructor() { }

  ngOnInit() {
  }

}
