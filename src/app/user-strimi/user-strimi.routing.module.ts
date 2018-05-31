import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserCommentsComponent } from './user-strimi-page/user-pages/user-comments/user-comments.component';
import { UserContentComponent } from './user-strimi-page/user-pages/user-content/user-content.component';
import { UserFeedComponent } from './user-strimi-page/user-pages/user-feed/user-feed.component';
import { UserFollowersComponent } from './user-strimi-page/user-pages/user-followers/user-followers.component';
import { UserFollowingComponent } from './user-strimi-page/user-pages/user-following/user-following.component';
import { UserRepliesComponent } from './user-strimi-page/user-pages/user-replies/user-replies.component';
import { UserSettingsComponent } from './user-strimi-page/user-pages/user-settings/user-settings.component';
import { UserTransfersComponent } from './user-strimi-page/user-pages/user-transfers/user-transfers.component';
import { UserVotesComponent } from './user-strimi-page/user-pages/user-votes/user-votes.component';
import { UserStrimiPageComponent } from './user-strimi-page/user-strimi-page.component';
import { UserStrimiComponent } from './user-strimi.component';
import {IsLoggedGuard} from '../shared/services/guards/IsLoggedGuard';
import {IsYurProfileGuard} from '../shared/services/guards/is-your-profile.guard';

const routes: Routes = [
  {
    path: '',
    component: UserStrimiComponent,
    children: [
      {
        path: '', component: UserStrimiPageComponent,
        children: [
          { path: '', component: UserContentComponent },
          { path: 'feed', component: UserFeedComponent },
          { path: 'comments', component: UserCommentsComponent },
          { path: 'replies', component: UserRepliesComponent },
          { path: 'votes', component: UserVotesComponent },
          { path: 'following', component: UserFollowingComponent },
          { path: 'followers', component: UserFollowersComponent },
          { path: 'transfers', component: UserTransfersComponent },
          { path: 'settings', component: UserSettingsComponent, canActivate: [IsLoggedGuard, IsYurProfileGuard] }
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserStrimiRoutingModule { }
