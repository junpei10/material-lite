import { NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { listen } from '../../utils/listen';
import { MlPopupClearHandler, MlPopupGlobalHandler, MlPopupInstanceHandler } from './handler';
import { ML_OUTLET_DATA_STORAGE } from './outlet-data-storage';
import { MlPopupAnimationConfig, MlPopupContentData } from './types';


/** Common handler */
const keydownEventsHandler: MlPopupGlobalHandler<KeyboardEvent> = {};

export class MlPopupOutputReturns {
  /** Common handlers */
  private _hasFiredKeydownEvents: true | undefined;
  private _hasFiredBackdropClick: true | undefined;

  /** Local handlers */
  private _afterOpenedHandler: MlPopupInstanceHandler<void> = {};
  private _beforeClosedHandler: MlPopupInstanceHandler<void> = {};
  private _afterClosedHandler: MlPopupInstanceHandler<void> = {};

  constructor(
    public outletKey: string,
    public outputOrder: number,
    public contentData: MlPopupContentData,
    public animationConfig: MlPopupAnimationConfig,
    private _ngZone: NgZone,
    private _hasBackdrop: boolean,
    private _outletData: ML_OUTLET_DATA_STORAGE[number],
  ) {
    if (_hasBackdrop) {
      const backdropRef = _outletData.backdrop;
      backdropRef.usedCount++;

      backdropRef.style.transitionDuration = animationConfig.leave + 'ms';
      backdropRef.classList.remove('active');
    }

    this._outletData.closeEvents.push(this.close.bind(this));
    this._animate('enter', () => this._afterOpenedHandler.subject?.next());
  }

  close(): void {
    const beforeClosedHandler = this._beforeClosedHandler;

    if (beforeClosedHandler.subject) {
      beforeClosedHandler.subject.next();
      MlPopupClearHandler.instance(beforeClosedHandler);
    }

    this.hasBackdrop = false;

    this._outletData.closeEvents.splice(this.outputOrder, 1);

    this._animate('leave', this._close.bind(this));
  }

  private _close(): void {
    this.contentData.ref.destroy();

    const clearHandler = MlPopupClearHandler;

    if (this._hasFiredKeydownEvents) {
      clearHandler.global(keydownEventsHandler);
    }

    if (this._hasFiredBackdropClick) {
      clearHandler.global(this._outletData.backdrop.clickHandler);
    }

    const afterClosedHandler = this._afterClosedHandler;
    if (afterClosedHandler.subject) {
      afterClosedHandler.subject.next();
      clearHandler.instance(afterClosedHandler);
    }

    const afterOpenedHandler = this._afterOpenedHandler;
    if (afterOpenedHandler.subject) {
      clearHandler.instance(afterOpenedHandler);
    }
  }

  private _animate(type: 'enter' | 'leave', finalEvent: () => any): void {
    const animationConfig: MlPopupAnimationConfig & { timeout?: number; }
      = this.animationConfig as any;
    const duration = animationConfig[type];

    if (!duration) {
      finalEvent();
      return;
    }

    const name = animationConfig.className;

    // nameが存在する場合は、classAnimation
    if (name) {
      const eventClass = name + '-' + type;
      const eventToClass = eventClass + '-to';
      const eventActionClass = eventClass + '-action';

      // Reference: https://jp.vuejs.org/images/transition.png
      this._ngZone.runOutsideAngular(() => {
        const classList = this.contentData.rootElement.classList;

        classList.add(eventActionClass, eventClass);
        setTimeout(() => {
          if (animationConfig.timeout) {
            clearTimeout(animationConfig.timeout);
            classList.remove(name + '-enter-action', name + '-enter-to');
          }

          classList.remove(eventClass);
          classList.add(eventToClass);

          animationConfig.timeout = setTimeout(() => {
            classList.remove(eventToClass, eventActionClass);
            animationConfig.timeout = 0;
            finalEvent();
          }, duration) as any;
        });
      });

    } else {
      this._ngZone.runOutsideAngular(() => setTimeout(() => finalEvent, duration));
    }
  }

  backdropClick(): Observable<void> {
    const outletData = this._outletData;
    const handlerRef = outletData.backdrop.clickHandler;

    if (!handlerRef.subject) {
      handlerRef.usedCount = 0;
      handlerRef.subject = new Subject();
      handlerRef.observable = handlerRef.subject.asObservable();
      handlerRef.removeListener = listen(outletData.backdrop.listener, 'click', () => {
        // @ts-ignore: Non-nullable
        handlerRef.subject.next();
      });
    }

    if (!this._hasFiredBackdropClick) {
      this._hasFiredBackdropClick = true;
      // @ts-ignore
      handlerRef.usedCount++;
    }

    return handlerRef.observable as any; // Non-nullable
  }

  keydownEvents(): Observable<KeyboardEvent> {
    const handlerRef = keydownEventsHandler;

    if (!handlerRef.subject) {
      handlerRef.usedCount = 0;
      handlerRef.subject = new Subject();
      handlerRef.observable = handlerRef.subject.asObservable();

      handlerRef.removeListener = listen(window, 'keydown', (event) => {
        // @ts-ignore: Non-nullable
        handlerRef.subject.next(event);
      });
    }

    if (!this._hasFiredKeydownEvents) {
      this._hasFiredKeydownEvents = true;
      // @ts-ignore: Non-nullable
      handlerRef.usedCount++;
    }

    return handlerRef.observable as any;
  }

  afterOpened(): Observable<void> {
    return this._getInstanceHandlerObservable(this._afterOpenedHandler);
  }

  beforeClosed(): Observable<void> {
    return this._getInstanceHandlerObservable(this._beforeClosedHandler);
  }

  afterClosed(): Observable<void> {
    return this._getInstanceHandlerObservable(this._afterClosedHandler);
  }

  private _getInstanceHandlerObservable<T>(handler: MlPopupInstanceHandler<T>): Observable<T> {
    if (!handler.subject) {
      handler.subject = new Subject();
      handler.observable = handler.subject.asObservable();
    }

    return handler.observable as any;
  }

  set hasBackdrop(enabled: boolean) {
    if (this._hasBackdrop === enabled) { return; }

    this._hasBackdrop = enabled;

    const backdropRef = this._outletData.backdrop;
    (enabled)
      ? backdropRef.usedCount++
      : backdropRef.usedCount--;

    switch (backdropRef.usedCount) {
      case 0:
        backdropRef.style.transitionDuration = this.animationConfig.leave + 'ms';
        backdropRef.classList.remove('active');
        break;
      case 1:
        backdropRef.style.transitionDuration = this.animationConfig.enter + 'ms';
        backdropRef.classList.add('active');
        break;
    }
  }

  set backdropOpacity(value: number) {
    if (!this._hasBackdrop) { return; }
    this._outletData.backdrop.style.opacity = value + '';
  }

  set backdropTransitionDuration(value: string) {
    if (!this._hasBackdrop) { return; }
    this._outletData.backdrop.style.transitionDuration = value;
  }
}

