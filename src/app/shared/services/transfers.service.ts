import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import * as moment from 'moment';
import {Observable} from 'rxjs/Observable';
import * as steem from 'steem';
import {
  AccountCreateWithDelegation,
  AuthorReward,
  ClaimRewardBalance,
  Constants,
  CurationReward,
  DelegateVestingShares,
  DynamicGlobalProp,
  TransferHistory
} from '..';
import * as steemUtils from './../utils/steem-utils';
import {StrimiApiService} from './strimi-api.service';

/**
 * Service to fetch transfers
 */
@Injectable()
export class TransfersService extends StrimiApiService {

  allTransfers = new Array<TransferHistory>();

  constructor(private httpClient: HttpClient) {
    super(httpClient);

  }

  // get all transfers and store in allTransfers
  // return first part
  getTransfers(user: string): Observable<Array<TransferHistory>> {
    return this.initTransfers(user).mergeMap(transfers => {
      this.allTransfers = transfers;
      return Observable.of(this.allTransfers.splice(0, 35));
    });
  }

  // return next part of transfers
  // here is hack, it works under common logic created in CommonContent
  // where we have to always shift first element from next part of posts
  // because last post from first part and first from next part are the same
  // in api transfer this problem dosen;t exist.
  // TODO remove shift from CommonContent
  getNextTransfers(): Observable<Array<TransferHistory>> {
    const first = this.allTransfers[0];
    const arr = this.allTransfers.splice(0, 35);
    arr.unshift(first);
    return Observable.of(arr);
  }

  // get rewards and convert all VESTS to Steam Power
  initTransfers(user: string): Observable<Array<TransferHistory>> {
    return Observable.forkJoin([
      this.getAllTransfers(user),
      this.getDynamicGlobalProperties()
    ]).map((data: [any]) => {
      const rewards = data[0];
      const props = data[1];
      return this.convertVeestToSteemPower(rewards, props);
    });
  }

  // get first part rewards with limit
  private getAllTransfers(user: string): Observable<Array<TransferHistory>> {
    return this.getRewards(user)
      .map(res => {
        const arrTransfers = res.result.accounts[user].transfer_history.concat(res.result.accounts[user].other_history);
        const arr = arrTransfers.map(e => e[1]).filter(this.filterRewards).sort(this.descSort);
        return this.groupSame(arr);
      });
  }

  // group the same rewards in this same day
  private groupSame = ([...transfers]: Array<TransferHistory>) => {
    const grouped = new Array<TransferHistory>();
    grouped.push(transfers.shift());
    transfers.map((transfer, i) => {
      let lastGrouped = grouped[grouped.length - 1];
      if (this.isCurationRewardThisSameDay(transfer, lastGrouped)) {
        lastGrouped = this.groupCurationReward(transfer, lastGrouped);
      } else if (this.isCurationRewardBalanceThisSameDay(transfer, lastGrouped)) {
        lastGrouped = this.groupCurationRewardBalance(transfer, lastGrouped);
      } else {
        grouped.push(transfer);
      }
    });
    return grouped;
  };

  // chceck it is posible to add one transfer to anotehr. Condition: this same transfer type and transfer from this same day
  isCurationRewardThisSameDay(transfer: TransferHistory, lastGrouped: TransferHistory): boolean {
    return transfer.op[0] === Constants.CURATION_REWARD
      && lastGrouped.op[0] === Constants.CURATION_REWARD
      && moment(transfer.timestamp).diff(lastGrouped.timestamp, 'days') === 0;
  }

  // add rewards from one transfer to other
  groupCurationReward(transfer: TransferHistory, lastGrouped: TransferHistory) {
    const prevTransfer = (<TransferHistory>lastGrouped);
    const prevReward = (<CurationReward>prevTransfer.op[1]).reward.replace('VESTS', '');
    const currentReward = (<CurationReward>transfer.op[1]).reward.replace('VESTS', '');
    const rewardString = parseFloat(prevReward) + parseFloat(currentReward);
    (<CurationReward>prevTransfer.op[1]).reward = rewardString + ' VESTS';
    return prevTransfer;
  }

