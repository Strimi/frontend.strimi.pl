import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import { PopularTag, PopularTagResponse } from '../index';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

const apiStrimi = environment.apiStrimi;

/**
 * Fetch popular tags.
 */
@Injectable()
export class TagRankingService {

  // holds first part of tags, fetched first time during start app
  private initialListTag: Array<PopularTag>;

  // to propagate tags on app
  popularTags = new BehaviorSubject<Array<PopularTag>>([]);

  constructor(private http: HttpClient) {
    this.getPopularTags().subscribe(tags => {
      this.popularTags.next(tags);
      this.initialListTag = tags;
    });
  }

  // fetch first part of popular tags
  getPopularTags(): Observable<Array<PopularTag>> {
    return this.http.get<PopularTagResponse>(apiStrimi + '/tags', {
      params: new HttpParams().set('limit', '50')
    }).map(res => {
      res.result.shift();
      return res.result.sort((a, b) => b.top_posts - a.top_posts);
    });
  }

  // fetch next tags
  getNextTag(tag: string): void {
    this.http.get<PopularTagResponse>(apiStrimi + '/tags', {
      params: new HttpParams().set('startTag', tag)
    }).subscribe(res => {
      res.result.shift();
      this.popularTags.next([...this.popularTags.value, ...res.result]);
    });
  }

  // fetch tags by filter
  getTagsSuggestFor(tag: string): void {
    this.http.get<any>(apiStrimi + '/elastic/tags/suggest', {
      params: new HttpParams().set('suggestFor', tag)
    }).subscribe(res => {
      const arrTags = res.hits.hits.map(e => {
        const popularTag: PopularTag = ({
          name: e._source.name,
          total_payouts: e._source.totalPayouts,
          net_votes: e._source.netVotes,
          top_posts: e._source.topPosts,
          comments: e._source.comments,
          trending: e._source.trending
        });
        return popularTag;
      });
      this.popularTags.next([...arrTags]);
    });
  }

  returnSuggestedTag(tag: string): Observable<Array<string>> {
    return this.http.get<any>(apiStrimi + '/elastic/tags/suggest', {
      params: new HttpParams().set('suggestFor', tag)
    })
      .map(res => {
        return res.hits.hits.map(e => e._source.name);
      });
  }

  // revert Observable to oryginal first part of tags.
  // Usually used by component onDestroy method
  revertTags(): void {
    this.popularTags.next(this.initialListTag);
  }

}
