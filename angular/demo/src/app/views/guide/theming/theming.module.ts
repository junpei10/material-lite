import { NgModule } from '@angular/core';
import { MlButtonModule } from '@material-lite/angular/button';
import { ThemingRoutingModule } from './theming-routing.module';
import { ThemingComponent } from './theming.component';

@NgModule({
  declarations: [ThemingComponent],
  imports: [
    ThemingRoutingModule,
    MlButtonModule
  ],
})
export class ThemingModule { }
