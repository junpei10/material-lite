import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { MlPortalAttachConfig, MlPortalAttachedRef, MlPortalContent, MlPortalOutlet } from '@material-lite/angular-cdk/portal';
import { Class } from '@material-lite/angular-cdk/utils';
import { DocsService } from 'src/app/services/docs';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent {
  privatePortalContent: MlPortalContent;
  privatePortalConfig: MlPortalAttachConfig = {};

  privateComponentRef: Class<any> = PortalAttachedComponent;


  @ViewChild('templateRef2') templateRef: TemplateRef<HTMLElement>;
  @ViewChild('domRef2') domRef: ElementRef<HTMLElement>;
  @ViewChild('clonedDomRef2') clonedDomRef: ElementRef<HTMLElement>;


  constructor(
    docs: DocsService,
    private _mlPortalOutlet: MlPortalOutlet
  ) {
    docs.setActiveRoute('example');
  }

  publicAttachComponent(): void {
    const ref = this._mlPortalOutlet.attach(PortalAttachedComponent, 'example');

    setTimeout(() => ref.detach(), 1600);
  }

  publicAttachTemplate(): void {
    const ref = this._mlPortalOutlet.attach(this.templateRef, 'example');

    setTimeout(() => ref.detach(), 1600);
  }

  publicAttachDom(): void {
    const dom = this.domRef.nativeElement;
    const ref = this._mlPortalOutlet.attach(dom, 'example');

    setTimeout(() => ref.detach(), 1600);

    /**
     * 以下のコードのほうが無駄な並列処理が発生しない
     * if (ref.data.isFirstAttached) {
     *   setTimeout(() => ref.detach(), 1600);
     * }
     */
  }

  publicAttachClonedDom(): void {
    const clonedDom = this.clonedDomRef.nativeElement;
    const ref = this._mlPortalOutlet.attach(clonedDom, 'example', { cloneDOM: true });

    setTimeout(() => ref.detach(), 1600);
  }
}

@Component({
  selector: 'app-portal-attached-component',
  template: '<h1>Component</h1>',
  styles: [`
    h1 {
      padding: 8px 0;
    }
  `]
})
export class PortalAttachedComponent { }
