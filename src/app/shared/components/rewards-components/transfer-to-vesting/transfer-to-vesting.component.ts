import { Component, Input, OnInit } from '@angular/core';

import { TransferToVesting } from '../../..';

@Component({
  selector: 'app-transfer-to-vesting',
  templateUrl: './transfer-to-vesting.component.html',
  styles: []
})
export class TransferToVestingComponent implements OnInit {

  @Input()
  transferVesting: TransferToVesting;
  @Input()
  timestamp: Date;

  constructor() { }

  ngOnInit() {
  }

}
