import { Component, OnInit, Input } from '@angular/core';
import { CurationReward } from '../../../index';

/**
 * It used to shows transfer in user profile
 */
@Component({
  selector: 'app-curation-reward',
  templateUrl: './curation-reward.component.html',
  styles: []
})
export class CurationRewardComponent implements OnInit {

  @Input()
  curationReward: CurationReward;

  @Input()
  timestamp: Date;


  constructor() { }

  ngOnInit() {
  }

}
