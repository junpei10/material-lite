import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RippleRoutingModule } from './ripple-routing.module';
import { RippleComponent } from './ripple.component';


@NgModule({
  declarations: [
    RippleComponent
  ],
  imports: [
    CommonModule,
    RippleRoutingModule
  ]
})
export class RippleModule { }
