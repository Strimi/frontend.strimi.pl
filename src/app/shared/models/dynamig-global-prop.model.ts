export interface DynamiGlobaPropResponse {
  id: number;
  result: DynamicGlobalProp;
}

export interface DynamicGlobalProp {
  id: number;
  head_block_number: number;
  head_block_id: string;
  time: Date;
  current_witness: string;
  total_pow: 514415;
  num_pow_witnesses: 172;
  virtual_supply: string;
  current_supply: string;
  confidential_supply: string;
  current_sbd_supply: string;
  confidential_sbd_supply: string;
  total_vesting_fund_steem: string;
  total_vesting_shares: string;
  total_reward_fund_steem: string;
  total_reward_shares2: number;
  pending_rewarded_vesting_shares: string;
  pending_rewarded_vesting_steem: string;
  sbd_interest_rate: number;
  sbd_print_rate: number;
  maximum_block_size: number;
  current_aslot: number;
  recent_slots_filled: string;
  participation_count: number;
  last_irreversible_block_num: number;
  vote_power_reserve_rate: number;
  current_reserve_ratio: number;
  average_block_size: number;
  max_virtual_bandwidth: string;
}
