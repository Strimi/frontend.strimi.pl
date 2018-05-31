export interface PostsData {
  all: number;
  result: Array<PostResult>;
}

export interface PostDataDetails {
  id: number;
  result: PostResult;
}

export interface PostResult {
  abs_rshares: number;
  active: string;
  active_votes: Array<ActiveVotes>; // usualy is empty because optimalization
  allow_curation_rewards: string;
  allow_replies: string;
  allow_votes: string;
  author: string;
  author_reputation: string;
  author_rewards: number;
  beneficiaries: Array<Beneficiaries>;
  body: string;
  body_length: number;
  cashout_time: Date;
  category: string;
  children: number;
  children_abs_rshares: number;
  created: Date;
  curator_payout_value: string;
  depth: number;
  first_reblogged_on: Date;
  id: number;
  is_banned_content: boolean;
  is_banned_author: boolean;
  json_metadata: JsonMetadata;
  last_payout: Date;
  last_update: Date;
  max_accepted_payout: string;
  max_cashout_time: Date;
  net_rshares: number;
  net_votes: number;
  parent_author: string;
  parent_permlink: string;
  pending_payout_value: string;
  percent_steem_dollars: number;
  permlink: string;
  promoted: string;
  reblogged_by: Array<any>;
  replies: Array<any>;
  reward_weight: number;
  root_comment: number;
  root_title: string;
  title: string;
  total_payout_value: string;
  total_pending_payout_value: string;
  total_vote_weight: number;
  url: string;
  vote_rshares: number;
  comments: Array<PostResult>; // added prop to hold all comments
  upvotes: number; // added for us to count votes
  downvotes: number; // added for us to count votes
  isVoted: boolean; // added  for keep info about voting
}

export interface ActiveVotes {
  voter: string;
  weight: number;
  rshares: number;
  percent: number;
  reputation: number;
  time: Date;
  value_dollar: number; // added to hodl information about $$$$$
}

export interface Beneficiaries {
  account: string;
  weight: 1500;
}

export interface JsonMetadata {
  app: string;
  format: string;
  strimi_metadata: StrimiMetadata;
  tags: Array<string>;
  image: Array<string>;
  links: Array<string>;
}

export interface StrimiMetadata {
  id: string;
  type: Type;
  thumb: string;
  domain: string;
  source: string;
  title: string;
  body: string;
  video: string;
}

export interface Type {
  height: number;
  width: number;
  size: number;
  type: string;
  type_from: string;
}
