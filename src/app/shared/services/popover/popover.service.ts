import { Injectable, OnDestroy } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class PopoverService {

  openedPopover: NgbPopover;

  setPopOver(popover: NgbPopover) {
    this.close();
    this.openedPopover = popover;
  }

  close() {
    if (this.openedPopover) {
      this.openedPopover.close();
      this.openedPopover = null;
    }
  }

}
