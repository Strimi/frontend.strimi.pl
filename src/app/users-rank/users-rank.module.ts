import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { MatTableModule } from '@angular/material/table';
import { UsersRankPageComponent } from './users-rank-page/users-rank-page.component';
import { UsersRankRoutingModule } from './users-rank-routing.module';
import { UsersRankComponent } from './users-rank.component';

@NgModule({
  imports: [TranslateModule, CommonModule, SharedModule, UsersRankRoutingModule],
  declarations: [UsersRankPageComponent, UsersRankComponent],
  providers: []
})
export class UsersRankModule {}
