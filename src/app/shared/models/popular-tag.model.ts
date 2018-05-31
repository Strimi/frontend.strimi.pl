export interface PopularTag {
  name: string;
  total_payouts: string;
  net_votes: number;
  top_posts: number;
  comments: number;
  trending: string;
}

export interface PopularTagResponse {
  id: number;
  result: Array<PopularTag>;
}
