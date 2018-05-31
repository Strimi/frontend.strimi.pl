import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import * as steem from 'steem';
import {CommonContent, LoggedData, UserStrimi} from '../../../../shared';
import {AuthService} from '../../../../shared/services/auth/auth.service';
import {TransfersService} from '../../../../shared/services/transfers.service';
import {UserStrimiService} from '../../../../shared/services/user-strimi.service';
import {Constants} from '../../../../shared/settings';

@Component({
  selector: 'app-user-transfers',
  templateUrl: './user-transfers.component.html',
  providers: [TransfersService]
})
export class UserTransfersComponent extends CommonContent implements OnInit {

  user: UserStrimi;
  constants = Constants;
  userName: string;
  userLogged: LoggedData;

  reward_steem_balance;
  reward_sbd_balance;
  reward_vesting_balance; // is converted to SP

  errorReward = false;
  rewardSpinner = false;

  constructor(private userService: UserStrimiService, private route: ActivatedRoute,
              public transferService: TransfersService, private authService: AuthService) {
    super();
  }

  ngOnInit() {
    this.route.parent.params.subscribe((params: Params) => {
      const authorName = params['authorName'].replace('@', '');
      this.userName = authorName;
      this.userService.getUser(authorName).subscribe(user => {
        this.reward_steem_balance = user.reward_steem_balance;
        this.reward_sbd_balance = user.reward_sbd_balance;
        this.transferService.convertVestToSteemPower(user.reward_vesting_balance).then(res => {
          this.reward_vesting_balance = res;
        });
        this.user = user;
      });
      this.getData(this.transferService.getTransfers(authorName));
    });
    this.authService.isLogged().subscribe(userLogged => {
      this.userLogged = userLogged;
    });
  }


  nextRewards() {
    this.getNext(this.transferService.getNextTransfers());
  }

  getRewards() {
    this.rewardSpinner = true;
    this.errorReward = false;
    steem.broadcast.claimRewardBalanceAsync(
      this.userLogged.loginData.pass,
      this.userLogged.loginData.login,
      this.user.reward_steem_balance,
      this.user.reward_sbd_balance,
      this.user.reward_vesting_balance
    ).then(result => {
      this.rewardSpinner = false;
      this.ngOnInit();
    }, err => {
      this.errorReward = true;
      this.rewardSpinner = false;

    });
  }

  showRewards(): boolean {
    return this.showSteemBalance() || this.showSbdBalance() || this.showVestingBalance();
  }

  showSteemBalance() {
    return parseFloat(this.reward_steem_balance.replace(' SBD', '')) > 0;
  }

  showSbdBalance() {
    return parseFloat(this.reward_sbd_balance.replace(' STEEM', '')) > 0;
  }

  showVestingBalance() {
    return parseFloat(this.reward_vesting_balance) > 0;
  }
}
