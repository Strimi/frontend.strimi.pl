export interface User {
  name: string;
  registrationTimestamp: number;
  lastActivityTimestamp: number;
  postCount: number;
  steemBalance: number;
  steemDolarBalance: number;
  followerCount: number;
  followingCount: number;
  reputation: number;
  steemPower: number;
  estimateAccountValue: number;
  upvoteWorth: number;
  id: number;
  avatar: string;
  ranking: number;
  lastUpdateTimestamp: number;
  nextUpdateTimestamp: number;
}
export interface UserElastic {
  hits: Hit;
}

export interface Hit {
  hits: Array<Hits>;
}

export interface Hits {
  _source: User;
}
