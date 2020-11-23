import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MlButtonModule } from '@material-lite/angular/button';
import { MlRippleModule } from '@material-lite/angular/core';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MlButtonModule,
    MlRippleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
