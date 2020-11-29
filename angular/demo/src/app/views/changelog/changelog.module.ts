import { NgModule } from '@angular/core';
import { ChangelogRoutingModule } from './changelog-routing.module';
import { ChangelogComponent } from './changelog.component';

@NgModule({
  imports: [ChangelogRoutingModule],
  declarations: [ChangelogComponent],
})
export class ChangelogModule { }
