import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
// import { MlPopupOutletModule } from '../material-lite/core/popup';
import { AppRoutingModule } from './app-routing.module';
import { MlRippleModule } from '@material-lite/angular/core';
import { MlButtonModule } from '@material-lite/angular/button';
import { MlPortalModule } from '@material-lite/angular-cdk/portal';
import { MlPopupModule } from '@material-lite/angular-cdk/popup';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // MlPopupOutletModule,
    MlRippleModule,
    MlButtonModule,
    MlPortalModule,
    MlPopupModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
