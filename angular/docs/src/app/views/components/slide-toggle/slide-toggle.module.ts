import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DocsRouteNavModule } from 'src/app/components/docs-route-nav/docs-route-nav.module';
import { DocsViewerModule } from 'src/app/components/docs-viewer/docs-viewer.module';
import { MlSlideToggleModule } from 'src/app/material-lite/components/slide-toggle/slide-toggle.module';
import { ExampleComponent, OverviewComponent, ReferenceComponent } from './pages';
import { SlideToggleRoutingModule } from './slide-toggle-routing.module';

import { SlideToggleComponent } from './slide-toggle.component';

@NgModule({
  declarations: [
    SlideToggleComponent,
    ExampleComponent,
    OverviewComponent,
    ReferenceComponent
  ],
  imports: [
    MlSlideToggleModule,
    FormsModule,
    SlideToggleRoutingModule,
    DocsViewerModule,
    DocsRouteNavModule
  ],
})
export class SlideToggleModule { }
