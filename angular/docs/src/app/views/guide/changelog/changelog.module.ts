import { NgModule } from '@angular/core';
import { MlButtonModule } from '@material-lite/angular/button';
import { ChangelogRoutingModule } from './changelog-routing.module';
import { ChangelogComponent } from './changelog.component';

@NgModule({
  declarations: [ChangelogComponent],
  imports: [
    ChangelogRoutingModule,
    MlButtonModule
  ],
})
export class ChangelogModule { }
