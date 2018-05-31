import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/mergeMapTo';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/toArray';

import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import get from 'lodash/get';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import * as steem from 'steem';

import {
  AccountCreateWithDelegation,
  CurrentMedianaHistoryPrice,
  DelegateVestingShares,
  PostResult,
  RewardFund,
  TransferHistory,
  VotingInfo
} from '..';
import {
  ActiveVotes,
  AuthorReward,
  ClaimRewardBalance,
  CurationReward,
  DynamicGlobalProp,
  ExchangePrice,
  FollowUser,
  UserStrimi,
  VotesUser
} from '../models';
import {Constants} from '../settings';
import * as steemUtils from './../utils/steem-utils';
import {StrimiApiService} from './strimi-api.service';

/**
 * Fetch date about user
 */
@Injectable()
export class UserStrimiService extends StrimiApiService {


  currencyRates = new BehaviorSubject<Array<ExchangePrice>>([]);

  constructor(private router: Router, private httpClient: HttpClient) {
    super(httpClient);
    this.getExchangeCurrency();
  }


  // User with ranking and voting power
  // Get userName or user
  getUser(userName?: string, user?: UserStrimi): Observable<UserStrimi> {
    return Observable.forkJoin([
      userName ? this.getUserStrimi(userName) : Observable.of(user),
      this.getUserRankingNum(userName),
      this.getDynamicGlobalProperties(),
      this.getRewardFund(),
      this.getCurrentMedianaHistoryPrice(),
    ]).map((data: [any]) => {
      const userStrimi: UserStrimi = data[0];
      const ranking = data[1];
      const globaProp = data[2];
      const rewardFund = data[3];
      const currentMediana = data[4];
      userStrimi.ranking = ranking;
      userStrimi.voting_info = this.calculateVoteWorth(userStrimi, globaProp, rewardFund, currentMediana);
      return userStrimi;
    });
  }

  // calculate for active_votes value in $$$
  calculateActiveVotes(post: PostResult): Observable<Array<ActiveVotes>> {
    const totalPayout =
      parseFloat(post.pending_payout_value) +
      parseFloat(post.total_payout_value) +
      parseFloat(post.curator_payout_value);
    return this.getActiveVotes(post.author, post.permlink).map((res: Array<ActiveVotes>) => {
      const voteRshares = res.reduce((a, b) => a + Number(b.rshares), 0);
      const ratio = totalPayout / voteRshares;
      return res.map(vote => {
        vote.value_dollar = vote.rshares * ratio;
        return vote;
      });
    });
  }

  // get user ranking
  getUserRankingNum(user: string): Observable<number> {
    return this.getUserRanking(user).map(res => {
      if (res.hits.hits.length > 0) {
        return res.hits.hits[0]._source.ranking; // possible there is now ranking
      }
    });
  }

  getUsersVotesSlice(user: string): Observable<Array<VotesUser>> {
    return this.getUsersVotes(user).map(res => {
      return res.sort(this.descSort).slice(0, 35);
    });
  }

  getNextUsersVotesSlice(user: string, authorperm: string): Observable<Array<VotesUser>> {
    return this.getUsersVotes(user)
      .map(res => {
        const arr = res.sort(this.descSort);
        const index = arr.findIndex(e => e.authorperm === authorperm);
        const ret = res.slice(index, index + 35);
        return ret;
      });
  }

  getUsersFollowingWithUsers(user: string): Observable<Array<FollowUser>> {
    return this.getUsersFollowing(user).map(this.mapFollowWithUser);
  }

  getNextUsersFollowingWithUsers(user: string, lastFollowing: string): Observable<Array<FollowUser>> {
    return this.getNextUsersFollowing(user, lastFollowing).map(this.mapFollowWithUser);
  }

  getUsersFollowersWithUsers(user: string): Observable<Array<FollowUser>> {
    return this.getUsersFollowers(user).map(this.mapFollowWithUser);
  }

  getNextUsersFollowersWithUsers(user: string, lastFollowing: string): Observable<Array<FollowUser>> {
    return this.getNextUsersFollowers(user, lastFollowing).map(this.mapFollowWithUser);
  }

  // all folowers representant by nick are mapped to full user
  private mapFollowWithUser = (followings: Array<FollowUser>) => {
    return followings.map(e => {
      this.getUserStrimi(e.following).subscribe(u => {
        u.reputation = steem.formatter.reputation(u.reputation);
        return e.user = u;
      });
      return e;
    });
  };


