import { DOCUMENT } from '@angular/common';
import { Attribute, Directive, ElementRef, Inject, Input, Output, ViewContainerRef } from '@angular/core';
import { MlPortalContent, MlPortalOutletDirectiveBase } from '@material-lite/angular-cdk/portal';
import { createListenTarget } from '@material-lite/angular-cdk/utils';
import { MlPopupConfig, MlPopupAttachedRef, MlPopupOutletData } from './attached-ref';
import { MlPopupOutlet } from './outlet.service';

// @dynamic
@Directive({
  selector: '[mlPopupOutlet]'
})
export class MlPopupOutletDirective extends MlPortalOutletDirectiveBase<MlPopupAttachedRef, MlPopupOutletData, MlPopupConfig> {
  @Input('mlPopupOutlet') content: MlPortalContent;
  @Input('mlPopupOutletConfig') config: MlPopupConfig;
  @Output('mlPopupOutletAttached') attachedEmitter = this._getAttachedEmitter;

  constructor(
    elementRef: ElementRef<HTMLElement>,
    viewContainerRef: ViewContainerRef,
    @Attribute('key') key: string,
    popupOutlet: MlPopupOutlet,
    @Inject(DOCUMENT) _document: Document
  ) {
    super(key, popupOutlet);

    const backdropElement = _document.createElement('ml-popup-backdrop');
    const outletElement = elementRef.nativeElement.parentElement!;

    outletElement.appendChild(backdropElement);

    this._init({
      outletElement,
      viewContainerRef,
      detachEvents: [],
      backdrop: {
        listenTarget: createListenTarget(backdropElement),
        style: backdropElement.style,
        classList: backdropElement.classList,
        clickHandler: {},
        usedCount: 0
      },
      finisher: [0, 0]
    });
  }
}
