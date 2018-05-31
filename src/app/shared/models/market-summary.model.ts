export interface MarketResponse {
  exchange_type: string;
  data: MarketData;
}

export interface MarketData {
  id: string;
  name: string;
  symbol: string;
  price_usd: string;
  price_btc: string;
  price_eur: string;
  price_pln: string;
}

export class ExchangePrice {
  constructor(public id: number, public name: string, public price: string) { }
}
