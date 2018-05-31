import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TagsRankPageComponent } from './tags-rank-page/tags-rank-page.component';
import { TagsRankComponent } from './tags-rank.component';

const routes: Routes = [
  {
    path: '',
    component: TagsRankPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TagsRankRoutingModule {}
