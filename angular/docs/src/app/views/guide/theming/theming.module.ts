import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MlButtonModule } from '@material-lite/angular/button';
import { ThemingRoutingModule } from './theming-routing.module';
import { ThemingComponent } from './theming.component';

@NgModule({
  declarations: [ThemingComponent],
  imports: [
    CommonModule,
    ThemingRoutingModule,
    MlButtonModule
  ],
})
export class ThemingModule { }
