import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StreamDetailsComponent } from './stream-posts/stream-details/stream-details.component';
import { StreamPostsComponent } from './stream-posts/stream-posts.component';
import { PostResolve } from '../shared/services/reslovers/post-resolve';

const routes: Routes = [
  {
    path: '',
    component: StreamPostsComponent,
  },
  { path: 'detail/:authorName/:permlink', component: StreamDetailsComponent, resolve: { postDetail: PostResolve } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StreamRoutingModule { }
