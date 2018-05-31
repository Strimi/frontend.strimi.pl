export interface CurrentMedianaHistoryPriceResponse {
  id: number;
  result: CurrentMedianaHistoryPrice;
}

export interface CurrentMedianaHistoryPrice {
  base: string;
  quote: string;
}
