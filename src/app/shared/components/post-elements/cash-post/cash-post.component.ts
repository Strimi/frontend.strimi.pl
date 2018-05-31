import { Component, OnInit, Input } from '@angular/core';
import { PayoutDetails, PostResult, calculatePayout } from '../../../index';
import * as moment from 'moment';
import { AuthService } from '../../../services/auth/auth.service';

/**
 * Shows information about payment with tooltip
 **/
@Component({
  selector: 'app-cash-post',
  templateUrl: './cash-post.component.html'
})
export class CashPostComponent implements OnInit {

  @Input()
  post: PostResult;
  @Input()
  classCash: string;

  payout: PayoutDetails;

  constructor(private authService: AuthService) {

  }

  ngOnInit() {
    this.payout = calculatePayout(this.post);
    this.authService.getVotedPost().subscribe(postVoted => {
      if (postVoted && this.post && this.post.id === postVoted.id) {
        this.payout = calculatePayout(postVoted);
      }
    });
  }

  private formatDate(date) {
    return moment.utc(date).local().fromNow();
  }

  getTranslate(time: string): string {
    return new Date(time).valueOf() < new Date().valueOf() ? 'payment.released' : 'payment.release';
  }
}
