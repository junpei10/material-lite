import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RippleRoutingModule } from './ripple-routing.module';
import { RippleComponent } from './ripple.component';
import { MlRippleModule } from '@material-lite/angular/core';
import { MlButtonModule } from '@material-lite/angular/button';
import { FormsModule } from '@angular/forms';
import { ExampleComponent, OverviewComponent, ReferenceComponent } from './pages';
import { DocsRouteNavModule } from 'src/app/components/docs-route-nav/docs-route-nav.module';
import { DocsViewerModule } from 'src/app/components/docs-viewer/docs-viewer.module';


@NgModule({
  declarations: [
    RippleComponent,
    ExampleComponent,
    OverviewComponent,
    ReferenceComponent
  ],
  imports: [
    CommonModule,
    RippleRoutingModule,
    MlRippleModule,
    MlButtonModule,
    DocsRouteNavModule,
    DocsViewerModule,
    FormsModule
  ]
})
export class RippleModule { }
