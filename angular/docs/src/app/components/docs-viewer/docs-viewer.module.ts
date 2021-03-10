import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MlButtonModule } from '@material-lite/angular/button';

import { DocsViewerComponent } from './docs-viewer.component';

@NgModule({
  declarations: [DocsViewerComponent],
  exports: [DocsViewerComponent],
  imports: [CommonModule, MlButtonModule],
})
export class DocsViewerModule { }
