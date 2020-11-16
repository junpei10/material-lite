import { Observable, Subject } from 'rxjs';

interface Handler<T> {
  subject?: Subject<T> | null;
  observable?: Observable<T> | null;
  removeListener?: (() => void) | null;
}
export interface MlPopupGlobalHandler<T> extends Handler<T> {
  usedCount?: number;
}
export type MlPopupInstanceHandler<T> = Handler<T>;


export interface MlPopupClearHandler {
  global<T>(handler: MlPopupGlobalHandler<T>): void;
  instance<T>(handler: MlPopupInstanceHandler<T>): void;
}
export const MlPopupClearHandler: MlPopupClearHandler = {
  global(handler): void {
    // @ts-ignore: Non-nullable
    handler.usedCount--;

    if (!handler.usedCount) {
      this.instance(handler);
    }

    // @ts-ignore: Non-nullable
    handler.removeListener();
    handler.removeListener = null;
  },

  instance(handler): void {
    // @ts-ignore: Non-nullable
    handler.subject.unsubscribe();
    handler.subject = null;

    handler.observable = null;
  }
};
