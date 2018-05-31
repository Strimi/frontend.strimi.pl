import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';


/**
 * Input to emit each char
 */
@Component({
  selector: 'app-serach-input',
  templateUrl: './serach-input.component.html',
  styles: []
})
export class SerachInputComponent {

  value = '';

  @Output()
  private newValue = new EventEmitter();

  clear() {
    this.valueChange('');
  }

  valueChange(val) {
    this.value = val;
    this.newValue.emit(val);
  }

}
