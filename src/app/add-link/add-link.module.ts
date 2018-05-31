import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';

import {AddLinkRoutingModule} from './add-link-routing.module';
import {AddLinkComponent} from './add-link.component';
import {NewLinkComponent} from './new-link/new-link.component';
import {SharedModule} from '../shared/shared.module';


@NgModule({
  imports: [CommonModule, TranslateModule, AddLinkRoutingModule, SharedModule],
  declarations: [AddLinkComponent, NewLinkComponent],
  providers: []
})
export class AddLinkModule {
}
