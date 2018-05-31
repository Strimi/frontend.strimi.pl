import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';

import {HeaderUserComponent} from '../layout/header-user/header-user.component';
import {SharedModule} from '../shared/shared.module';
import {UserCommentsComponent} from './user-strimi-page/user-pages/user-comments/user-comments.component';
import {UserContentComponent} from './user-strimi-page/user-pages/user-content/user-content.component';
import {UserFeedComponent} from './user-strimi-page/user-pages/user-feed/user-feed.component';
import {UserFollowersComponent} from './user-strimi-page/user-pages/user-followers/user-followers.component';
import {UserFollowingComponent} from './user-strimi-page/user-pages/user-following/user-following.component';
import {UserRepliesComponent} from './user-strimi-page/user-pages/user-replies/user-replies.component';
import {UserSettingsComponent} from './user-strimi-page/user-pages/user-settings/user-settings.component';
import {UserTransfersComponent} from './user-strimi-page/user-pages/user-transfers/user-transfers.component';
import {UserVotesComponent} from './user-strimi-page/user-pages/user-votes/user-votes.component';
import {UserStrimiPageComponent} from './user-strimi-page/user-strimi-page.component';
import {UserStrimiComponent} from './user-strimi.component';
import {UserStrimiRoutingModule} from './user-strimi.routing.module';

@NgModule({
  imports: [TranslateModule, CommonModule, SharedModule, UserStrimiRoutingModule],
  declarations: [
    UserStrimiComponent,
    UserStrimiPageComponent,
    UserCommentsComponent,
    UserFeedComponent,
    UserFollowersComponent,
    UserFollowingComponent,
    UserRepliesComponent,
    UserTransfersComponent,
    UserVotesComponent,
    UserContentComponent,
    HeaderUserComponent,
    UserSettingsComponent,
  ],
  providers: []
})
export class UserStrimiModule {
}
