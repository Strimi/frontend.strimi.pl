import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

/**
 * Button with spinner, disable and message.
 * Used to fertch next data from api.
 */
@Component({
  selector: 'app-button-next',
  templateUrl: './button-next.component.html'
})
export class ButtonNextComponent {

  @Input()
  disabled: boolean;

  @Output()
  clickButton = new EventEmitter<void>();

  @Input()
  showSpinner: boolean;

  @Input()
  message = 'no_content.default';

  next(): void {
    this.clickButton.emit();
  }
}
