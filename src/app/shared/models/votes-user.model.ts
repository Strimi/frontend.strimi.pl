import { PostResult } from '..';

export interface VotesStrimiResponse {
  id: number;
  result: Array<VotesUser>;
}

export interface VotesUser {
  authorperm: string;
  weight: number;
  rshares: number;
  percent: number;
  time: Date;
}

