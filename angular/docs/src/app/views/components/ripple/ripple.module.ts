import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RippleRoutingModule } from './ripple-routing.module';
import { RippleComponent } from './ripple.component';
import { MlRippleModule } from '@material-lite/angular/core';
import { MlButtonModule } from '@material-lite/angular/button';
import { MlPopupModule } from '@material-lite/angular-cdk/popup';
import { FormsModule } from '@angular/forms';
import { ExampleComponent, OverviewComponent, ReferenceComponent } from './pages';


@NgModule({
  declarations: [
    RippleComponent,
    ExampleComponent,
    OverviewComponent,
    ReferenceComponent
  ],
  imports: [
    CommonModule,
    RippleRoutingModule,
    MlRippleModule,
    MlPopupModule,
    MlButtonModule,
    FormsModule
  ]
})
export class RippleModule { }