  // chceck it is posible to add one transfer to anotehr. Condition: this same transfer type and transfer from this same day
  isCurationRewardBalanceThisSameDay(transfer: TransferHistory, lastGrouped: TransferHistory): boolean {
    return transfer.op[0] === Constants.CLAIM_REWARD_BALANCE
      && Constants.CLAIM_REWARD_BALANCE === lastGrouped.op[0]
      && moment(transfer.timestamp).diff(lastGrouped.timestamp, 'days') === 0;
  }

  // add rewards from one transfer to other
  groupCurationRewardBalance(transfer: TransferHistory, lastGrouped: TransferHistory) {
    const prevTransfer = (<TransferHistory>lastGrouped);
    const prevSbd = (<ClaimRewardBalance>prevTransfer.op[1]).reward_sbd.replace('SBD', '');
    const prevVests = (<ClaimRewardBalance>prevTransfer.op[1]).reward_vests;

    const currentSbd = (<ClaimRewardBalance>transfer.op[1]).reward_sbd.replace('SBD', '');
    const currentVests = (<ClaimRewardBalance>transfer.op[1]).reward_vests;

    const sumSbd = parseFloat(prevSbd) + parseFloat(currentSbd);
    const sumVests = parseFloat(prevVests) + parseFloat(currentVests);
    (<ClaimRewardBalance>prevTransfer.op[1]).reward_sbd = sumSbd + ' SBD';
    (<ClaimRewardBalance>prevTransfer.op[1]).reward_vests = sumVests + '';
    return prevTransfer;
  }

  private descSort = (a: TransferHistory, b: TransferHistory): number => {
    // tslint:disable-next-line:curly
    if (a.timestamp.valueOf() > b.timestamp.valueOf()) return -1;
    // tslint:disable-next-line:curly
    if (a.timestamp.valueOf() < b.timestamp.valueOf()) return 1;
    return 0;
  };

  // take from transfer only what we need
  private filterRewards = (e: TransferHistory): boolean => {
    const rewardType = e.op[0];
    const result = rewardType === Constants.AUTHOR_REWARD
      || rewardType === Constants.CURATION_REWARD
      || rewardType === Constants.TRANSFER
      || rewardType === Constants.CLAIM_REWARD_BALANCE
      || rewardType === Constants.FILL_ORDER
      || rewardType === Constants.DELEGATE_VESTING_SHARES
      || rewardType === Constants.ACCOUNT_CREATEA_WITH_DELEGATION
      || rewardType === Constants.TRANSFER_TO_VESTING;
    return result;
  };

  // In some transfers we have to change VESTS to Steam Power
  private convertVeestToSteemPower(arr: Array<TransferHistory>, props: DynamicGlobalProp): Array<TransferHistory> {
    return arr.map(e => {
      if (e.op[0] === Constants.AUTHOR_REWARD) {
        const reward = (<AuthorReward>e.op[1]);
        reward.vesting_payout = this.convertVestToSP(reward.vesting_payout, props);
      } else if (e.op[0] === Constants.CLAIM_REWARD_BALANCE) {
        const reward = (<ClaimRewardBalance>e.op[1]);
        reward.reward_vests = this.convertVestToSP(reward.reward_vests, props);
      } else if (e.op[0] === Constants.CURATION_REWARD) {
        const reward = (<CurationReward>e.op[1]);
        reward.reward = this.convertVestToSP(reward.reward, props);
      } else if (e.op[0] === Constants.DELEGATE_VESTING_SHARES) {
        const reward = (<DelegateVestingShares>e.op[1]);
        reward.vesting_shares = this.convertVestToSP(reward.vesting_shares, props);
      } else if (e.op[0] === Constants.ACCOUNT_CREATEA_WITH_DELEGATION) {
        const reward = (<AccountCreateWithDelegation>e.op[1]);
        reward.delegation = this.convertVestToSP(reward.delegation, props);
      }
      return e;
    });
  }

  convertVestToSP(vests: string, props: DynamicGlobalProp) {
    const ves = vests.split(' ')[0]; // example 222.4484 VESTS
    return steemUtils.vestToSteem(parseFloat(ves), props.total_vesting_shares, props.total_vesting_fund_steem).toFixed(3);
  }

  async convertVestToSteemPower(vests: string) {
    const props = await steem.api.getDynamicGlobalPropertiesAsync();
    const ves = vests.split(' ')[0];
    return steemUtils.vestToSteem(parseFloat(ves), props.total_vesting_shares, props.total_vesting_fund_steem).toFixed(3);
  }

}
