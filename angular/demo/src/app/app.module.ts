import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentsComponent } from './views/components/components.component';
import { CdkComponent } from './views/cdk/cdk.component';
import { HomeComponent } from './views/home/home.component';
import { ThemeComponent } from './views/theme/theme.component';
import { MlButtonModule } from '@material-lite/angular/button';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CdkComponent,
    ComponentsComponent,
    ThemeComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    MlButtonModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
