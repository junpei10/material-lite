import { ChangeDetectorRef, Component } from '@angular/core';
import { MlPortalAttachConfig, MlPortalContent, MlPortalAttachedRef, MlPortalOutlet } from '@material-lite/angular-cdk/portal';
import { DocsService } from 'src/app/services/docs';

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
      min-width: 300px; min-height: 48px;
      padding: 8px; margin-top: 16px;
      border: 1px solid black;
      text-align: center;
    }

    [product] {
      flex-direction: column;
    }
  `]
})
export class OverviewComponent {
  privatePortalContent: MlPortalContent | null;

  animationPortalContent: MlPortalContent | null;
  animationPortalConfig: MlPortalAttachConfig = {
    animation: {
      className: 'example',
      enter: 500,
      leave: 500
    }
  };

  constructor(
    docs: DocsService,
    private _portalOutlet: MlPortalOutlet,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    docs.setActiveRoute('overview');
  }

  privateAttachPortal(): void {
    this.privatePortalContent = PortalAttachedComponent;
  }
  privateOnAttachPortal(ref: MlPortalAttachedRef): void {
    setTimeout(() => {
      this.privatePortalContent = null;
      this._changeDetectorRef.markForCheck();
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
      this.animationPortalContent = null;
      this._changeDetectorRef.markForCheck();
    }, 3000);
  }
}


@Component({
  selector: 'app-portal-attached-component',
  template: '<h1 style="margin: auto;">Component</h1>',
  styles: [':host { display: block; } ']
})
class PortalAttachedComponent {
}
