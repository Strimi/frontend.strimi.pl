import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersRankPageComponent } from './users-rank-page/users-rank-page.component';
const routes: Routes = [
  {
    path: '',
    component: UsersRankPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRankRoutingModule {}
