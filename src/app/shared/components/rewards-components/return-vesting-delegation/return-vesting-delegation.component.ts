import { Component, OnInit, Input } from '@angular/core';
import { ReturnVestingDelegation } from '../../../index';

@Component({
  selector: 'app-return-vesting-delegation',
  templateUrl: './return-vesting-delegation.component.html',
  styles: []
})

export class ReturnVestingDelegationComponent implements OnInit {

  @Input()
  returnVestingDelegation: ReturnVestingDelegation;
  @Input()
  timestamp: Date;

  constructor() { }

  ngOnInit() {
  }

}

