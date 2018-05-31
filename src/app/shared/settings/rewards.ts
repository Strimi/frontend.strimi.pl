export const PAYOUT_TYPE: Array<PayoutType> = [
  { label: 'post-new.text.payout.50', type: 'default', value: '1000000.000 SBD, 10000' },
  { label: 'post-new.text.payout.100', type: 'steem_power', value: '1000000.000 SBD, 0' },
  { label: 'post-new.text.payout.resignation', type: 'decline', value: '0.000 SBD, 10000' }
];

export interface PayoutType {
  label: string;
  type: string;
  value: string;
}

