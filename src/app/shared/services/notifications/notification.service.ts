import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {NotificationCommented, NotificationStrimi, NotificationTaggedComment, NotificationTaggedPost, NotificationVoted} from '../..';
import {PostService} from '../post.service';
import {StrimiApiService} from '../strimi-api.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {SocketService} from './socket.service';

@Injectable()
export class NotificationService extends StrimiApiService {

  listNotifications = new BehaviorSubject<Array<NotificationStrimi>>(null);
  numberNotifications = new BehaviorSubject<number>(0);
  numberStreamNotifications = new BehaviorSubject<number>(0);

  constructor(private httpClient: HttpClient,
              private postService: PostService,
              private socketService: SocketService) {
    super(httpClient);
  }

  init(userName: string) {
    this.getNotification(userName).map(e => {
      return e.reverse().filter(n => n.code !== 0).slice(0, 10);
    }).mergeMap(e => this.notificationWithPost(e)).subscribe(arr => {
      const filtered = arr.filter(e => e !== null);
      this.listNotifications.next(filtered);
    });
  }

  getNextNotificationsPart(userName: string, lastIndex: number) {
    this.getNotification(userName).map(e => {
      return e.reverse().filter(n => n.code !== 0).slice(lastIndex, lastIndex + 10);
    }).mergeMap(e => this.notificationWithPost(e)).subscribe(arr => {
      const filtered = arr.filter(e => e !== null);
      this.listNotifications.next([...this.listNotifications.getValue(), ...filtered]);
    });
  }

  initNotifications() {
    this.socketService.onMessage.subscribe(data => {
      if (data.code !== 11) {
        const num = this.numberNotifications.getValue();
        this.numberNotifications.next(num + 1);
      }
    });
  }

  // TODO
  initNotificationsStream() {
    // prod version
    this.socketService.onMessage.subscribe(data => {
      if (data.code === 11) {
        const num = this.numberStreamNotifications.getValue();
        this.numberStreamNotifications.next(num + 1);
      }
    });
    // symulator do developmentu
    // Observable.interval(1000).subscribe(e => {
    //   const num = this.numberStreamNotifications.getValue();
    //   this.numberStreamNotifications.next(num + 1);
    // });
  }

  closeSocket() {
    this.socketService.closeSocket();
  }

  getPost(notification): Observable<NotificationStrimi> {
    return this.postService.getDetailPost(notification.author, notification.permlink)
      .map(post => {
        notification.category = post.category;
        notification.title = post.title;
        notification.root_title = post.root_title;
        notification.url = post.url;
        notification.body = post.body;
        return notification as NotificationStrimi;
      });
  }

  private notificationWithPost(notifications: Array<NotificationStrimi>): Observable<Array<NotificationStrimi>> {
    return Observable.forkJoin(notifications.map(e => {
      if (e.code === 2) {
        const notification = e as NotificationVoted;
        return this.postService.getDetailPost(notification.author, notification.permlink)
          .map(post => {
            notification.category = post.category;
            notification.title = post.title;
            notification.root_title = post.root_title;
            notification.url = post.url;
            notification.body = post.body;
            return notification as NotificationStrimi;
          }).catch(err => Observable.of(null));
      } else if (e.code === 6) {
        const notification = e as NotificationCommented;
        return this.postService.getDetailPost(notification.author, notification.permlink)
          .map(post => {
            notification.category = post.category;
            notification.title = post.title;
            notification.url = post.url;
            notification.body = post.body;
            notification.depth = post.depth;
            return notification as NotificationStrimi;
          }).catch(err => Observable.of(null));
      } else if (e.code === 8) {
        const notification = e as NotificationTaggedComment;
        return this.postService.getDetailPost(notification.author, notification.permlink)
          .map(post => {
            notification.body = post.body;
            notification.url = post.url;
            notification.category = post.category;
            return notification as NotificationStrimi;
          }).catch(err => Observable.of(null));
      } else if (e.code === 9) {
        const notification = e as NotificationTaggedPost;
        return this.postService.getDetailPost(notification.author, notification.permlink)
          .map(post => {
            notification.body = post.body;
            notification.url = post.url;
            notification.category = post.category;
            return notification as NotificationStrimi;
          }).catch(err => Observable.of(null));
      }
      return Observable.of(e);
    }));
  }

}

