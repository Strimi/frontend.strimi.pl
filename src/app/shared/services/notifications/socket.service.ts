import {Injectable} from '@angular/core';

import {NotificationInit, NotificationStrimi} from '../..';
import {Subject} from 'rxjs/Subject';

const SERVER_URL = 'wss://notifications.strimi.it/websocket/notifications';

@Injectable()
export class SocketService {

  private socket: WebSocket;
  onMessage = new Subject<NotificationStrimi>();

  constructor() {
  }


  initSocket(userName: string): void {
    const message: NotificationInit = {
      code: 0,
      username: userName,
      tags: []
    };
    this.socket = new WebSocket(SERVER_URL);
    this.send(message);
    this.addListener();
  }

  closeSocket() {
    if (this.socket) {
      this.socket.close();
    }
  }

  private send(message: NotificationInit): void {
    this.socket.onopen = () => {
      this.socket.send(JSON.stringify(message));
    };
  }

  addListener() {
    this.socket.onmessage = response => {
      const data = JSON.parse(response.data);
      this.onMessage.next(data);
    };
  }

}
