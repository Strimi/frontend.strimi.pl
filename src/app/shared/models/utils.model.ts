export class PayoutDetails {
  payoutLimitHit: boolean;
  potentialPayout: number; // potencjalna wypłata
  promotionCost: number;
  cashoutInTime: string;
  isPayoutDeclined: true;
  maxAcceptedPayout: number;
  pastPayouts = 0; // wczeniejsze wypłaty
  authorPayouts = 0; // autor
  curatorPayouts = 0; // kuratorzy
}

export class SortModel {
  constructor(public selectedOrder: string = null,
    public selectedTime: string = null) { }
}
