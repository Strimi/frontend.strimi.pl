import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { BanPageRoutingModule } from './ban-pagerouting.module';
import { BanPageComponent } from './ban-page.component';

@NgModule({
  imports: [CommonModule, TranslateModule, BanPageRoutingModule],
  declarations: [BanPageComponent],
  providers: []
})
export class BanPageModule { }
