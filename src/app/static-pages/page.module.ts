import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ContactComponent, CookiesComponent, FaqComponent, PrivacyComponent, RegulationsComponent } from './index';
import { PageRoutingModule } from './page.routing.module';
import { PagesComponent } from './pages.component';


@NgModule({
  declarations: [
    ContactComponent,
    CookiesComponent,
    RegulationsComponent,
    PrivacyComponent,
    FaqComponent,
    PagesComponent
  ],
  imports: [CommonModule, TranslateModule, PageRoutingModule]
})
export class PageModule { }
