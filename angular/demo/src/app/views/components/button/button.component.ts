import { Component } from '@angular/core';
import { OverviewComponent, ReferenceComponent } from './pages';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html'
})

export class ButtonComponent {
  pageName: string;
  onRouteChange(event): void {
    this.pageName = event instanceof OverviewComponent
      ? 'overview'
      : event instanceof ReferenceComponent
        ? 'reference'
        : 'example';
  }
}
