import { Component, OnInit, Input } from '@angular/core';
import { ClaimRewardBalance } from '../../../index';

/**
 * It used to shows transfer in user profile
 */
@Component({
  selector: 'app-claim-reward-balance',
  templateUrl: './claim-reward-balance.component.html',
  styles: []
})
export class ClaimRewardBalanceComponent implements OnInit {

  @Input()
  claimReward: ClaimRewardBalance;
  @Input()
  timestamp: Date;

  constructor() { }

  ngOnInit() {
  }

}
