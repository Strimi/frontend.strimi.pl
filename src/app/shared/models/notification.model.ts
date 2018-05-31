export interface NotificationStrimi {
  code: number;
}

// to init ws service
export interface NotificationInit extends NotificationStrimi {
  username: string;
  tags: Array<string>;
}

export interface NotificationNewPost extends NotificationStrimi {
  tag: string;
  author: string;
  permlink: string;
  date: Date;
  category: string;
  body: string;
}

// code 2
export interface NotificationVoted extends NotificationStrimi {
  voter: string;
  permlink: string;
  date: Date;
  weight: number;
  author: string;
  category: string;
  title: string;
  root_title: string;
  url: string;
  body: string;
}

// code 4
export interface NotificationFollowed extends NotificationStrimi {
  follower: string;
  date: Date;
}

// code 6
export interface NotificationCommented extends NotificationStrimi {
  author: string;
  permlink: string;
  parent_permlink: string;
  parent_author: string;
  date: Date;
  body: string;
  url: string;
  category: string;
  title: string;
  depth: number;
}

// code 8
export interface NotificationTaggedComment extends NotificationStrimi {
  author: string;
  permlink: string;
  parent_permlink: string;
  parent_author: string;
  date: Date;
  url: string;
  body: string;
  category: string;
}

// code 9
export interface NotificationTaggedPost extends NotificationStrimi {
  author: string;
  permlink: string;
  date: Date;
  url: string;
  body: string;
  category: string;
}


