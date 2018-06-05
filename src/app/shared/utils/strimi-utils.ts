import {PostResult} from '../index';
import * as moment from 'moment';
// parse json_metadata and strimi_metadata from string to object
// if exception than just return post
// recursion for parsing nesteds post (comments)
export const paresePost = (post: PostResult) => {
  try {
    if (post.json_metadata && post.json_metadata.toString().length > 0) {
      post.json_metadata = JSON.parse(post.json_metadata.toString());
      if (post.json_metadata.strimi_metadata) {
        post.json_metadata.strimi_metadata = JSON.parse(post.json_metadata.strimi_metadata.toString());
      }
    }
    if (post.comments && post.comments.length > 0) {
      paresePosts(post.comments);
    }
    return post;
  } catch {
    return post;
  }
};

export const paresePosts = (post: Array<PostResult>) => {
  return post.map(p => paresePost(p));
};

export const postAfter7Days = (date): boolean => {
  const postTime = moment.utc(date).local().format();
  const now = moment(moment.utc());
  const days = moment(now).diff(moment(postTime), 'days'); // can edit only when post is not older then 7 days
  return days < 7;
};


export const createFooterForPost = (author: string, permlink: string) => {
  return `<hr><p><center><em>Posted on `
    + `<a href="https://strimi.it/strimi/@${author}/${permlink}">`
    + `<strong>Strimi.it</strong></a></em></p>`;
};

export const createFooterForLinkPost = (author: string, permlink: string, source: string) => {
  return `<hr><p><center><em><strong>`
    + `Posted via <a href="https://strimi.it/strimi/@${author}/${permlink}">Strimi</a> `
    +  `<p>Source: <a href="${source}">view</a></p> `
    + `</strong></em></center></p>`;
};

export const createImgForLinkPost = (author: string, permlink: string, img: string) => {
  return `<p><center>`
    + `<a href="https://strimi.it/strimi/@${author}/${permlink}" `
    + `rel="nofollow noopener" title="This link will take you away to strimi.it">`
    + `<img src="${img}"></a>`
    + `</center></p>`;
};
