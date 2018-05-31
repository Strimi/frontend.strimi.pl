import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../shared/shared.module';
import { StreamRoutingModule } from './stream-routing.module';
import { StreamContainerComponent } from './stream-posts/stream-container/stream-container.component';
import { StreamDetailsComponent } from './stream-posts/stream-details/stream-details.component';
import { StreamPostsComponent } from './stream-posts/stream-posts.component';

@NgModule({
  imports: [CommonModule, TranslateModule, SharedModule, StreamRoutingModule],
  declarations: [StreamPostsComponent, StreamContainerComponent, StreamDetailsComponent],
  providers: []
})
export class StreamModule {}
