import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';

import {CommentPostComponent, ContainerCommentsComponent, PostsContainerComponent} from './components/container-elements';
import {
  NotificationCommentedComponent,
  NotificationFollowedComponent,
  NotificationTaggedCommentComponent,
  NotificationTaggedPostComponent,
  NotificationVotedPostComponent
} from './components/notifications-components';
import {
  AuthorPostComponent,
  AvatarPostComponent,
  CashPostComponent,
  CommentsPostComponent,
  DateComponent,
  DescriptionPostComponent,
  ImagePostComponent,
  ReportPostComponent,
  SortHeaderComponent,
  TagPostComponent,
  TagPostDetailsComponent,
  TitlePostComponent,
  VotePostComponent,
  VotePostSmallComponent,
  VotePostThumbComponent,
  VoteSliderComponent
} from './components/post-elements';
import {
  AccountCreateWithDelegationComponent,
  AuthorRewardComponent,
  ClaimRewardBalanceComponent,
  CurationRewardComponent,
  DelegateVestingSharesComponent,
  FillOrderComponent,
  ReturnVestingDelegationComponent,
  TransferComponent,
  TransferToVestingComponent
} from './components/rewards-components';
import {ExchangeComponent, PopularTagsComponent} from './components/siderbar-elements';
import {StreamDescriptionComponent} from './components/stream-description/stream-description.component';
import {
  AddContentPostComponent,
  CommentsUserProfileComponent,
  LoginModalComponent,
  SettingModalComponent,
  UserAddContentComponent,
  UserLoggedPanelComponent,
  UserNotificationModalComponent,
  UserProfileComponent,
  UserSearchComponent,
  VotersListComponent
} from './components/user-elements';
import {
  BannerComponent,
  ButtonNextComponent,
  ChangeThemeComponent,
  ErrorInfoComponent,
  NoContentInfoComponent,
  SelectLanguageComponent,
  SelectPostLangComponent,
  SerachInputComponent,
  SpinnerComponent
} from './components/utils-elements';
import {AngularMaterialModule} from './modules/angular-material.module';
import {SIMPLEMDE_CONFIG, SimplemdeModule} from 'ng2-simplemde';
import {SidebarInfoComponent} from './components/new-posts';
import {MarkdownPipe, RemoveHtmlPipe, SanitizePipe, SanitizeStylePipe, SanitizeUrlPipe} from './pipes';
import { ConfirmDeleteComponent } from './components/user-elements/confirm-delete/confirm-delete.component';
import { DeletingSpinnerModalComponent } from './components/user-elements/deleting-spinner-modal/deleting-spinner-modal.component';
import { DeletingErrorModalComponent } from './components/user-elements/deleting-error-modal/deleting-error-modal.component';
import { DownVoteComponent } from './components/user-elements/down-vote/down-vote.component';

@NgModule({
  declarations: [
    AuthorPostComponent,
    AvatarPostComponent,
    CashPostComponent,
    CommentsPostComponent,
    DescriptionPostComponent,
    ImagePostComponent,
    ReportPostComponent,
    TitlePostComponent,
    DateComponent,
    TagPostComponent,
    SelectPostLangComponent,
    SelectLanguageComponent,
    VotePostComponent,
    TagPostDetailsComponent,
    MarkdownPipe,
    SanitizePipe,
    SanitizeUrlPipe,
    RemoveHtmlPipe,
    CommentPostComponent,
    ExchangeComponent,
    PopularTagsComponent,
    SerachInputComponent,
    VoteSliderComponent,
    UserProfileComponent,
    CommentsUserProfileComponent,
    UserSearchComponent,
    PostsContainerComponent,
    AuthorRewardComponent,
    CurationRewardComponent,
    TransferComponent,
    ClaimRewardBalanceComponent,
    ButtonNextComponent,
    SpinnerComponent,
    NoContentInfoComponent,
    ErrorInfoComponent,
    StreamDescriptionComponent,
    ContainerCommentsComponent,
    VotersListComponent,
    ChangeThemeComponent,
    LoginModalComponent,
    SortHeaderComponent,
    BannerComponent,
    FillOrderComponent,
    DelegateVestingSharesComponent,
    AccountCreateWithDelegationComponent,
    TransferToVestingComponent,
    ReturnVestingDelegationComponent,
    UserLoggedPanelComponent,
    UserAddContentComponent,
    UserNotificationModalComponent,
    VotePostSmallComponent,
    VotePostThumbComponent,
    AddContentPostComponent,
    NotificationVotedPostComponent,
    NotificationFollowedComponent,
    NotificationCommentedComponent,
    NotificationTaggedCommentComponent,
    NotificationTaggedPostComponent,
    SettingModalComponent,
    SidebarInfoComponent,
    SanitizeStylePipe,
    ConfirmDeleteComponent,
    DeletingSpinnerModalComponent,
    DeletingErrorModalComponent,
    DownVoteComponent
  ],
  imports: [
    TranslateModule,
    NgbModule,
    CommonModule,
    RouterModule,
    FormsModule,
    AngularMaterialModule,
    SimplemdeModule.forRoot({
      provide: SIMPLEMDE_CONFIG,

      // config options 1
      useValue: null
    })
  ],
  exports: [
    TranslateModule,
    AuthorPostComponent,
    AvatarPostComponent,
    CashPostComponent,
    CommentsPostComponent,
    DescriptionPostComponent,
    ImagePostComponent,
    ReportPostComponent,
    TitlePostComponent,
    DateComponent,
    TagPostComponent,
    SelectPostLangComponent,
    SelectLanguageComponent,
    VotePostComponent,
    TagPostComponent,
    TagPostDetailsComponent,
    MarkdownPipe,
    SanitizePipe,
    SanitizeUrlPipe,
    CommentPostComponent,
    ExchangeComponent,
    PopularTagsComponent,
    SerachInputComponent,
    FormsModule,
    AngularMaterialModule,
    UserProfileComponent,
    CommentsUserProfileComponent,
    UserSearchComponent,
    PostsContainerComponent,
    AuthorRewardComponent,
    CurationRewardComponent,
    TransferComponent,
    ClaimRewardBalanceComponent,
    ButtonNextComponent,
    SpinnerComponent,
    NoContentInfoComponent,
    ErrorInfoComponent,
    StreamDescriptionComponent,
    ContainerCommentsComponent,
    VotersListComponent,
    ChangeThemeComponent,
    LoginModalComponent,
    SortHeaderComponent,
    BannerComponent,
    FillOrderComponent,
    DelegateVestingSharesComponent,
    AccountCreateWithDelegationComponent,
    TransferToVestingComponent,
    ReturnVestingDelegationComponent,
    UserLoggedPanelComponent,
    UserAddContentComponent,
    UserNotificationModalComponent,
    VotePostSmallComponent,
    VotePostThumbComponent,
    AddContentPostComponent,
    NotificationVotedPostComponent,
    NotificationFollowedComponent,
    NotificationCommentedComponent,
    NotificationTaggedCommentComponent,
    NotificationTaggedPostComponent,
    SimplemdeModule,
    SidebarInfoComponent,
    SanitizeStylePipe,
    ConfirmDeleteComponent,
    DeletingSpinnerModalComponent,
    DeletingErrorModalComponent,
    DownVoteComponent
  ],
  entryComponents: [SettingModalComponent, ConfirmDeleteComponent, DeletingSpinnerModalComponent, DeletingErrorModalComponent, DownVoteComponent]
})
export class SharedModule {
}
