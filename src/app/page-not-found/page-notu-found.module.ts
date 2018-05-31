import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PageNotFoundRoutingModule } from './page-notu-found-routing.module';
import { PageNotFoundComponent } from './page-not-found.component';

@NgModule({
  imports: [CommonModule, TranslateModule, PageNotFoundRoutingModule],
  declarations: [PageNotFoundComponent],
  providers: []
})
export class PageNotFoundModule {}
