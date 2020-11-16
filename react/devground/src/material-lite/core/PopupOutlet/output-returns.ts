import { listen } from '../../utils/listen';
import { MlSubject } from '../../utils/subject';
import { MlPopupOutletHandler as Handler, MlPopupOutletStatus } from './types';

export class MlPopupOutputReturns {
  private _hasFiredKeydownEvents: undefined | true;


  /** @description メンバ変数(index)が変更される恐れがあるため、constructor時に変数を定義しておく */
  private _teardown: () => void;

  constructor(
    public id: string,
    public index: number,
    private _data: MlPopupOutletStatus[number],
    private _keydownEventsHandler: Handler<KeyboardEvent>
  ) { this._teardown = () => _data.contents.splice(index, 1) }


  close(): void {
    const _clearHandler = clearHandler;

    // const BC_HandlerRef = this._backdropClickHandler;
    // if (BC_HandlerRef.subject) {
    //   _clearHandler(BC_HandlerRef);
    // }

    // if (this._hasFiredKeydownEvents) {
    //   const KE_HandlerRef = this._keydownEventsHandler;
    //   KE_HandlerRef.usedCount--;
    //   if (!KE_HandlerRef.usedCount) {
    //     _clearHandler(KE_HandlerRef);
    //   }
    // }
  }

  backdropClick(): Handler<void>['observable'] {
    const handlerRef = this._data.backdropClickHandler;

    if (!handlerRef.subject) {
      handlerInit(handlerRef);

      handlerRef.removeListener = listen(this._data.backdropRef, 'click', () => {
        // @ts-ignore: Non-nullable
        handlerRef.subject.next();
      })
    }

    return handlerRef.observable;
  }

  keydownEvents(): Handler<KeyboardEvent>['observable'] {
    const handlerRef = this._keydownEventsHandler;

    // if (!this._hasFiredKeydownEvents) {
    //   this._hasFiredKeydownEvents = true;
    //   handlerRef.usedCount++;
    // }

    if (!handlerRef.subject) {
      handlerInit(handlerRef);

      handlerRef.removeListener = listen(window, 'keydown', (event) => {
        // @ts-ignore: Non-nullable
        handlerRef.subject.next(event);
      })
    }

    return handlerRef.observable;
  }
}

const clearHandler = (handler: Handler<any>) => {
  // @ts-ignore: Non-nullable
  handler.subject.complete();
  handler.subject = null;

  handler.observable = null;

  // @ts-ignore: Non-nullable
  handler.removeListener();
  handler.removeListener = null;
}

const handlerInit = (handler: Handler<any>) => {
  handler.usedCount = 0;

  handler.subject = new MlSubject();

  handler.observable = handler.subject.asObservable();
}