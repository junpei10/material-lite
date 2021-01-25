import {
  ComponentFactoryResolver, ElementRef, EmbeddedViewRef, Inject,
  Injectable, TemplateRef, ViewContainerRef, ComponentRef, StaticProvider, Injector
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Class, RunOutside, RUN_OUTSIDE } from '@material-lite/angular-cdk/utils';
import { MlPortalAttachedRef, MlPortalAttachedRefArg } from './attached-ref';
import { ML_DATA, ML_REF } from '@material-lite/angular-cdk/utils';


export type MlPortalContent = Class<any> | TemplateRef<any> | HTMLElement | ElementRef<HTMLElement>;
export type MlPortalContentType = 'component' | 'template' | 'DOM';
export interface MlPortalConfig {
  animation?: {
    className?: string;
    enter?: number;
    leave?: number;
    destroy?: number;
  };
  component?: {
    injectData?: any;
    provider?: StaticProvider[];
    index?: number;
    ngContent?: any[][];
    // ngModuleFactory?: NgModuleFactory<any>
  };
  template?: {
    context?: {
      [key: string]: any
    };
    index?: number;
  };
  cloneDOM?: boolean;
}

export interface MlPortalOutletData {
  outletElement: HTMLElement;
  viewContainerRef: ViewContainerRef;
  detachEvents: ((destroyedOutlet?: boolean) => void)[];
}
export interface MlPortalContentData<T extends MlPortalContentType = MlPortalContentType> {
  type: T;
  ref: T extends 'component' ? ComponentRef<any> : T extends 'template' ? EmbeddedViewRef<any> : { destroy: () => void };
  rootElement: HTMLElement;
}

// tslint:disable-next-line:max-line-length
export abstract class MlPortalOutletServiceBase<R extends MlPortalAttachedRef, D extends MlPortalOutletData, C extends MlPortalConfig> {

  publicOutletDataStorage: Map<string, D> = new Map();

  constructor(
    private _AttachedRef: Class<R, MlPortalAttachedRefArg>,
    private _document: Document,
    private _runOutside: RunOutside,
    private _resolver: ComponentFactoryResolver,
    private _injector: Injector
  ) { }

  attach(content: MlPortalContent, keyOrData: string | MlPortalOutletData, config: C | undefined = {} as any): R {
    let outletKey: string | undefined;
    let data: MlPortalOutletData;

    if (typeof keyOrData === 'string') {
      outletKey = keyOrData;
      data = this.publicOutletDataStorage.get(outletKey)!;
      if (!data) { throw new Error(''); }

    } else {
      data = keyOrData;
    }

    let contentData: MlPortalContentData;

    // コンポーネントのときの処理
    if (typeof content === 'function') {
      const compConf = config.component;
      const viewContainerRef = data.viewContainerRef;

      let compRef: ComponentRef<any>;

      if (compConf) {
        // @ts-ignore
        contentData = {};
        const attachedRef = new this._AttachedRef(outletKey, data.detachEvents.length, config, contentData, data, this._runOutside);

        const providers = compConf.provider || [];
        providers.push({ provide: ML_REF, useValue: attachedRef }, { provide: ML_DATA, useValue: compConf.injectData });

        const elInjector = Injector.create({ providers, parent: this._injector });
        const compResolver = elInjector.get(ComponentFactoryResolver);
        const compFactory = compResolver.resolveComponentFactory(content);
        // tslint:disable-next-line:max-line-length
        compRef = viewContainerRef.createComponent(compFactory, compConf.index || viewContainerRef.length, elInjector, compConf.ngContent);

        contentData.type = 'component';
        contentData.ref = compRef;
        contentData.rootElement = compRef.location.nativeElement;

        // // コンポーネントかつ設定があった場合のみ、ここでreturnする
        return attachedRef._init();

      } else {
        compRef =
          viewContainerRef.createComponent(
            this._resolver.resolveComponentFactory(content),
            viewContainerRef.length
          );
        contentData = {
          type: 'component',
          ref: compRef,
          rootElement: compRef.location.nativeElement
        };
      }

      // Template時の処理
    } else if (content instanceof TemplateRef) {
      /* Template */
      const tempConf = config.template;
      const viewContainerRef = data.viewContainerRef;

      const tempViewRef = (tempConf)
        ? viewContainerRef.createEmbeddedView(content, tempConf.context, tempConf.index || viewContainerRef.length)
        : viewContainerRef.createEmbeddedView(content);

      contentData = {
        type: 'template',
        ref: tempViewRef,
        rootElement: tempViewRef.rootNodes[0]
      };

    } else {
      /* DOM */
      let element: HTMLElement = (content instanceof ElementRef)
        ? content.nativeElement
        : content;

      const parentElement = element.parentElement;
      let destroy: () => void;

      if (parentElement) {
        if (config.cloneDOM) {
          element = element.cloneNode(true) as HTMLElement;
          destroy = () => data.outletElement.removeChild(element);

        } else {
          const shadowWarrior = this._document.createComment('portal-container');
          parentElement.replaceChild(shadowWarrior, element);
          destroy = () => parentElement.replaceChild(element, shadowWarrior);
        }

      } else {
        destroy = () => element.remove();
      }

      data.outletElement.appendChild(element);

      contentData = {
        type: 'DOM',
        ref: { destroy },
        rootElement: element
      };
    }

    const attachedOrder = data.detachEvents.length;
    return new this._AttachedRef(outletKey, attachedOrder, config, contentData, data, this._runOutside)._init();
  }

  // TODO: 処理として、単純に`this.attach`をループさせているだけなので、ちゃんと最適化させる
  attachContents(contents: MlPortalContent[], keyOrData: string | MlPortalOutletData, config: C = {} as any): R[] {
    const returns: R[] = [];

    const length = contents.length;
    for (let i = 0; i < length; i++) {
      const _returns = this.attach(contents[i], keyOrData, config);
      returns.push(_returns);
    }

    return returns;
  }

  detachAll(keyOrData: 'all' | string | MlPortalOutletData | (string | MlPortalOutletData)[]): void {
    const storage = this.publicOutletDataStorage;

    if (Array.isArray(keyOrData)) {
      const length = keyOrData.length;
      for (let i = 0; i < length; i++) {
        const data = this._getOutletData(keyOrData[i]);
        if (!data) { return; }
        this._detachAllContent(data.detachEvents);
      }

    } else {
      if (keyOrData === 'all') {
        storage.forEach((v) => this._detachAllContent(v.detachEvents));

      } else {
        const data = this._getOutletData(keyOrData);
        if (!data) { return; }
        this._detachAllContent(data.detachEvents);
      }
    }
  }

  private _detachAllContent(detachEvents: (() => void)[]): void {
    const length = detachEvents.length;

    for (let i = 0; i < length; i++) {
      detachEvents[i]();
    }
  }

  protected _getOutletData(keyOrData: string | MlPortalOutletData): MlPortalOutletData | undefined {
    return typeof keyOrData === 'string'
      ? this.publicOutletDataStorage.get(keyOrData)
      : keyOrData;
  }

}

// @dynamic
@Injectable({
  providedIn: 'root'
})
export class MlPortalOutlet extends MlPortalOutletServiceBase<MlPortalAttachedRef, MlPortalOutletData, MlPortalConfig> {
  constructor(
    @Inject(DOCUMENT) document: Document,
    @Inject(RUN_OUTSIDE) runOutside: RunOutside,
    resolver: ComponentFactoryResolver,
    injector: Injector
  ) { super(MlPortalAttachedRef, document, runOutside, resolver, injector); }
}
