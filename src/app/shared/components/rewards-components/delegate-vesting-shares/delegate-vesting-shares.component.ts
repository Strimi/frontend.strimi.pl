import { Component, OnInit, Input } from '@angular/core';
import { DelegateVestingShares } from '../../../index';

@Component({
  selector: 'app-delegate-vesting-shares',
  templateUrl: './delegate-vesting-shares.component.html',
  styles: []
})
export class DelegateVestingSharesComponent implements OnInit {

  @Input()
  delegateVesting: DelegateVestingShares;
  @Input()
  timestamp: Date;

  constructor() { }

  ngOnInit() {
  }

}
