import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MlButtonModule } from '@material-lite/angular/button';
import { DocsRouteNavModule } from 'src/app/components/docs-route-nav/docs-route-nav.module';
import { DocsViewerModule } from 'src/app/components/docs-viewer/docs-viewer.module';
import { ButtonRoutingModule } from './button-routing.module';

import { ButtonComponent } from './button.component';
import { ExampleComponent, OverviewComponent, ReferenceComponent } from './pages';

@NgModule({
  declarations: [
    ButtonComponent,
    ExampleComponent,
    OverviewComponent,
    ReferenceComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MlButtonModule,
    ButtonRoutingModule,
    DocsViewerModule,
    DocsRouteNavModule
  ]
})
export class ButtonModule { }
