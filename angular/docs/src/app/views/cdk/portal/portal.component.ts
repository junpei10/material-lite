import { Component } from '@angular/core';
import { OverviewComponent, ReferenceComponent } from './pages';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
})
export class PortalComponent {
  pageName: string;

  onRouteChange(event): void {
    this.pageName = event instanceof OverviewComponent
      ? 'overview'
      : event instanceof ReferenceComponent
        ? 'reference'
        : 'example';
  }

}
