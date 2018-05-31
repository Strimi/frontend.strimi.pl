export interface RewardFundResponse {
  id: number;
  result: RewardFund;
}

export interface RewardFund {
  id: number;
  name: string;
  reward_balance: string;
  recent_claims: string;
  last_update: string;
  content_constant: string;
  percent_curation_rewards: number;
  percent_content_rewards: number;
  author_reward_curve: string;
  curation_reward_curve: string;
}
