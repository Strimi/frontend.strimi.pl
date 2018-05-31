import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {ActivatedRoute, Params} from '@angular/router';
import * as steem from 'steem';
import {FollowStats} from '../../shared';
import {UserStrimiService} from '../../shared/services/user-strimi.service';
import {AuthService} from '../../shared/services/auth/auth.service';

@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html'
})
export class HeaderUserComponent implements OnInit {

  style;
  stats: FollowStats;
  name: string;
  created: Date;
  reputation: number;
  showSettings = false;

  constructor(private userService: UserStrimiService,
              private route: ActivatedRoute,
              private sanitizer: DomSanitizer,
              public authService: AuthService) {
  }

  ngOnInit() {
    this.route.parent.params.subscribe((params: Params) => {
      const authorName = params['authorName'].replace('@', '');
      this.userService.getUserFollowStats(authorName).subscribe(res => this.stats = res);
      this.userService.getUserStrimi(authorName).subscribe(res => {
        this.name = res.name;
        this.created = res.created;
        this.reputation = steem.formatter.reputation(res.reputation);
        if (res.json_metadata && res.json_metadata.profile && res.json_metadata.profile.cover_image) {
          this.setStyle(res.json_metadata.profile.cover_image);
        }
        this.shouldShowSettings(res.name);
      });
    });
  }

  setStyle(coverImage) {
    const url = `https://cdn.steemitimages.com/2048x512/${coverImage}`;
    this.style = this.sanitizer.bypassSecurityTrustStyle('url("' + url + '")');
  }

  shouldShowSettings(userName: string) {
    this.authService.isLogged().subscribe(user => {
      if(user){
      this.showSettings = user.loginData.login === userName;
      }
    });
  }
}
