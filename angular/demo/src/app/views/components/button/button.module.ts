import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MlButtonModule } from '@material-lite/angular/button';
import { ButtonRoutingModule } from './button-routing.module';

import { ButtonComponent } from './button.component';
import { ExampleComponent, OverviewComponent, ReferenceComponent } from './pages';

@NgModule({
  declarations: [
    ButtonComponent,
    ExampleComponent,
    OverviewComponent,
    ReferenceComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MlButtonModule,
    ButtonRoutingModule,
  ]
})
export class ButtonModule { }
