import { DOCUMENT } from '@angular/common';
import {
  ComponentFactoryResolver, Inject, Injectable, Injector,
  StaticProvider, TemplateRef, ViewContainerRef
} from '@angular/core';
import { Class, MlDocument, ML_DATA, ML_REF, RunOutsideNgZone, RUN_OUTSIDE_NG_ZONE } from '@material-lite/angular-cdk/utils';
import { MlPortalAttachedRef } from './portal-attached-ref';


export type MlPortalContent = Class<any> | TemplateRef<any> | HTMLElement;
export type MlPortalContentType = 'component' | 'template' | 'DOM' | 'cloneDOM';

export interface MlPortalAttachConfig {
  dataStorageRef?: MlPortalDataStorage;

  animation?: {
    className?: string;
    enter?: number;
    leave?: number;
    cancelOnAttach?: boolean;
    cancelOnDetach?: boolean;
  };

  component?: {
    injectionData?: any;
    providers?: StaticProvider[];
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

export interface MlPortalData {
  outletElement: HTMLElement;
  destroyingOutletDuration?: number;
  viewContainerRef: ViewContainerRef;
  detachEvents: ((outletDestroyed?: boolean) => void)[];
}

export interface MlPortalContentRef {
  rootElement: HTMLElement;
  destroy: () => void;
}

export type MlPortalDataStorage = Map<string, MlPortalData>;

@Injectable({
  providedIn: 'root'
})
export class MlPortalOutlet {
  private _createComment: MlDocument['createComment'];
  private _portalDataStorage: MlPortalDataStorage = new Map();

  constructor(
    @Inject(DOCUMENT) _document: MlDocument,
    @Inject(RUN_OUTSIDE_NG_ZONE) private _runOutsideNgZone: RunOutsideNgZone,
    private _injector: Injector,
  ) {
    this._createComment = _document.createComment.bind(_document);
  }

  hasPortalData(key: string): boolean {
    return this._portalDataStorage.has(key);
  }

  setPortalData(key: string, data: MlPortalData): void {
    this._portalDataStorage.set(key, data);
  }

  /**
   * 第１引数に代入された値を、第２引数を参照して出力する。
   *
   * @param content 出力する中身。
   * @param keyOrPortalData 出力されるアウトレットを特定するためのデータ。
   */
  attach(content: MlPortalContent, keyOrPortalData: string | MlPortalData, config: MlPortalAttachConfig = {} as any): MlPortalAttachedRef {
    let key: string | null;
    let portalData: MlPortalData;

    if (typeof keyOrPortalData === 'string') {
      key = keyOrPortalData;
      portalData = (config.dataStorageRef || this._portalDataStorage).get(keyOrPortalData)!;

      if (!portalData) {
        throw new Error(`
          "MlPortalOutlet.attach()"の第2引数に代入された値から、"portalData"を見つけることができませんでした。

          1. "MlPortalOutlet(service) > attach(...)"関数が呼び出されたとき
          2. "[mlPortalOutlet](directive) > [mlPortalOutlet](@Input)"に値が代入されたとき
        `);
      }
    } else {
      key = null;
      portalData = keyOrPortalData;
    }

    const attachedOrder = portalData.detachEvents.length;

    if (typeof content === 'function') {
      // content = "component"
      const compConf = config.component || {};
      const vcRef = portalData.viewContainerRef;

      const contentRef: MlPortalContentRef = {} as any;

      const attachedRef =
        new MlPortalAttachedRef(
          'component', key, attachedOrder, config.animation,
          contentRef, portalData, this._runOutsideNgZone
        );

      const providers: StaticProvider[] = [
        { provide: ML_REF, useValue: attachedRef },
        { provide: ML_DATA, useValue: compConf.injectionData }
      ];

      if (compConf.providers) {
        providers.push(...compConf.providers);
      }

      const elInjector = Injector.create({ providers, parent: this._injector });
      const compResolver = elInjector.get(ComponentFactoryResolver);

      const ref =
        vcRef.createComponent(
          compResolver.resolveComponentFactory(content), compConf.index || vcRef.length,
          elInjector, compConf.ngContent
        );

      contentRef.rootElement = ref.location.nativeElement;
      contentRef.destroy = () => {
        ref.destroy();
        ref.changeDetectorRef.detectChanges();
      };

      // @ts-ignore
      return attachedRef._initialize();


    } else if (content instanceof TemplateRef) {
      // content = "template"
      const tempConf = config.template;
      const vcRef = portalData.viewContainerRef;

      const ref = (tempConf)
        ? vcRef.createEmbeddedView(content, tempConf, tempConf.index || vcRef.length)
        : vcRef.createEmbeddedView(content);

      const contentRef: MlPortalContentRef = {
        rootElement: ref.rootNodes[0],
        destroy: () => {
          ref.destroy();
          ref.detectChanges();
        }
      };

      return new MlPortalAttachedRef(
        'template', key, attachedOrder, config.animation,
        contentRef, portalData, this._runOutsideNgZone // @ts-ignore
      )._initialize();


    } else {
      // content = "DOM"
      let contentRef: MlPortalContentRef;

      let contentType: 'DOM' | 'cloneDOM';

      if (config.cloneDOM) {
        const clone = content.cloneNode(true) as HTMLElement;

        contentType = 'cloneDOM';

        const outletEl = portalData.outletElement;

        contentRef = {
          rootElement: clone,
          destroy: () => clone.remove() // cloneしたDOMを削除
        };

        outletEl.appendChild(clone);


      } else {
        const prevMlPortalAttachedRef = // @ts-ignore
          content.mlPortalAttachedRef as MlPortalAttachedRef | undefined;

        if (prevMlPortalAttachedRef) {
          // @ts-ignore: assign the readonly variable
          prevMlPortalAttachedRef.data.isFirstAttached = false;
          return prevMlPortalAttachedRef;
        }

        contentType = 'DOM';

        const shadowWarrior = this._createComment('portal-container');
        const parentEl = content.parentElement;

        if (parentEl) {
          contentRef = {
            rootElement: content,
            destroy: () => parentEl.replaceChild(content, shadowWarrior) // 入れ替えたDOMをもとの場所に戻す
          };

          // 影武者とコンテンツを入れ替え
          parentEl.replaceChild(shadowWarrior, content);
          portalData.outletElement.appendChild(content);

        } else {
          contentRef = {
            rootElement: content,
            destroy: () => content.remove()
          };

          portalData.outletElement.appendChild(content);
        }
      }

      const currMlPortalAttachedRef =  new MlPortalAttachedRef(
        contentType, key, attachedOrder, config.animation, contentRef,
        portalData, this._runOutsideNgZone // @ts-ignore
      )._initialize();

      // @ts-ignore
      content.mlPortalAttachedRef = currMlPortalAttachedRef;

      return currMlPortalAttachedRef;
    }
  }


  /**
   * @param dataStorage 削除したい`dataStorage`。未代入の場合、クラス内の`dataStorage`が選択される。
   * @param keys 削除したい`portalData`の`key`。未代入の場合、すべてが選択される。
   */
  detachAll(dataStorage: MlPortalDataStorage = this._portalDataStorage, ...keys: string[]): void {
    const len = keys.length;

    if (len) {
      for (let i = 0; i < len; i++) {
        const data = dataStorage.get(keys[i]);
        if (!data) { return; }
        this.detachAllOfPortalData(data);
      }

    } else {
      dataStorage.forEach((d) => this.detachAllOfPortalData(d));
    }
  }


  /**
   * PortalData内をすべてすべて削除する。
   */
  detachAllOfPortalData(portalData: MlPortalData): void {
    const detaches = portalData.detachEvents;
    const len = detaches.length;

    for (let i = 0; i < len; i++) {
      detaches[i]();
    }
  }
}
