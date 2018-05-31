import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BanPageComponent } from './ban-page.component';


const routes: Routes = [
  {
    path: '',
    component: BanPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BanPageRoutingModule { }
