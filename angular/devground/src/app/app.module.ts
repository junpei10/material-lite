import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MlRippleModule } from '@material-lite/angular/core';
import { MlButtonModule } from '@material-lite/angular/button';
import { MlPortalModule } from '@material-lite/angular-cdk/portal';
import { MlStraightTrackerModule } from 'src/material-lite/cdk/straight-tracker/straight-tracker.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MlRippleModule,
    MlButtonModule,
    MlPortalModule,
    MlStraightTrackerModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