  private descSort = (a: VotesUser, b: VotesUser): number => {
    // tslint:disable-next-line:curly
    if (a.time > b.time) return -1;
    // tslint:disable-next-line:curly
    if (a.time < b.time) return 1;
    return 0;
  };


  // get rewards and convert all VESTS to Steam Power
  getRewardsWithSteamPower(user: string): Observable<Array<TransferHistory>> {
    return Observable.forkJoin([
      this.getRewardsWithLimit(user),
      this.getDynamicGlobalProperties()
    ]).map((data: [any]) => {
      const rewards = data[0];
      const props = data[1];
      return this.convertVeestToSteemPower(rewards, props);
    });
  }

  // get next rewards and convert all VESTS to Steam Power
  getNextRewardsWithSteamPower(user: string, block: number): Observable<Array<TransferHistory>> {
    return Observable.forkJoin([
      this.getNextRewards(user, block),
      this.getDynamicGlobalProperties()
    ]).map((data: [any]) => {
      const rewards = data[0];
      const props = data[1];
      return this.convertVeestToSteemPower(rewards, props);
    });
  }

  // get first part rewards with limit
  private getRewardsWithLimit(user: string): Observable<Array<TransferHistory>> {
    return this.getRewards(user)
      .map(res => {
        const arrTransfers = res.result.accounts[user].transfer_history
          .concat(res.result.accounts[user].other_history) as Array<[number, TransferHistory]>;
        const arr = arrTransfers
          .map(e => e[1])
          .reverse()
          .filter(this.filterRewards)
          .slice(0, 135);
        return arr;
      });
  }

  // get next rewards with limit
  private getNextRewards(user: string, block: number): Observable<Array<TransferHistory>> {
    return this.getRewards(user)
      .map(res => {
        const arrTransfers = res.result.accounts[user].transfer_history
          .concat(res.result.accounts[user].other_history) as Array<[number, TransferHistory]>;
        const arr = arrTransfers
          .map(e => e[1])
          .reverse()
          .filter(this.filterRewards);
        const index = arr.findIndex(e => e.block === block);
        return arr.slice(index, index + 35);
      });
  }

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

  // change VESTS to Steam Power
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

  // Called every 5 minutes. First time fired immediately
  getExchangeCurrency() {
    const fiveMinutes = 5 * 60 * 1000;
    Observable.interval(fiveMinutes).startWith(1).mergeMapTo(this.getCurrencyRates()).subscribe(res => {
      this.currencyRates.next(res);
    });
  }

  getCurrencyRates(): Observable<Array<ExchangePrice>> {
    return this.getExchangeRates().map(rates => {
      const prices = Array<ExchangePrice>();
      rates.forEach(e => {
        if (e.exchange_type === 'BTC_PLN') {
          prices.push(new ExchangePrice(1, 'BTC/USD', Number(e.data.price_usd).toFixed(2)));
          prices.push(new ExchangePrice(2, 'BTC/PLN', Number(e.data.price_pln).toFixed(2)));
        } else if (e.exchange_type === 'BTC_EUR') {
          prices.push(new ExchangePrice(3, 'BTC/EUR', Number(e.data.price_eur).toFixed(2)));
        } else if (e.exchange_type === 'SBD_BTC') {
          prices.push(new ExchangePrice(4, 'SBD/BTC', Number(e.data.price_btc).toFixed(8)));
          prices.push(new ExchangePrice(5, 'SBD/USD', Number(e.data.price_usd).toFixed(2)));
        } else if (e.exchange_type === 'SBD_PLN') {
          prices.push(new ExchangePrice(6, 'SBD/PLN', Number(e.data.price_pln).toFixed(2)));
        } else if (e.exchange_type === 'SBD_EUR') {
          prices.push(new ExchangePrice(7, 'SBD/EUR', Number(e.data.price_eur).toFixed(2)));
        } else if (e.exchange_type === 'STEEM_BTC') {
          prices.push(new ExchangePrice(8, 'STEEM/BTC', Number(e.data.price_btc).toFixed(8)));
          prices.push(new ExchangePrice(9, 'STEEM/USD', Number(e.data.price_usd).toFixed(2)));
        } else if (e.exchange_type === 'STEEM_PLN') {
          prices.push(new ExchangePrice(10, 'STEEM/PLN', Number(e.data.price_pln).toFixed(2)));
        } else if (e.exchange_type === 'STEEM_EUR') {
          prices.push(new ExchangePrice(11, 'STEEM/EUR', Number(e.data.price_eur).toFixed(2)));
        }
      });
      return prices.sort((a, b) => a.id - b.id);
    });
  }


