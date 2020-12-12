import { Component } from '@angular/core';
import { OverviewComponent } from './pages';

@Component({
  selector: 'app-popup',
  templateUrl: 'popup.component.html'
})

export class PopupComponent {
  pageName: string;

  onRouteChange(event): void {
    this.pageName = event instanceof OverviewComponent
      ? 'overview'
      : 'reference';
  }
}
