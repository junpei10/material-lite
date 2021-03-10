import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MlButtonModule } from '@material-lite/angular/button';
import { MlStraightTrackerModule } from 'src/app/material-lite/cdk/straight-tracker';

import { DocsRouteNavComponent } from './docs-route-nav.component';

@NgModule({
  declarations: [DocsRouteNavComponent],
  exports: [DocsRouteNavComponent],
  imports: [CommonModule, MlButtonModule, MlStraightTrackerModule],
})
export class DocsRouteNavModule { }
