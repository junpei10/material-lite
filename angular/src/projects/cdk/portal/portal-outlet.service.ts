import { DOCUMENT } from '@angular/common';
import {
  ComponentFactoryResolver, Inject, Injectable, Injector,
  StaticProvider, TemplateRef, ViewContainerRef
} from '@angular/core';
import { Class, ML_DATA, ML_REF, RunOutsideNgZone, RUN_OUTSIDE_NG_ZONE } from '@material-lite/angular-cdk/utils';
import { MlPortalAttachedRef } from './portal-attached-ref';


export type MlPortalContent = Class<any> | TemplateRef<any> | HTMLElement;
export type MlPortalContentType = 'component' | 'template' | 'DOM';

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

// @dynamic
@Injectable({
  providedIn: 'root'
})
export class MlPortalOutlet {
  private _createComment: Document['createComment'];
  private _portalDataStorage: MlPortalDataStorage = new Map();

  constructor(
    @Inject(DOCUMENT) _document: Document,
    @Inject(RUN_OUTSIDE_NG_ZONE) private _runOutsideNgZone: RunOutsideNgZone,
    private _injector: Injector,
  ) {
    this._createComment = _document.createElement.bind(_document);
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
        { provide: ML_DATA, useValue: compConf.injectData }
      ];

      if (compConf.provider) {
        providers.push(...compConf.provider);
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

      if (config.cloneDOM) {
        const clone = content.cloneNode(true) as HTMLElement;

        const outletEl = portalData.outletElement;

        contentRef = {
          rootElement: clone,
          destroy: () => outletEl.removeChild(clone) // cloneしたDOMを削除
        };

        outletEl.appendChild(clone);

      } else {
        const shadowWarrior = this._createComment('portal-container');
        const parentElement = content.parentElement!;

        // 影武者とコンテンツを入れ替え
        parentElement.replaceChild(shadowWarrior, content);

        contentRef = {
          rootElement: content,
          destroy: () => parentElement.replaceChild(content, shadowWarrior) // 入れ替えたDOMをもとに戻す
        };

        portalData.outletElement.appendChild(content);
      }

      return new MlPortalAttachedRef(
        'DOM', key, attachedOrder, config.animation, contentRef,
        portalData, this._runOutsideNgZone // @ts-ignore
      )._initialize();
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
   * PortalData内をすべて削除する。
   */
  detachAllOfPortalData(portalData: MlPortalData): void {
    const detaches = portalData.detachEvents;
    const len = detaches.length;

    for (let i = 0; i < len; i++) {
      detaches[i]();
    }
  }
}