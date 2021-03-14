import { NgModule } from '@angular/core';
import { StraightTrackerRoutingModule } from './straight-tracker-routing.module';

import { ExampleComponent, OverviewComponent, ReferenceComponent } from './pages';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MlButtonModule } from '@material-lite/angular/button';
import { DocsRouteNavModule } from 'src/app/components/docs-route-nav/docs-route-nav.module';
import { DocsViewerModule } from 'src/app/components/docs-viewer/docs-viewer.module';
import { StraightTrackerComponent } from './straight-tracker.component';
import { MlStraightTrackerModule } from 'src/app/material-lite/cdk/straight-tracker';
import { MlRippleModule } from '@material-lite/angular/core';

@NgModule({
  declarations: [
    StraightTrackerComponent,
    ExampleComponent,
    OverviewComponent,
    ReferenceComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    StraightTrackerRoutingModule,
    DocsRouteNavModule,
    DocsViewerModule,
    MlRippleModule,
    MlButtonModule,
    MlStraightTrackerModule
  ],
})
export class StraightTrackerModule { }
