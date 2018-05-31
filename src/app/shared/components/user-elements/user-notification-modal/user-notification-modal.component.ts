import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { NotificationStrimi } from '../../../models/notification.model';

@Component({
  selector: 'app-user-notification-modal',
  templateUrl: './user-notification-modal.component.html'
})
export class UserNotificationModalComponent {


  @Input()
  notifications: Array<NotificationStrimi>;
  @Input()
  numNotifications: number;
  @Output()
  next = new EventEmitter<void>();
  modal: NgbModalRef;

  constructor(private modalService: NgbModal) { }

  open(content) {
    this.modal = this.modalService.open(content, { windowClass: 'modal-notification' });
  }

  onNext() {
    this.next.emit();
  }

  close() {
    this.modal.close();
    this.modal = null;
  }

}
