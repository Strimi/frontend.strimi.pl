import { Component, OnInit, Input } from '@angular/core';
import { TransferReward } from '../../../index';

/**
 * It used to shows transfer in user profile
 */
@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styles: []
})
export class TransferComponent implements OnInit {

  @Input()
  transfer: TransferReward;
  @Input()
  timestamp: Date;

  constructor() { }

  ngOnInit() {
  }

}
