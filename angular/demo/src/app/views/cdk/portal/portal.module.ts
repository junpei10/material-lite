import { NgModule } from '@angular/core';
import { PortalRoutingModule } from './portal-routing.module';

import { PortalComponent } from './portal.component';
import { ExampleComponent, OverviewComponent, ReferenceComponent } from './pages';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MlButtonModule } from '@material-lite/angular/button';
import { MlPortalModule } from '@material-lite/angular-cdk/portal';

@NgModule({
  declarations: [
    PortalComponent,
    ExampleComponent,
    OverviewComponent,
    ReferenceComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PortalRoutingModule,
    MlButtonModule,
    MlPortalModule
  ],
})
export class PortalModule { }
