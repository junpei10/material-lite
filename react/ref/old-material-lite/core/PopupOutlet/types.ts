import { MlObservableFromSubject, MlSubject } from "../../utils/subject";

export interface MlPopupOutletStatus {
  [id: string]: {
    outletRef: HTMLElement;
    backdropRef: HTMLElement;
    contents: JSX.Element[];
    backdropClickHandler: Handler<void>
  }
}

interface Handler<T> {
  subject?: MlSubject<T> | null;
  observable?: MlObservableFromSubject<T> | null;
  removeListener?: (() => void) | null;
}

export interface MlPopupOutletHandler<T> extends Handler<T> {
  usedCount?: number;
}

export interface MlPopupOutletInstanceHandler<T> extends Handler<T> { }