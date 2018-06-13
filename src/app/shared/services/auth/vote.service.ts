import {Injectable} from '@angular/core';
import * as steemApi from 'steem';

import {UserLogin} from '../../models';
import {StrimiApiService} from '../strimi-api.service';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class VoteService extends StrimiApiService {


  constructor(private httpClient: HttpClient) {
    super(httpClient);
  }

  async votePost(userLogin: UserLogin, author, permlink, weight, callback: Function, updateUser: Function) {
    const percent = weight * 100;
    try {
      await steemApi.broadcast.voteAsync(userLogin.pass, userLogin.login, author, permlink, percent);
      this.getActiveVotes(author, permlink).subscribe(res => callback(res.length, null));
      updateUser(author, permlink);
    } catch (e) {
      callback(null, e);
    }
  }

}
