import { UserStrimi } from './user-strimi.model';

export interface FollowUser {
  follower: string;
  following: string;
  what: Array<string>;
  user: UserStrimi;
}

export interface FollowStats {
  account: string;
  follower_count: number;
  following_count: number;
}
