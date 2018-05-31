import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {LoggedData, NotificationStrimi} from '../../../models';
import {AuthService} from '../../../services/auth/auth.service';
import {NotificationService} from '../../../services/notifications/notification.service';
import {UserStrimiService} from '../../../services/user-strimi.service';

@Component({
  selector: 'app-user-logged-panel',
  templateUrl: './user-logged-panel.component.html',
  providers: [NotificationService]
})
export class UserLoggedPanelComponent implements OnInit, OnDestroy {

  bandWith: string;
  votingPower: string;
  userName: string;
  notifications: Array<NotificationStrimi>;
  numNotifications = 0;
  subscription: Subscription;

  constructor(public authService: AuthService,
              private userStrimiService: UserStrimiService,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.subscription = this.authService.isLogged().subscribe((loggedData: LoggedData) => {
      if (loggedData) {
        this.userName = loggedData.user.name;
        this.bandWith = loggedData.user.voting_info.bandwidth_percent_remaining.toFixed(0);
        this.votingPower = (loggedData.user.voting_info.voting_power / 100).toFixed(0);
        this.getNumberNotifications();
        this.subscribeNotification();
      }
    });
  }

  subscribeNotification() {
    this.notificationService.listNotifications.asObservable().subscribe(arr => {
      if (arr) {
        this.notifications = [...arr];
      }
    });
  }

  getNumberNotifications() {
    this.notificationService.initNotifications();
    this.notificationService.numberNotifications.asObservable().subscribe(num => {
      this.numNotifications += num;
    });
  }

  nextNotifications() {
    if (this.notifications) {
      this.notificationService.getNextNotificationsPart(this.userName, this.notifications.length);
    }
  }

  resetCounter() {
    this.numNotifications = 0;
    this.notificationService.init(this.userName);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

