import { Component, OnInit, Input } from '@angular/core';
import { NotificationVoted } from '../../../index';

@Component({
  selector: 'app-notification-voted-post',
  templateUrl: './notification-voted-post.component.html',
  styles: []
})
export class NotificationVotedPostComponent implements OnInit {


  @Input()
  notification: NotificationVoted;

  constructor() { }

  ngOnInit() {
  }

}
