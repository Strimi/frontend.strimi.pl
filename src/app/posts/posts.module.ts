import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { HeaderTagComponent } from '../layout/header-tag/header-tag.component';
import { SharedModule } from '../shared/shared.module';

import { PostCreatedComponent } from './post-created/post-created.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostHotComponent } from './post-hot/post-hot.component';
import { PostTagComponent } from './post-tag/post-tag.component';
import { PostTrendingComponent } from './post-trending/post-trending.component';
import { PostsRoutingModule } from './posts-routing.module';
import { PostsComponent } from './posts.component';
import {
  PostLinkComponent,
  PostDetailSelectorComponent,
  PostTextComponent,
  PostImageComponent,
  PostVideoComponent,
  PostExternalComponent
} from '../shared/components/container-elements/post-detail-selector/index';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    PostsRoutingModule,
    NgbDropdownModule.forRoot(),
    SharedModule
  ],
  declarations: [
    PostTrendingComponent,
    PostCreatedComponent,
    PostHotComponent,
    PostsComponent,
    PostDetailComponent,
    PostDetailSelectorComponent,
    PostLinkComponent,
    PostTextComponent,
    PostImageComponent,
    PostVideoComponent,
    PostExternalComponent,
    PostTagComponent,
    HeaderTagComponent
  ],
  providers: [
  ]
})
export class PostsModule { }
