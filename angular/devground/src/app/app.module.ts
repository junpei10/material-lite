import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MlPopupOutletModule } from '../material-lite/core/popup';
import { MlRippleModule } from 'src/material-lite/core/ripple';
import { MlButtonModule } from 'src/material-lite/button';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MlPopupOutletModule,
    MlRippleModule,
    MlButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
