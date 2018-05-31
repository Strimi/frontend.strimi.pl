import { Component, OnInit, Input } from '@angular/core';
import { NotificationCommented } from '../../../index';

@Component({
  selector: 'app-notification-commented',
  templateUrl: './notification-commented.component.html',
  styles: []
})
export class NotificationCommentedComponent implements OnInit {

  @Input()
  notification: NotificationCommented;

  constructor() { }

  ngOnInit() {
  }

}
