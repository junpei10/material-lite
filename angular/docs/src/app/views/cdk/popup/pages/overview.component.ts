import { Component } from '@angular/core';
import { MlPopupOutlet } from '@material-lite/angular-cdk/popup';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html'
})
export class OverviewComponent {
  constructor(
    private _mlPopupOutlet: MlPopupOutlet
  ) { }

  backdropAttachPortal(): void {
    this._mlPopupOutlet.attach(PortalAttachedComponent, 'example');
  }
}

@Component({
  selector: 'app-portal-attached-component',
  template: '<h1 style="margin: auto;">Portal Attached Component</h1>',
  styles: [':host { display: block; } ']
})
class PortalAttachedComponent {
}
