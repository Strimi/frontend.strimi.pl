import {Injectable} from '@angular/core';
import {createFooterForLinkPost, createFooterForPost, createImgForLinkPost, PostResult} from '../../index';
import {NewPost} from '../../models';
import {PostService} from '../post.service';
import {Constants} from '../../settings';
import * as removeMarkdown from 'remove-markdown';
import * as parseLinksMarkdown from 'parse-markdown-links';
import * as steem from 'steem';
import {Router} from '@angular/router';
import {RecognizedLink} from '../../models/recognize-link.model';

// tslint:disable-next-line:max-line-length
const imageRegex = /https?:\/\/(?:[-a-zA-Z0-9._]*[-a-zA-Z0-9])(?::\d{2,5})?(?:[/?#](?:[^\s"'<>\][()]*[^\s"'<>\][().,])?(?:(?:\.(?:tiff?|jpe?g|gif|png|svg|ico)|ipfs\/[a-z\d]{40,})))/;

@Injectable()
export class AddContentService {

  constructor(private postService: PostService, private router: Router) {
  }

  sendEditComment(oldPost: PostResult, editedComment: string, callbackError: Function, callbackSucces: Function) {
    const arr = parseLinksMarkdown(editedComment);
    const arrayLinks = this.extractLinks(arr);
    const wif = this.postService.loggedData.loginData.pass;
    const author = this.postService.loggedData.loginData.login;
    const operations = [
      ['comment',
        {
          parent_author: oldPost.parent_author,
          parent_permlink: oldPost.parent_permlink,
          author: oldPost.author,
          permlink: oldPost.permlink,
          title: '',
          body: this.removeHTML(editedComment),
          json_metadata: JSON.stringify({
            app: Constants.STRIMI_20,
            tags: ['strimi-stream'],
            format: 'html',
            image: arrayLinks[0],
            links: arrayLinks[1],
          })
        }
      ],
      ['comment_options', {
        author: author,
        permlink: oldPost.permlink,
        max_accepted_payout: '1000000.000 SBD', // '1000000.000 SBD', jak steam power
        percent_steem_dollars: 0,
        allow_votes: true,
        allow_curation_rewards: true
      }]
    ];

    this.addPostToSteem(operations, wif, callbackError, callbackSucces);
  }

  sendCommentPost(parentAuthor: string, parentPermlink: string, commentPost: string, callbackError: Function, callbackSucces: Function) {
    const permlink = this.createPermlink(commentPost);
    const arr = parseLinksMarkdown(commentPost);
    const arrayLinks = this.extractLinks(arr);
    const wif = this.postService.loggedData.loginData.pass;
    const author = this.postService.loggedData.loginData.login;
    const operations = [
      ['comment',
        {
          parent_author: parentAuthor,
          parent_permlink: parentPermlink,
          author: author,
          permlink: permlink,
          title: '',
          body: this.removeHTML(commentPost),
          json_metadata: JSON.stringify({
            app: Constants.STRIMI_20,
            tags: ['strimi-stream'],
            format: 'html',
            image: arrayLinks[0],
            links: arrayLinks[1],
          })
        }
      ],
      ['comment_options', {
        author: author,
        permlink: permlink,
        max_accepted_payout: '1000000.000 SBD', // '1000000.000 SBD', jak steam power
        percent_steem_dollars: 0,
        allow_votes: true,
        allow_curation_rewards: true,
        extensions: Constants.BENEFICIARIES
      }]
    ];
    this.addPostToSteem(operations, wif, callbackError, callbackSucces);
  }

  sendEditStreamPost(oldPost: PostResult, editedPost: string, callbackError: Function, callbackSucces: Function) {
    const arr = parseLinksMarkdown(editedPost);
    const arrayLinks = this.extractLinks(arr);
    const wif = this.postService.loggedData.loginData.pass;
    const author = this.postService.loggedData.loginData.login;
    const operations = [
      ['comment',
        {
          parent_author: 'strimi',
          parent_permlink: 'strimi-stream-live-2', // strimi-stream-live-2
          author: oldPost.author, // zalogowany
          permlink: oldPost.permlink, // budowane z body sprawdzić unikalnosc
          title: '', // ''
          body: this.removeHTML(editedPost),
          json_metadata: JSON.stringify({
            app: Constants.STRIMI_20,
            tags: ['strimi-stream'],
            format: 'html',
            strimi_metadata: this.createStrimiMetadataStream(editedPost),
            image: arrayLinks[0],
            links: arrayLinks[1],
          })
        }
      ],
      ['comment_options', {
        author: author, // zalogowany user
        permlink: oldPost.permlink, // budowane z body
        max_accepted_payout: '1000000.000 SBD', // '1000000.000 SBD', jak steam power
        percent_steem_dollars: 0, // 0
        allow_votes: true,
        allow_curation_rewards: true,
      }]
    ];
    this.addPostToSteem(operations, wif, callbackError, callbackSucces);
  }

  sendStreamPost(streamPost: string, callbackError: Function, callbackSucces: Function) {
    const permlink = this.createPermlink(streamPost);
    const arr = parseLinksMarkdown(streamPost);
    const arrayLinks = this.extractLinks(arr);
    const wif = this.postService.loggedData.loginData.pass;
    const operations = [
      ['comment',
        {
          parent_author: 'strimi',
          parent_permlink: 'strimi-stream-live-2', // strimi-stream-live-2
          author: this.postService.loggedData.loginData.login, // zalogowany
          permlink: permlink, // budowane z body sprawdzić unikalnosc
          title: '', // ''
          body: this.removeHTML(streamPost),
          json_metadata: JSON.stringify({
            app: Constants.STRIMI_20,
            tags: ['strimi-stream'],
            format: 'html',
            strimi_metadata: this.createStrimiMetadataStream(streamPost),
            image: arrayLinks[0],
            links: arrayLinks[1],
          })
        }
      ],
      ['comment_options', {
        author: this.postService.loggedData.loginData.login, // zalogowany user
        permlink: permlink, // budowane z body
        max_accepted_payout: '1000000.000 SBD', // '1000000.000 SBD', jak steam power
        percent_steem_dollars: 0, // 0
        allow_votes: true,
        allow_curation_rewards: true,
        extensions: Constants.BENEFICIARIES // my jestesmy 15%
      }]
    ];
    this.addPostToSteem(operations, wif, callbackError, callbackSucces);
  }

  createPost(newPost: NewPost, callbackError: Function, callbackSucces: Function) {
    const author = this.postService.loggedData.loginData.login;
    const arr = parseLinksMarkdown(newPost.body);
    const arrayLinks = this.extractLinks(arr);
    const permlink = this.createPermlink(newPost.title);
    const operations = this.preparePostOpertaion(newPost, permlink, arrayLinks, author);
    const wif = this.postService.loggedData.loginData.pass;
    this.addPostToSteem(operations, wif, callbackError, callbackSucces);
  }

  updatePost(updatedPost: NewPost, oldPost: PostResult, callbackError: Function, callbackSucces: Function) {
    const author = this.postService.loggedData.loginData.login;
    const arr = parseLinksMarkdown(updatedPost.body);
    const arrayLinks = this.extractLinks(arr);
    const permlink = oldPost.permlink;
    const operations = this.prepareUpdatePostOpertaion(updatedPost, oldPost, permlink, arrayLinks, author);
    const wif = this.postService.loggedData.loginData.pass;
    this.addPostToSteem(operations, wif, callbackError, callbackSucces);
  }

  addPostToSteem(operations, wif: string, callbackError: Function, callbackSucces: Function) {
    steem.broadcast.sendAsync({
        extensions: [],
        operations: operations
      },
      {posting: wif},
      (error, result) => this.handlerAdding(error, result, callbackError, callbackSucces)
    );
  }

  handlerAdding = (error, result, callbackError, callbackSucces) => {
    if (result) {
      const prePost = result.operations[0][1];
      callbackSucces(prePost);
    } else {
      callbackError(error);
    }
  };

  preparePostOpertaion(newPost: NewPost, permlink: string, arrayLinks: [Array<string>, Array<string>], author: string) {
    const operations = [
      ['comment',
        {
          parent_author: '',
          parent_permlink: 'strimi',
          author: this.postService.loggedData.loginData.login,
          permlink: permlink,
          title: removeMarkdown(this.removeHTML(newPost.title)),
          body: this.addFooter(newPost.body, author, permlink),
          json_metadata: JSON.stringify({
            app: Constants.STRIMI_20,
            format: 'html',
            strimi_metadata: this.createStrimiMetadataPost(newPost),
            tags: this.createTagList(newPost.tags),
            image: arrayLinks[0],
            links: arrayLinks[1],
          })
        }
      ],
      ['comment_options', {
        author: this.postService.loggedData.loginData.login,
        permlink: permlink,
        max_accepted_payout: newPost.reward.split(',')[0],
        percent_steem_dollars: parseFloat(newPost.reward.split(',')[1]),
        allow_votes: true,
        allow_curation_rewards: true,
        extensions: Constants.BENEFICIARIES
      }]
    ];
    return operations;
  }

  prepareUpdatePostOpertaion(updatedPost: NewPost, odlPost: PostResult, permlink: string, arrayLinks: [Array<string>, Array<string>], author: string) {
    const operations = [
      ['comment',
        {
          parent_author: '',
          parent_permlink: 'strimi',
          author: author,
          permlink: permlink,
          title: removeMarkdown(this.removeHTML(updatedPost.title)),
          body: this.addFooter(updatedPost.body, author, permlink),
          json_metadata: JSON.stringify({
            app: Constants.STRIMI_20,
            format: 'html',
            strimi_metadata: this.createStrimiMetadataPost(updatedPost),
            tags: this.createTagList(updatedPost.tags),
            image: arrayLinks[0],
            links: arrayLinks[1],
          })
        }
      ],
      ['comment_options', {
        author: this.postService.loggedData.loginData.login,
        permlink: permlink,
        max_accepted_payout: odlPost.max_accepted_payout,
        percent_steem_dollars: odlPost.percent_steem_dollars,
        allow_votes: true,
        allow_curation_rewards: true,
      }]
    ];
    return operations;
  }

  // CREATE LINK POST

  createLinkPost(newPost: NewPost, recognizedLink: RecognizedLink, callbackError: Function, callbackSucces: Function) {
    const author = this.postService.loggedData.loginData.login;
    const arr = parseLinksMarkdown(newPost.body);
    const arrayLinks = this.extractLinks(arr);
    const permlink = this.createPermlink(newPost.title);
    const operations = this.prepareLinkPost(newPost, recognizedLink, permlink, arrayLinks, author);
    const wif = this.postService.loggedData.loginData.pass;
    this.addPostToSteem(operations, wif, callbackError, callbackSucces);
  }

  updateLinkPost(newPost: NewPost, oldPost: PostResult, callbackError: Function, callbackSucces: Function) {
    const author = this.postService.loggedData.loginData.login;
    const arr = parseLinksMarkdown(newPost.body);
    const arrayLinks = this.extractLinks(arr);
    const permlink = oldPost.permlink;
    const operations = this.prepareUpdateLinkPost(newPost, oldPost, permlink, arrayLinks, author);
    const wif = this.postService.loggedData.loginData.pass;
    this.addPostToSteem(operations, wif, callbackError, callbackSucces);
  }


  prepareLinkPost(newPost: NewPost, recognizedLink: RecognizedLink, permlink: string, arrayLinks: [Array<string>, Array<string>], author: string) {
    const operations = [
      ['comment',
        {
          parent_author: '',
          parent_permlink: 'strimi',
          author: this.postService.loggedData.loginData.login,
          permlink: permlink,
          title: removeMarkdown(this.removeHTML(newPost.title)),
          body: this.addFooterAndImgToLinkPost(newPost.body, author, permlink, recognizedLink.thumbnails[0], recognizedLink.source),
          json_metadata: JSON.stringify({
            app: Constants.STRIMI_20,
            format: 'html',
            strimi_metadata: this.createStrimiMetadataLinkPost(newPost, recognizedLink),
            tags: this.createTagList(newPost.tags),
            image: arrayLinks[0],
            links: arrayLinks[1],
          })
        }
      ],
      ['comment_options', {
        author: author,
        permlink: permlink,
        max_accepted_payout: newPost.reward.split(',')[0],
        percent_steem_dollars: parseFloat(newPost.reward.split(',')[1]),
        allow_votes: true,
        allow_curation_rewards: true,
        extensions: Constants.BENEFICIARIES
      }]
    ];
    return operations;
  }

  prepareUpdateLinkPost(newPost: NewPost, odlPost: PostResult, permlink: string, arrayLinks: [Array<string>, Array<string>], author: string) {
    const img  = odlPost.json_metadata.strimi_metadata.thumb;
    const source = odlPost.json_metadata.strimi_metadata.source;
    const operations = [
      ['comment',
        {
          parent_author: '',
          parent_permlink: 'strimi',
          author: author,
          permlink: permlink,
          title: removeMarkdown(this.removeHTML(newPost.title)),
          body: this.addFooterAndImgToLinkPost(newPost.body, author, permlink, img, source),
          json_metadata: JSON.stringify({
            app: Constants.STRIMI_20,
            format: 'html',
            strimi_metadata: this.editStrimiMetadataLinkPost(newPost, odlPost),
            tags: this.createTagList(newPost.tags),
            image: arrayLinks[0],
            links: arrayLinks[1],
          })
        }
      ],
      ['comment_options', {
        author: author,
        permlink: permlink,
        max_accepted_payout: odlPost.max_accepted_payout,
        percent_steem_dollars: odlPost.percent_steem_dollars,
        allow_votes: true,
        allow_curation_rewards: true
      }]
    ];
    return operations;
  }


  // remove all html added by user
  removeHTML = (body) => body.replace(/<.*?>/gm, '');


  // add our footer
  addFooter = (body: string, author: string, permlink: string) => {
    const text = this.removeHTML(body);
    return `${text}\n` + createFooterForPost(author, permlink);
  };

  addFooterAndImgToLinkPost = (body: string, author: string, permlink: string, img: string, source: string) => {
    let text = this.removeHTML(body);
    text = `${text}\n` + createFooterForLinkPost(author, permlink, source);
    text = createImgForLinkPost(author, permlink, img) + `${text}`;
    return text;
  };

  createStrimiMetadataPost = (newPost: NewPost) => {
    const title = removeMarkdown(newPost.title);
    const strimiMetadata = {
      title: this.removeHTML(title),
      body: this.removeHTML(newPost.body),
      type: {
        type: 'text'
      }
    };
    return strimiMetadata;
  };

  createStrimiMetadataStream = (postStream: string) => {
    const strimiMetadata = {
      body: this.removeHTML(postStream),
      type: {
        type: 'stream'
      }
    };
    return strimiMetadata;
  };

  createStrimiMetadataLinkPost = (newPost: NewPost, recognizedLink: RecognizedLink) => {
    const title = removeMarkdown(newPost.title);
    const type = {
      height: recognizedLink.height,
      width: recognizedLink.width,
      type: recognizedLink.type,
      type_from: recognizedLink.type,
    };
    const strimiMetadata = {
      title: this.removeHTML(title),
      body: this.removeHTML(newPost.body),
      type: type,
      thumb: recognizedLink.thumbnails[0],
      source: recognizedLink.source,
      domain: recognizedLink.domain,
      video: recognizedLink.id

    };
    return strimiMetadata;
  };

  editStrimiMetadataLinkPost = (newPost: NewPost, oldPost: PostResult) => {
    const title = removeMarkdown(newPost.title);
    const oldType = oldPost.json_metadata.strimi_metadata.type;
    const oldStrimiData = oldPost.json_metadata.strimi_metadata;
    const type = {
      height: oldType.height,
      width: oldType.width,
      type: oldType.type,
      type_from: oldType.type,
    };
    const strimiMetadata = {
      title: this.removeHTML(title),
      body: this.removeHTML(newPost.body),
      type: type,
      thumb: oldStrimiData.thumb,
      source: oldStrimiData.source,
      domain: oldStrimiData.domain,
      video: oldStrimiData.id

    };
    return strimiMetadata;
  };

  createTagList(tags: Array<string>) {
    const tagLang = this.postService.tagLang;
    if (tagLang === Constants.STRIMI_TAG) {
      return [Constants.STRIMI_TAG, ...tags];
    } else {
      return [Constants.STRIMI_TAG, Constants.STRIMI_TAG_PL, ...tags];
    }
  }

  createPermlink = (title) => {
    if (!title) {
      return false;
    }
    const time = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
    let permlink = title.split(' ').join('-').toLowerCase().replace(/[^a-z0-9-]+/g, '').trim();
    permlink = 'strimi-' + permlink + '-' + time;
    if (permlink.length > 255) {
      permlink = permlink.substring(permlink.length - 255, permlink.length);
    }
    permlink = permlink.replace(/[-]+/g, '-');
    return permlink;
  };

  /**
   * Group links to img and normal links
   * @param links
   */
  extractLinks(links: Array<string>): [Array<string>, Array<string>] {
    const imgLinks = [];
    const normalLinks = [];
    const regex = RegExp(imageRegex);
    links.forEach(element => {
      if (regex.test(element) === true) {
        if (!imgLinks.includes(element)) {
          imgLinks.push(element);
        }
      } else {
        if (!normalLinks.includes(element)) {
          normalLinks.push(element);
        }
      }
    });
    return [imgLinks, normalLinks];
  }

}
