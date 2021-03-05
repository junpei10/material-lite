import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MlPopupModule } from '@material-lite/angular-cdk/popup';
import { MlButtonModule } from '@material-lite/angular/button';
import { OverviewComponent, ReferenceComponent } from './pages';
import { PopupRoutingModule } from './popup-routing.module';
import { PopupComponent } from './popup.component';

@NgModule({
  declarations: [
    PopupComponent,
    OverviewComponent,
    ReferenceComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PopupRoutingModule,
    MlButtonModule,
    MlPopupModule
  ],
})
export class PopupModule { }
