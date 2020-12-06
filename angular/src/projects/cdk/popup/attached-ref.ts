import { MlPortalConfig, MlPortalAttachedRef, MlPortalContentData, MlPortalOutletData, MlAfterDetachInit, MlOnDetachInit } from '@material-lite/angular-cdk/portal';
import { listen, ListenTarget } from '@material-lite/angular-cdk/utils';
import { Observable, Subject } from 'rxjs';
import { RunOutside } from '@material-lite/angular-cdk/utils';

interface CommonHandler<T> {
  usedCount?: number;
  subject?: Subject<T>;
  observable?: Observable<T>;
  removeListener?: () => void;
}

let KEYDOWN_EVENTS_HANDLER: CommonHandler<KeyboardEvent> = {};

export interface MlPopupConfig extends MlPortalConfig {
  hasBackdrop?: boolean;
}

export interface MlPopupOutletData extends MlPortalOutletData {
  backdrop: {
    listenTarget: ListenTarget;
    style: CSSStyleDeclaration;
    classList: DOMTokenList;
    clickHandler: CommonHandler<void>;
    usedCount: number;
  };
}

export class MlPopupAttachedRef
  extends MlPortalAttachedRef<MlPopupOutletData, MlPopupConfig>
  implements MlOnDetachInit, MlAfterDetachInit {

  private _hasBackdrop: boolean | undefined;
  private _hasFiredBackdropClick: true | undefined;
  private _hasFiredKeydownEvents: true | undefined;

  constructor(
    outletKey: string | undefined,
    attachedOrder: number,
    attachConfig: MlPopupConfig,
    contentData: MlPortalContentData,
    outletData: MlPopupOutletData,
    _runOutside: RunOutside,
  ) {
    contentData.rootElement.classList.add('ml-popup-content');

    super(outletKey, attachedOrder, attachConfig, contentData, outletData, _runOutside);

    const hasBackdrop = this._hasBackdrop = attachConfig.hasBackdrop;
    if (hasBackdrop) {
      const backdropRef = outletData.backdrop;
      backdropRef.usedCount++;

      backdropRef.style.transitionDuration = this._animationConfig?.leave + 'ms';
      backdropRef.classList.add('ml-active');
    }
  }

  onDetachInit(): void {
    this.hasBackdrop = false;
  }

  afterDetachInit(): void {
    if (this._hasFiredBackdropClick) {
      const backdropRef = this.outletData.backdrop;
      const handlerRef = backdropRef.clickHandler;

      const count = handlerRef.usedCount = (handlerRef.usedCount! - 1);
      if (!count) {
        handlerRef.subject!.complete();
        handlerRef.removeListener!();
        backdropRef.clickHandler = {};
      }
    }

    if (this._hasFiredKeydownEvents) {
      const handlerRef = KEYDOWN_EVENTS_HANDLER;

      const count = handlerRef.usedCount = (handlerRef.usedCount! - 1);
      if (!count) {
        handlerRef.subject!.complete();
        handlerRef.removeListener!();
        KEYDOWN_EVENTS_HANDLER = {};
      }
    }
  }

  backdropClick(): Observable<void> {
    const outletData = this.outletData;
    const handlerRef = outletData.backdrop.clickHandler;

    if (!handlerRef.subject) {
      handlerRef.usedCount = 0;
      handlerRef.subject = new Subject();
      handlerRef.observable = handlerRef.subject.asObservable();
      handlerRef.removeListener = listen(outletData.backdrop.listenTarget, 'click', () => {
        handlerRef.subject!.next();
      });
    }

    if (!this._hasFiredBackdropClick) {
      this._hasFiredBackdropClick = true;
      handlerRef.usedCount!++;
    }

    return handlerRef.observable!;
  }

  keydownEvents(): Observable<KeyboardEvent> {
    const handlerRef = KEYDOWN_EVENTS_HANDLER;

    if (!handlerRef.subject) {
      handlerRef.usedCount = 0;
      handlerRef.subject = new Subject();
      handlerRef.observable = handlerRef.subject.asObservable();

      handlerRef.removeListener = listen(window, 'keydown', (event) => {
        handlerRef.subject!.next(event);
      });
    }

    if (!this._hasFiredKeydownEvents) {
      this._hasFiredKeydownEvents = true;
      handlerRef.usedCount!++;
    }

    return handlerRef.observable!;
  }

  set hasBackdrop(enabled: boolean) {
    if (this._hasBackdrop === enabled) { return; }

    this._hasBackdrop = enabled;

    const backdropRef = this.outletData.backdrop;
    (enabled)
      ? backdropRef.usedCount++
      : backdropRef.usedCount--;

    switch (backdropRef.usedCount) {
      case 0:
        backdropRef.style.transitionDuration = this._animationConfig.leave + 'ms';
        backdropRef.classList.remove('ml-active');
        break;
      case 1:
        backdropRef.style.transitionDuration = this._animationConfig.enter + 'ms';
        backdropRef.classList.add('ml-active');
        break;
    }
  }

  set backdropOpacity(value: number) {
    if (!this._hasBackdrop) { return; }
    this.outletData.backdrop.style.opacity = value + '';
  }

  set backdropTransitionDuration(value: number) {
    if (!this._hasBackdrop) { return; }
    this.outletData.backdrop.style.transitionDuration = value + 'ms';
  }
}