  calculateVoteWorth = (user: UserStrimi, globaProp: DynamicGlobalProp,
                        rewardFund: RewardFund, currentMediana: CurrentMedianaHistoryPrice): VotingInfo => {

    let votingInfo: VotingInfo = {};

    this.estimateAccountValue(user).then(value => {
      votingInfo.acount_value = value;
    });

    const vestingSharesParts = user.vesting_shares.split(' ')[0];
    const receivedSharesParts = user.received_vesting_shares.split(' ')[0];
    const delegatedSharesParts = user.delegated_vesting_shares.split(' ')[0];

    const vests = (parseFloat(vestingSharesParts) + parseFloat(receivedSharesParts)) - (parseFloat(delegatedSharesParts));
    const votingPower = steemUtils.calculateVotingPower(user);

    const steemPower = steemUtils.vestToSteem(vests, globaProp.total_vesting_shares, globaProp.total_vesting_fund_steem);

    const delegate_sp = steemUtils.calculateTotalDelegatedSP(user, globaProp.total_vesting_shares, globaProp.total_vesting_fund_steem);

    let m = (100 * votingPower * (100 * 100) / 10000);
    m = (m + 49) / 50;

    const i = parseFloat(rewardFund.reward_balance.replace(' STEEM', '')) / parseFloat(rewardFund.recent_claims);

    const o = parseFloat(currentMediana.base.replace(' SBD', '')) / parseFloat(currentMediana.quote.replace(' STEEM', ''));

    const vestingFound = Number(globaProp.total_vesting_fund_steem.replace(' STEEM', ''));
    const vestingShares = Number(globaProp.total_vesting_shares.replace(' VESTS', ''));

    const a = vestingFound / vestingShares;
    const r = steemPower / a;
    let vote = r * m * 100 * i * o;
    vote = vote / 100;

    votingInfo.voting_power = votingPower;
    votingInfo.vests = vests;
    votingInfo.steem_power = steemPower;
    votingInfo.vote_value = vote;
    votingInfo.delegated_sp = delegate_sp;


    votingInfo = steemUtils.calculateBandwith(user, globaProp, votingInfo);
    return votingInfo;
  };

  public estimateAccountValue(account): Promise<any> {
    let gprops, feed_price, vesting_steem;
    const promises = [];
    const username = account.name;
    const assetPrecision = 1000;
    let orders, savings;

    promises.push(this.getStateAsync(username).toPromise());
    promises.push(this.getOpenOrders(username).toPromise());
    promises.push(this.getSavingsWithdrawFrom(username).toPromise());

    return Promise.all(promises).then(responses => {
      // state async
      gprops = responses[0].result.props;
      feed_price = responses[0].result.feed_price;
      vesting_steem = steemUtils.vestingSteem(account, gprops);

      // open orders
      orders = steemUtils.processOrders(responses[1].result, assetPrecision);
      // withdraws
      savings = steemUtils.calculateSaving(responses[2].result);


      let price_per_steem;
      const {base, quote} = feed_price;
      if (/ SBD$/.test(base) && / STEEM$/.test(quote)) {
        price_per_steem = parseFloat(base.split(' ')[0]);
      }
      const savings_balance = account.savings_balance;
      const savings_sbd_balance = account.savings_sbd_balance;
      const balance_steem = parseFloat(account.balance.split(' ')[0]);
      const saving_balance_steem = parseFloat(savings_balance.split(' ')[0]);
      const sbd_balance = parseFloat(account.sbd_balance);
      const sbd_balance_savings = parseFloat(savings_sbd_balance.split(' ')[0]);

      let conversionValue = 0;
      const currentTime = new Date().getTime();
      (account.other_history || []).reduce((out, item) => {
        if (get(item, [1, 'op', 0], '') !== 'convert') {
          return out;
        }

        const timestamp = new Date(get(item, [1, 'timestamp'])).getTime();
        const finishTime = timestamp + 86400000 * 3.5; // add 3.5day conversion delay
        if (finishTime < currentTime) {
          return out;
        }

        const amount = parseFloat(
          get(item, [1, 'op', 1, 'amount']).replace(' SBD', '')
        );
        conversionValue += amount;
      }, []);

      const total_sbd =
        sbd_balance +
        sbd_balance_savings +
        savings.savings_sbd_pending +
        orders.sbdOrders +
        conversionValue;

      const total_steem =
        vesting_steem +
        balance_steem +
        saving_balance_steem +
        savings.savings_pending +
        orders.steemOrders;

      return (total_steem * price_per_steem + total_sbd).toFixed(2);
    });
  }
}
