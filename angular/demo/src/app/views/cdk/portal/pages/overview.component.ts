import { Component } from '@angular/core';
import { MlPortalAttachConfig, MlPortalAttachContent, MlPortalAttachedRef, MlPortalOutlet } from '@material-lite/angular-cdk/portal';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styles: [`
    ::ng-deep .example-enter-active,
    ::ng-deep .example-leave-active {
      transition: opacity .5s;
    }
    ::ng-deep .example-enter,
    ::ng-deep .example-leave-to {
      opacity: 0;
    }
    .portal-outlet {
      min-width: 300px; min-height: 42px;
      padding: 8px; margin-top: 16px;
      border: 1px solid black;
      text-align: center;
    }
  `]
})
export class OverviewComponent {

  privateCodeViewer: 0 | 1 = 0;
  privatePortalContent: MlPortalAttachContent | false;
  privatePortalConfig: MlPortalAttachConfig = {};

  publicCodeViewer: 0 | 1 = 0;
  publicPortalContent: MlPortalAttachContent | false;
  publicPortalConfig: MlPortalAttachConfig = {};

  animationCodeViewer: 0 | 1 | 2 = 0;
  animationPortalContent: MlPortalAttachContent | false;
  animationPortalConfig: MlPortalAttachConfig = {
    animation: {
      className: 'example',
      enter: 500,
      leave: 500
    }
  };

  constructor(
    private _portalOutlet: MlPortalOutlet
  ) { }

  privateAttachPortal(): void {
    this.privatePortalContent = PortalAttachedComponent;
  }
  privateOnAttachPortal(ref: MlPortalAttachedRef): void {
    setTimeout(() => {
      ref.detach();
      this.privatePortalContent = false;
    }, 3000);
  }

  publicAttachPortal(): void {
    const ref = this._portalOutlet.attach(PortalAttachedComponent, 'example');

    setTimeout(() => ref.detach(), 3000);
  }

  animationAttachPortal(): void {
    this.animationPortalContent = PortalAttachedComponent;
  }
  animationOnAttachPortal(ref: MlPortalAttachedRef): void {
    setTimeout(() => {
      ref.detach();
      this.animationPortalContent = false;
    }, 3000);
  }
}


@Component({
  selector: 'app-portal-attached-component',
  template: '<h1 style="margin: auto;">Portal Attached Component</h1>'
})
class PortalAttachedComponent {
}
