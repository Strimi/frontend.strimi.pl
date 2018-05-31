export interface UserStrimiResponse {
  id: number;
  result: Array<UserStrimi>;
}

export interface UserStrimi {
  id: number;
  name: string;
  owner: Owner;
  active: Active;
  posting: Posting;
  memo_key: string;
  json_metadata: UserJsonMetadata;
  proxy: string;
  last_owner_update: Date;
  last_account_update: Date;
  created: Date;
  mined: boolean;
  owner_challenged: boolean;
  active_challenged: boolean;
  last_owner_proved: Date;
  last_active_proved: Date;
  recovery_account: string;
  last_account_recovery: Date;
  reset_account: null;
  comment_count: number;
  lifetime_vote_count: number;
  post_count: number;
  can_vote: true;
  voting_power: number;
  last_vote_time: Date;
  balance: string;
  savings_balance: string;
  sbd_balance: string;
  sbd_seconds: number;
  sbd_seconds_last_update: Date;
  sbd_last_interest_payment: Date;
  savings_sbd_balance: string;
  savings_sbd_seconds: number;
  savings_sbd_seconds_last_update: Date;
  savings_sbd_last_interest_payment: Date;
  savings_withdraw_requests: number;
  reward_sbd_balance: string;
  reward_steem_balance: string;
  reward_vesting_balance: string;
  reward_vesting_steem: string;
  vesting_shares: string;
  delegated_vesting_shares: string;
  received_vesting_shares: string;
  vesting_withdraw_rate: string;
  next_vesting_withdrawal: Date;
  withdrawn: number;
  to_withdraw: number;
  withdraw_routes: number;
  curation_rewards: number;
  posting_rewards: number;
  proxied_vsf_votes: Array<number>;
  witnesses_voted_for: number;
  average_bandwidth: string;
  lifetime_bandwidth: number;
  last_bandwidth_update: Date;
  average_market_bandwidth: number;
  lifetime_market_bandwidth: number;
  last_market_bandwidth_update: Date;
  last_post: Date;
  last_root_post: Date;
  vesting_balance: string;
  reputation: number;
  transfer_history: Array<[number, TransferHistory]>;
  market_history: Array<any>;
  post_history: Array<any>;
  vote_history: Array<any>;
  other_history: Array<any>;
  witness_votes: Array<string>;
  tags_usage: Array<any>;
  guest_bloggers: Array<any>;
  ranking: number; // added property to hold ranking from another enpoint
  voting_info: VotingInfo; // added to hold calculated information
}

interface Owner {
  weight_threshold: number;
  account_auths: Array<any>;
  key_auths: Array<any>;
}
interface Active {
  weight_threshold: number;
  account_auths: Array<any>;
  key_auths: Array<any>;
}
interface Posting {
  weight_threshold: number;
  account_auths: Array<any>;
  key_auths: Array<any>;
}
export interface UserJsonMetadata {
  profile: Profile;
}
export interface Profile {
  name?: string;
  about?: string;
  location?: string;
  website?: string;
  cover_image?: string;
  profile_image?: string;
}

export interface VotingInfo {
  voting_power?: number; // will be transfrom to & value
  vests?: number;
  steem_power?: number;
  vote_value?: number; // value in dollars
  acount_value?: number; // dollars
  delegated_sp?: number; // steem_power - delegated_sp === true Steem Power
  bandwidth_used?: number;
  bandwidth_allocated?: number;
  bandwidth_percent_used?: number;
  bandwidth_percent_remaining?: number;
}

export class TransferHistory {
  public trx_id: string;
  public block: number;
  public trx_in_block: number;
  public op_in_trx: number;
  public virtual_op: number;
  public timestamp: Date;
  public op: [string, AuthorReward | CurationReward | ClaimRewardBalance | TransferReward
    | FillOrder | DelegateVestingShares | AccountUpdate | AccountCreateWithDelegation | TransferToVesting | ReturnVestingDelegation ];
}

export interface AuthorReward {
  author: string;
  permlink: string;
  sbd_payout: string;
  steem_payout: string;
  vesting_payout: string;
}

export interface CurationReward {
  curator: string;
  reward: string;
  comment_author: string;
  comment_permlink: string;
}

export class ClaimRewardBalance {
  account: string;
  reward_steem: string;
  reward_sbd: string;
  reward_vests: string;
}

export class TransferReward {
  from: string;
  to: string;
  amount: string;
  memo: string;
}

// fill_order -- Zamienił/Zapłacaił -- giedła, market
export class FillOrder {
  current_owner: string;
  current_orderid: number;
  current_pays: string;
  open_owner: string;
  open_orderid: number;
  open_pays: string;
}

// delegate_vesting_shares -- Delegacja SteemPower
export class DelegateVestingShares {
  delegator: string;
  delegatee: string;
  vesting_shares: string; // "510582.200000 VESTS" -- zamiana VESTS na SP
}

// account_update -- aktualizacja konta
export class AccountUpdate {
  account: string;
  json_metadata: string; // standardowo
}

// account_create_with_delegation -- utowrzenie nowego konta
export class AccountCreateWithDelegation {
  fee: string; // steem
  delegation: string; // zamiana VESTS na SP
  creator: string;
  new_account_name: string;
}

// transfer_to_vesting -- zwiększono steem power
export class TransferToVesting {
  from: string;
  to: string;
  amount: string; // steem
}

// return_vesting_delegation - zwort delegacji
export class ReturnVestingDelegation {
  account: string;
  vesting_shares: string;
}
