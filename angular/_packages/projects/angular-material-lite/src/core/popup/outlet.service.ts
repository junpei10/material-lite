import { Injectable, NgZone, TemplateRef } from '@angular/core';
import { ML_OUTLET_DATA_STORAGE } from './outlet-data-storage';
import { MlPopupOutputReturns } from './output-returns';
import { MlPopupAnimationConfig, MlPopupContent, MlPopupContentData } from './types';

export type MlPopupOutletConfig = {
  outletKey?: string;

  hasBackdrop?: boolean;

  animation?: MlPopupAnimationConfig;
};


@Injectable({
  providedIn: 'root'
})
export class MlPopupOutlet {

  constructor(private _ngZone: NgZone) { }

  output(content: MlPopupContent<any>, config: MlPopupOutletConfig = {}): MlPopupOutputReturns {
    const outletKey = config.outletKey || 'root';
    const data = ML_OUTLET_DATA_STORAGE[outletKey];

    if (!data) { throw new Error(' ... '); }

    let contentData: MlPopupContentData;

    if (content instanceof TemplateRef) {
      const contentRef = data.render(content, 'template');
      contentData = {
        type: 'template',
        ref: contentRef,
        rootElement: contentRef.rootNodes[0]
      };
    } else if (typeof content === 'function') {
      const contentRef = data.render(content, 'component');
      contentData = {
        type: 'component',
        ref: contentRef,
        rootElement: contentRef.location.nativeElement
      };
    } else { throw new Error('TemplateRef もしくは Component class のみ出力できます'); }

    contentData.rootElement.classList.add('ml-popup-content');

    const outputOrder = data.closeEvents.length;

    const animationConfig = { ...config.animation };
    const _hasBackdrop: boolean = (config.hasBackdrop !== false);

    return new MlPopupOutputReturns(
      outletKey, outputOrder, contentData, animationConfig, this._ngZone, _hasBackdrop, data
    );
  }

  outputDialogs(contents: MlPopupContent<any>[], config: MlPopupOutletConfig = {}): MlPopupOutputReturns[] {
    const returns: MlPopupOutputReturns[] = [];

    const length = contents.length;
    for (let i = 0; i < length; i++) {
      const _returns = this.output(contents[i], config);
      returns.push(_returns);
    }

    return returns;
  }

  closeAll(outletKey: 'all' | string | string[]): void {
    const outletDataStorage = ML_OUTLET_DATA_STORAGE;

    if (typeof outletKey === 'string') {
      if (outletKey === 'all') {
        const keys = Object.keys(outletDataStorage);
        const length = keys.length;
        for (let i = 0; i < length; i++) {
          const data = outletDataStorage[keys[i]];
          this._destroyAllContent(data.closeEvents);
        }

      } else {
        const data = outletDataStorage[outletKey];
        this._destroyAllContent(data.closeEvents);
      }

    } else {
      const length = outletKey.length;
      for (let i = 0; i < length; i++) {
        const data = outletDataStorage[outletKey[i]];
        this._destroyAllContent(data.closeEvents);
      }
    }
  }
  private _destroyAllContent(closeEvents: (() => void)[]): void {
    const length = closeEvents.length;

    for (let i = 0; i < length; i++) {
      closeEvents[i]();
    }
  }
}
