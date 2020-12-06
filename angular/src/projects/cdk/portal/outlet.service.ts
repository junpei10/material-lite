import {
  ComponentFactoryResolver, ElementRef, EmbeddedViewRef, Inject,
  Injectable, Injector, TemplateRef, ViewContainerRef, ComponentRef
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Class, RunOutside, RUN_OUTSIDE } from '@material-lite/angular-cdk/utils';
import { MlPortalAttachedRef, MlPortalAttachedRefArg } from './attached-ref';


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
    injector?: Injector;
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
  readonly outletElement: HTMLElement;
  readonly viewContainerRef: ViewContainerRef;
  readonly detachEvents: ((destroyOutlet?: boolean) => void)[];
}
export interface MlPortalContentData<T extends MlPortalContentType = MlPortalContentType> {
  readonly type: T;
  readonly ref: T extends 'component' ? ComponentRef<any> : T extends 'template' ? EmbeddedViewRef<any> : { destroy: () => void };
  readonly rootElement: HTMLElement;
}

// tslint:disable-next-line:max-line-length
export abstract class MlPortalOutletServiceBase<R extends MlPortalAttachedRef, D extends MlPortalOutletData, C extends MlPortalConfig> {

  publicOutletDataStorage: Map<string, D> = new Map();

  constructor(
    private _document: Document,
    private _runOutside: RunOutside,
    private _resolver: ComponentFactoryResolver,
    private _AttachedRef: Class<R, MlPortalAttachedRefArg>,
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

    let attachedContent: MlPortalContentData;

    if (typeof content === 'function') {
      /* Component */
      const compConf = config.component;
      const viewContainerRef = data.viewContainerRef;

      let compRef: ComponentRef<any>;

      if (compConf) {
        const elInjector = compConf.injector || viewContainerRef.parentInjector;
        const compResolver = elInjector.get(ComponentFactoryResolver);
        const compFactory = compResolver.resolveComponentFactory(content);
        compRef = viewContainerRef.createComponent(compFactory, compConf.index || viewContainerRef.length, elInjector, compConf.ngContent);
      } else {
        compRef =
          viewContainerRef.createComponent(
            this._resolver.resolveComponentFactory(content),
            viewContainerRef.length
          );
      }

      attachedContent = {
        type: 'component',
        ref: compRef,
        rootElement: compRef.location.nativeElement
      };

    } else if (content instanceof TemplateRef) {
      /* Template */
      const tempConf = config.template;
      const viewContainerRef = data.viewContainerRef;

      const tempViewRef = (tempConf)
        ? viewContainerRef.createEmbeddedView(content, tempConf.context, tempConf.index || viewContainerRef.length)
        : viewContainerRef.createEmbeddedView(content);

      attachedContent = {
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

      attachedContent = {
        type: 'DOM',
        ref: { destroy },
        rootElement: element
      };
    }

    const attachedOrder = data.detachEvents.length;

    return new this._AttachedRef(outletKey, attachedOrder, config, attachedContent, data, this._runOutside);
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
    resolver: ComponentFactoryResolver
  ) { super(document, runOutside, resolver, MlPortalAttachedRef); }
}
