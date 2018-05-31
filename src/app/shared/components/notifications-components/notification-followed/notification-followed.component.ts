import { Component, OnInit, Input } from '@angular/core';
import { NotificationFollowed } from '../../../index';


@Component({
  selector: 'app-notification-followed',
  templateUrl: './notification-followed.component.html',
  styles: []
})
export class NotificationFollowedComponent implements OnInit {

  @Input()
  notification: NotificationFollowed;

  constructor() { }

  ngOnInit() {
  }

}
