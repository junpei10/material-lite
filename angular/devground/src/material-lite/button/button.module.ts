import { NgModule } from '@angular/core';
import { MlRippleModule } from '../core/ripple';

import { MlButtonComponent } from './button.component';

@NgModule({
  imports: [MlRippleModule],
  exports: [MlButtonComponent],
  declarations: [MlButtonComponent],
})
export class MlButtonModule { }
