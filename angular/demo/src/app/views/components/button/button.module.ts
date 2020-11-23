import { NgModule } from '@angular/core';
import { MlButtonModule } from '@material-lite/angular/button';
import { ButtonRoutingModule } from './button-routing.module';

import { ButtonComponent } from './button.component';

@NgModule({
  declarations: [ButtonComponent],
  imports: [MlButtonModule, ButtonRoutingModule]
})
export class ButtonModule { }
