import { DOCUMENT } from '@angular/common';
import {
  Attribute, ChangeDetectionStrategy, Component, ComponentFactoryResolver, ElementRef,
  Inject,
  OnDestroy, TemplateRef, ViewChild, ViewContainerRef,
} from '@angular/core';
import { MlThemeStyle, MlTheming } from '../../theming';
import { ML_OUTLET_DATA_STORAGE } from './outlet-data-storage';

const STYLE: MlThemeStyle = {
  base: `
    ml-popup-outlet {
      display: flex;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      pointer-events: none;
      opacity: 1;
      z-index: 16;
    }
    .ml-popup-content  {
      pointer-events: auto;
    }

    ml-popup-backdrop {
      position: absolute; top: 0;
      pointer-events: none;
      height: 100%; width: 100%;

      background-color: black;

      transition-property: opacity;
      transition-timing-function: cubic-bezier(.25,.8,.25,1);
    }

    ml-popup-backdrop.active {
      will-change: transition;
      opacity: 0.32;
    }

    ml-popup-backdrop:not(.active) {
      opacity: 0 !important;
    }
  `
};

@Component({
  selector: 'ml-popup-outlet',
  template: `<ng-template><ng-template>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MlPopupOutletComponent implements OnDestroy {
  @ViewChild(TemplateRef, { static: true, read: ViewContainerRef }) private _viewContainerRef: ViewContainerRef;

  constructor(
    @Attribute('key') private _key: string,
    elementRef: ElementRef,
    cfr: ComponentFactoryResolver,
    @Inject(DOCUMENT) _document: Document
  ) {
    MlTheming.setStyle(STYLE);

    if (!_key) {
      _key = this._key = 'root';
    }

    const outletData = ML_OUTLET_DATA_STORAGE;

    if (outletData[_key]) { throw new Error('重複したkeyプロパティをもつ<ml-popup-outlet>が配置されました。'); }

    const outletElement: HTMLElement = elementRef.nativeElement;
    const backdropElement = _document.createElement('ml-popup-backdrop');

    outletData[_key] = {
      outletClassList: outletElement.classList,
      backdrop: {
        listener: {
          addEventListener: backdropElement.addEventListener,
          removeEventListener: backdropElement.removeEventListener
        },
        style: backdropElement.style,
        classList: backdropElement.classList,
        usedCount: 0,
        clickHandler: {}
      },
      closeEvents: [],
      // @ts-ignore
      render: (content, contentType) => {
        return (contentType === 'template')
          ? this._viewContainerRef.createEmbeddedView(content)
          : this._viewContainerRef.createComponent(cfr.resolveComponentFactory(content));
      }
    };

    outletElement.appendChild(backdropElement);
  }

  ngOnDestroy(): void {
    // @ts-ignore
    ML_OUTLET_DATA_STORAGE[this._key] = null;
  }
}
