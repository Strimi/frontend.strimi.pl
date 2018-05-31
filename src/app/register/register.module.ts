import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../shared/shared.module';
import { RegisterComponent } from './register.component';
import { RegisterFormComponent } from './register/register-form.component';
import { RegisterRoutingModule } from './register-routing.module';



@NgModule({
  imports: [CommonModule, TranslateModule, SharedModule, RegisterRoutingModule],
  declarations: [RegisterComponent, RegisterFormComponent],
  providers: []
})
export class RegisterModule { }
