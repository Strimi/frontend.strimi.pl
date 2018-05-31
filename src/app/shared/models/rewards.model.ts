import { UserStrimi } from './user-strimi.model';
export interface RewardsResponse {
  id: number;
  result: Rewards;
}

export interface Accounts {
  [key: string]: UserStrimi;
}
// a lot of properties is not mapped
export interface Rewards {
  accounts: Accounts;
}
