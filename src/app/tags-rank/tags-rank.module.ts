import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { TagsRankPageComponent } from './tags-rank-page/tags-rank-page.component';
import { TagsRankRoutingModule } from './tags-rank-routing.module';
import { MatTableModule } from '@angular/material/table';
import { TagsRankComponent } from './tags-rank.component';

@NgModule({
  imports: [TranslateModule, SharedModule, CommonModule, TagsRankRoutingModule, MatTableModule],
  declarations: [TagsRankComponent, TagsRankPageComponent],
  providers: []
})
export class TagsRankModule { }
