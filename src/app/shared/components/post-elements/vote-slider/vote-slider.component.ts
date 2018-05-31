import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

import { PopoverService } from '../../../services/popover/popover.service';

/**
 * Slider to vote.
 */
@Component({
  selector: 'app-vote-slider',
  templateUrl: './vote-slider.component.html'
})
export class VoteSliderComponent implements OnDestroy {

  startValue = 100;
  step = 1;
  min = 0;
  max = 100;
  thumbLabel = false;
  showTicks = false;
  autoTicks = false;
  // tickInterval = 25;
  value = this.startValue;

  @Output()
  eventValue = new EventEmitter<number>();

  @Input()
  set popover(popover: NgbPopover) {
    this.popOverService.setPopOver(popover);
  }

  constructor(private popOverService: PopoverService) { }

  close() {
    this.popOverService.close();
  }

  vote() {
    this.eventValue.emit(this.value);
    this.close();
  }

  ngOnDestroy(): void {
    this.popOverService.close();
  }

}
