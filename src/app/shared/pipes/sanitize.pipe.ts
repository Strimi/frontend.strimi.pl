import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { JsonMetadata } from '../models/posts.model';

@Pipe({
  name: 'sanitize'
})
export class SanitizePipe implements PipeTransform {

  // not in html tag <> and beetwen ><, should start from @/#, can has - or . and should end only with letter and number
  private readonly USER_PATTER = new RegExp('(?!<a[^>]*>)(?!<a[^>]*)(@|\\s@)([a-zA-Z0-9\\-\\.]+[A-Za-z0-9])(?![^<]*>)(?![^<]*<\\/a>)', 'g');
  private readonly TAG_PATTER = new RegExp('(?!<a[^>]*>)(?!<a[^>]*)(#|\\s#)([a-zA-Z0-9\\-\\.]+[A-Za-z0-9])(?![^<]*>)(?![^<]*<\\/a>)', 'g');
  private readonly STEEMIT_IMAGE = 'https://cdn.steemitimages.com/0x0/';

  constructor(private _sanitizer: DomSanitizer) { }

  transform(post: string, jsonMetadata?: JsonMetadata): any {
    post = this.parseImages(post, jsonMetadata);
    post = this.parseLinks(post, jsonMetadata);
    post = this.parseTag(post);
    post = this.parseUser(post);
    return this._sanitizer.bypassSecurityTrustHtml(post);
  }

  parseTag(post: string) {
    return post.replace(this.TAG_PATTER, '<a href="/trending/$2"> #$2</a>');
  }

  parseUser(post: string) {
    return post.replace(this.USER_PATTER, '<a href="/@$2"> @$2</a>');
  }

  parseImages(post: string, jsonMetadata: JsonMetadata) {
    if (jsonMetadata && jsonMetadata.image && jsonMetadata.image.length > 0) {
      jsonMetadata.image.forEach(url => {
        if (url.includes(this.STEEMIT_IMAGE)) {
          url = url.split(this.STEEMIT_IMAGE).pop();
        }
        // regex - replace if not in html tag <>
        post = post.replace(new RegExp(`(?![^<]*>)${url}`, 'g'), this.createImgTag(url));
      });
    }
    return post;
  }

  createImgTag(url: string) {
    return `<img border="0" src="${this.STEEMIT_IMAGE + url}" >`;
  }

  parseLinks(post: string, jsonMetadata: JsonMetadata) {
    if (jsonMetadata && jsonMetadata.links && jsonMetadata.links.length > 0) {
      jsonMetadata.links.forEach(link => {
        // regex - replace if not in html tag <>
        post = post.replace(new RegExp(`(?![^<]*>)${link}`, 'g'), this.createAhrefTag(link));
      });
    }
    return post;
  }

  createAhrefTag(link: string) {
    return `<a href="${link}">${link}</a>`;
  }
}
