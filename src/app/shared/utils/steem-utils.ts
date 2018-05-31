import * as steem from 'steem';

import {DynamicGlobalProp} from '../models';
import {UserStrimi, VotingInfo} from '../models';
import {PayoutDetails} from '../models';

/**
 * Calculates Payout Details Modified as needed
 * https://github.com/steemit/steemit.com/blob/47fd0e0846bd8c7c941ee4f95d5f971d3dc3981d/app/components/elements/Voting.jsx
 */
export const calculatePayout = (post): PayoutDetails => {
  const payoutDetails = new PayoutDetails();
  const { upvotes, downvotes, parent_author, cashout_time } = post;

  const max_payout = parsePayoutAmount(post.max_accepted_payout);
  const pending_payout = parsePayoutAmount(post.pending_payout_value);
  const promoted = parsePayoutAmount(post.promoted);
  const total_author_payout = parsePayoutAmount(post.total_payout_value);
  const total_curator_payout = parsePayoutAmount(post.curator_payout_value);
  const is_comment = parent_author !== '';

  let payout = pending_payout + total_author_payout + total_curator_payout;
  if (payout < 0.0) { payout = 0.0; }
  if (payout > max_payout) { payout = max_payout; }
  payoutDetails.payoutLimitHit = payout >= max_payout;

  // There is an "active cashout" if: (a) there is a pending payout, OR (b)
  // there is a valid cashout_time AND it's NOT a comment with 0 votes.
  const cashout_active =
    pending_payout > 0 ||
    (cashout_time.indexOf('1969') !== 0 && !(is_comment && (upvotes + downvotes) === 0));

  if (cashout_active) {
    payoutDetails.potentialPayout = pending_payout;
  }

  if (promoted > 0) {
    payoutDetails.promotionCost = promoted;
  }

  if (cashout_active) {
    // Append ".000Z" to make it ISO format (YYYY-MM-DDTHH:mm:ss.sssZ).
    payoutDetails.cashoutInTime = cashout_time + '.000Z';
  }

  if (max_payout === 0) {
    payoutDetails.isPayoutDeclined = true;
  } else if (max_payout < 1000000) {
    payoutDetails.maxAcceptedPayout = max_payout;
  }

  if (total_author_payout > 0) {
    payoutDetails.pastPayouts = total_author_payout + total_curator_payout;
    payoutDetails.authorPayouts = total_author_payout;
    payoutDetails.curatorPayouts = total_curator_payout;
  }

  return payoutDetails;
};

/**
* https://github.com/steemit/steemit.com/blob/47fd0e0846bd8c7c941ee4f95d5f971d3dc3981d/app/utils/ParsersAndFormatters.js
*/

export const parsePayoutAmount = (amount): number => {
  return parseFloat(String(amount).replace(/\s[A-Z]*$/, ''));
};

// count voting power
export const calculateVotingPower = (user: UserStrimi): number => {
  const secondsago = (new Date().getTime() - new Date(user.last_vote_time + 'Z').getTime()) / 1000;
  const result = Math.min(10000, user.voting_power + 10000 * secondsago / 432000);
  return result;
};

export const vestToSteem = (vests: number, total_vesting_shares: string, total_vesting_fund_steem: string) => {
  return steem.formatter.vestToSteem(vests, parseFloat(total_vesting_shares), parseFloat(total_vesting_fund_steem));
};

export const calculateTotalDelegatedSP = (user, totalVestingShares, totalVestingFundSteem) => {
  const receivedSP = parseFloat(
    steem.formatter.vestToSteem(user.received_vesting_shares, totalVestingShares, totalVestingFundSteem),
  );
  const delegatedSP = parseFloat(
    steem.formatter.vestToSteem(user.delegated_vesting_shares, totalVestingShares, totalVestingFundSteem),
  );
  return receivedSP - delegatedSP;
};

export const calculateBandwith = (user: UserStrimi, props: DynamicGlobalProp, votingInfo: VotingInfo) => {

  const STEEMIT_BANDWIDTH_AVERAGE_WINDOW_SECONDS = 60 * 60 * 24 * 7;
  const vestingShares = parseFloat(user.vesting_shares.replace(' VESTS', ''));
  const receivedVestingShares = parseFloat(user.received_vesting_shares.replace(' VESTS', ''));
  const totalVestingShares = parseFloat(props.total_vesting_shares.replace(' VESTS', ''));
  const max_virtual_bandwidth = parseInt(props.max_virtual_bandwidth, 10);
  const average_bandwidth = parseInt(user.average_bandwidth, 10);

  const delta_time = (new Date().getTime() - new Date(user.last_bandwidth_update + 'Z').getTime()) / 1000;

  let bandwidthAllocated = (max_virtual_bandwidth * (vestingShares + receivedVestingShares) / totalVestingShares);
  bandwidthAllocated = Math.round(bandwidthAllocated / 1000000);

  let new_bandwidth = 0;
  if (delta_time < STEEMIT_BANDWIDTH_AVERAGE_WINDOW_SECONDS) {
    new_bandwidth = (((STEEMIT_BANDWIDTH_AVERAGE_WINDOW_SECONDS - delta_time) * average_bandwidth)
      / STEEMIT_BANDWIDTH_AVERAGE_WINDOW_SECONDS);
  }
  new_bandwidth = Math.round(new_bandwidth / 1000000);

  votingInfo.bandwidth_used = Number((new_bandwidth / 1024).toFixed(2)); // to kilobytes

  votingInfo.bandwidth_allocated = Number((bandwidthAllocated / 1048576).toFixed(2)); // to megabytes

  const precentUsed = (100 * new_bandwidth / bandwidthAllocated).toFixed(2);
  votingInfo.bandwidth_percent_used = Number(precentUsed);

  const precentRemaining = (100 - (100 * new_bandwidth / bandwidthAllocated)).toFixed(2);
  votingInfo.bandwidth_percent_remaining = Number(precentRemaining);

  return votingInfo;
};

export const vestingSteem = (account, gprops) => {
  const vests = parseFloat(account.vesting_shares.split(' ')[0]);
  const total_vests = parseFloat(gprops.total_vesting_shares.split(' ')[0]);
  const total_vest_steem = parseFloat(
    gprops.total_vesting_fund_steem.split(' ')[0]
  );
  const vesting_steemf = total_vest_steem * (vests / total_vests);
  return vesting_steemf;
};

export const processOrders = (open_orders, assetPrecision) => {
  const sbdOrders = !open_orders
    ? 0
    : open_orders.reduce((o, order) => {
      if (order.sell_price.base.indexOf('SBD') !== -1) {
        o += order.for_sale;
      }
      return o;
    }, 0) / assetPrecision;

  const steemOrders = !open_orders
    ? 0
    : open_orders.reduce((o, order) => {
      if (order.sell_price.base.indexOf('STEEM') !== -1) {
        o += order.for_sale;
      }
      return o;
    }, 0) / assetPrecision;

  return { steemOrders, sbdOrders };
};


export const calculateSaving = (savings_withdraws) => {
  let savings_pending = 0;
  let savings_sbd_pending = 0;
  savings_withdraws.forEach(withdraw => {
    const [amount, asset] = withdraw.amount.split(' ');
    if (asset === 'STEEM') {
      savings_pending += parseFloat(amount);
    } else {
      if (asset === 'SBD') {
        savings_sbd_pending += parseFloat(amount);
      }
    }
  });
  return { savings_pending, savings_sbd_pending };
};
