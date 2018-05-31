import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../shared/shared.module';
import { AddPostRoutingModule } from './add-post-routing.module';
import { AddPostComponent } from './add-post.component';
import { NewPostComponent } from './new-post/new-post.component';

@NgModule({
  imports: [CommonModule, TranslateModule, AddPostRoutingModule, SharedModule],
  declarations: [AddPostComponent, NewPostComponent],
  providers: []
})
export class AddPostModule { }
