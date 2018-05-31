import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostTrendingComponent } from './post-trending/post-trending.component';
import { PostCreatedComponent } from './post-created/post-created.component';
import { PostHotComponent } from './post-hot/post-hot.component';
import { PostsComponent } from './posts.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostTagComponent } from './post-tag/post-tag.component';
import { PostResolve } from '../shared/services/reslovers/post-resolve';
import { TagsResolve } from '../shared/services/reslovers/tags-resolve';

const routes: Routes = [
  {
    path: '',
    component: PostsComponent,
    children: [
      { path: '', component: PostTrendingComponent },
      { path: 'created', component: PostCreatedComponent },
      { path: 'hot', component: PostHotComponent },
      { path: 'trending/:tag', component: PostTagComponent, resolve: { tagPosts: TagsResolve } },
      { path: 'hot/:tag', component: PostTagComponent, resolve: { tagPosts: TagsResolve } },
      { path: 'created/:tag', component: PostTagComponent, resolve: { tagPosts: TagsResolve } },
      { path: ':category/:authorName/:permlink', component: PostDetailComponent, resolve: { postDetail: PostResolve } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostsRoutingModule { }
