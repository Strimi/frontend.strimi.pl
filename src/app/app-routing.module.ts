import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserResolve } from './shared/services/reslovers/user-resolve';
import {IsLoggedGuard} from './shared/services/guards/IsLoggedGuard';


const routes: Routes = [
  { path: '', loadChildren: './posts/posts.module#PostsModule' },
  { path: 'pages', loadChildren: './static-pages/page.module#PageModule' },
  { path: 'stream', loadChildren: './stream/stream.module#StreamModule' },
  { path: 'pages/tags-rank', loadChildren: './tags-rank/tags-rank.module#TagsRankModule' },
  { path: 'pages/users-rank', loadChildren: './users-rank/users-rank.module#UsersRankModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterModule' },
  { path: 'new-post', loadChildren: './add-post/add-post.module#AddPostModule', canActivate: [IsLoggedGuard] },
  { path: 'new-link', loadChildren: './add-link/add-link.module#AddLinkModule', canActivate: [IsLoggedGuard] },
  { path: 'page-404', loadChildren: './page-not-found/page-notu-found.module#PageNotFoundModule' },
  { path: 'content-403/:path', loadChildren: './ban-page/ban-page.module#BanPageModule' },
  {
    path: ':authorName', loadChildren: './user-strimi/user-strimi.module#UserStrimiModule',
    resolve: { user: UserResolve }
  },
  { path: '**', redirectTo: 'page-404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
