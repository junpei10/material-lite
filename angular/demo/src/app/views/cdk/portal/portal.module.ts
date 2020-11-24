import { NgModule } from '@angular/core';
import { PortalRoutingModule } from './portal-routing.module';

import { PortalComponent } from './portal.component';

@NgModule({
  declarations: [PortalComponent],
  imports: [PortalRoutingModule],
})
export class PortalModule { }
