import { Component, OnInit, Input } from '@angular/core';
import { AuthorReward } from '../../../index';

/**
 * It used to shows transfer in user profile
 */
@Component({
  selector: 'app-author-reward',
  templateUrl: './author-reward.component.html',
  styles: []
})
export class AuthorRewardComponent implements OnInit {

  @Input()
  authorReward: AuthorReward;

  @Input()
  timestamp: Date;

  constructor() { }

  ngOnInit() {
  }

}
