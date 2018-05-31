import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Constants } from '../../../settings/settings';
import { SortModel } from '../../../index';


/**
 * Used to switched sort param for posts.
 */
@Component({
  selector: 'app-sort-header',
  templateUrl: './sort-header.component.html',
  styles: [`.test {color: red;}`]
})
export class SortHeaderComponent implements OnInit {

  sortModel = new SortModel();

  @Output()
  eventSortParam = new EventEmitter<SortModel>();

  orderSort = [
    { label: 'content_sorting.new', value: null },
    { label: 'content_sorting.popular', value: Constants.POPULAR },
    { label: 'content_sorting.commented', value: Constants.DISCUSSED }

  ];

  timeSort = [
    { label: '3H', value: Constants.THREE_H },
    { label: '6H', value: Constants.SIX_H },
    { label: '12H', value: Constants.TWELVE_H },
    { label: '24H', value: Constants.TWENTY_FOUR_H },
  ];

  ngOnInit() {
  }

  onOrderSort(val) {
    this.sortModel.selectedOrder = val;
    this.emitParams();
  }

  onTimeSort(val) {
    if (this.sortModel.selectedTime === val) {
      this.sortModel.selectedTime = null;
    } else {
      this.sortModel.selectedTime = val;
    }
    this.emitParams();
  }

  emitParams() {
    this.eventSortParam.emit(this.sortModel);
  }

}
