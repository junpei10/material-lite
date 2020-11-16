import { ComponentRef, EmbeddedViewRef } from '@angular/core';
import { MlPopupGlobalHandler } from './handler';
import { MlPopupContentType } from './types';

export type ML_OUTLET_DATA_STORAGE = {
  [key: string]: {
    outletClassList: DOMTokenList
    backdrop: {
      listener: {
        addEventListener: HTMLElement['addEventListener'],
        removeEventListener: HTMLElement['removeEventListener']
      }
      style: CSSStyleDeclaration
      classList: DOMTokenList
      clickHandler: MlPopupGlobalHandler<KeyboardEvent>
      usedCount: number
    };
    // tslint:disable-next-line:max-line-length
    render: <CT extends MlPopupContentType>(content: any, contentType: CT) => CT extends 'template' ? EmbeddedViewRef<any> : ComponentRef<any>
    closeEvents: (() => void)[]
  };
};
export const ML_OUTLET_DATA_STORAGE: ML_OUTLET_DATA_STORAGE = {};
