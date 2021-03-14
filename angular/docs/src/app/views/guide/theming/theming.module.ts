import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MlButtonModule } from '@material-lite/angular/button';
import { DocsRouteNavModule } from 'src/app/components/docs-route-nav/docs-route-nav.module';
import { DocsViewerModule } from 'src/app/components/docs-viewer/docs-viewer.module';
import { ScssComponent, SettingComponent } from './page';
import { ThemingRoutingModule } from './theming-routing.module';
import { ThemingComponent } from './theming.component';

@NgModule({
  declarations: [
    ThemingComponent,
    SettingComponent,
    ScssComponent
  ],
  imports: [
    CommonModule,
    ThemingRoutingModule,
    MlButtonModule,
    DocsViewerModule,
    DocsRouteNavModule
  ],
})
export class ThemingModule { }
