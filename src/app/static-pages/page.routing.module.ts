import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactComponent, CookiesComponent, RegulationsComponent, PrivacyComponent, FaqComponent } from './index';
import { PagesComponent } from './pages.component';

const pageRoutes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: 'contact', component: ContactComponent },
      { path: 'cookies', component: CookiesComponent },
      { path: 'regulations', component: RegulationsComponent },
      { path: 'privacy-policy', component: PrivacyComponent },
      { path: 'faq', component: FaqComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(pageRoutes)],
  exports: [RouterModule]
})
export class PageRoutingModule {}
