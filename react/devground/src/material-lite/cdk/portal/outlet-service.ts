import React from "react";
import ReactDOM from "react-dom";
import { Class } from "../utils";
import { MlPortalAttachedRef } from "./attached-ref";

export interface MlPortalConfig {
  animation?: {
    className?: string;
    enter?: number;
    leave?: number;
    destroy?: number;
  };
  data?: any;
  props?: {
    [key: string]: any;
  }
  directProps?: {
    [key: string]: any;
  };
}

export interface MlPortalOutletData {
  outletElement: Element;
  contents: JSX.Element[];
  detachEvents: ((destroyedOutlet?: boolean) => void)[];
}
export interface MlPortalContentData {
  destroy: () => void;
  rootElement: Element;
}

export class MlPortalOutletServiceBase<R extends MlPortalAttachedRef, D extends MlPortalOutletData, C extends MlPortalConfig> {
  publicOutletDataStorage: Map<string, D> = new Map();

  constructor(private _AttachedRef: Class<R>) { }

  attach(content: JSX.Element, keyOrData: string | D, config: C | undefined = {} as any): R {
    let outletKey: string | undefined;
    let data: D;

    if (typeof keyOrData === 'string') {
      outletKey = keyOrData;
      data = this.publicOutletDataStorage.get(outletKey)!;
      if (!data) { throw new Error(''); }

    } else {
      data = keyOrData;
    }

    const attachedOrder = data.detachEvents.length;
    let contentData: MlPortalContentData = {
      destroy: () => {
        data.contents.splice(attachedOrder);
        ReactDOM.render(React.createElement(React.Fragment, null, data.contents), outletEl);
      }
    } as any;

    const attachedRef = new this._AttachedRef(outletKey, attachedOrder, config, contentData, data);

    const newEl = React.cloneElement(content, {
      mlPortal: {
        ref: attachedRef,
        data: config.data,
        ...config.props
      },
      ...config.directProps
    });
    data.contents.push(newEl);

    const outletEl = data.outletElement;

    ReactDOM.render(React.createElement(React.Fragment, null, ...data.contents), outletEl);
    contentData.rootElement = outletEl.children.item(attachedOrder)!;

    return attachedRef._init();
  }
}

export const MlPortalOutletService = new MlPortalOutletServiceBase<MlPortalAttachedRef, MlPortalOutletData, MlPortalConfig>(MlPortalAttachedRef);

export interface MlPortalInjector<D = any> {
  data: D;
  ref: MlPortalAttachedRef;
}

