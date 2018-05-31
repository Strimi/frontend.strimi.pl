import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NewLinkComponent } from './new-link/new-link.component';



const routes: Routes = [
  {
    path: '',
    component: NewLinkComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddLinkRoutingModule { }
