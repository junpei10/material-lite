import { noop } from './noop';

export interface MlObserver<T> {
  next: (value: T) => void;
  complete: () => void;
}

export class MlSubject<T> {

  isStopped: boolean = false;

  observers: MlObserver<T>[] = [];

  constructor(public noComplete?: boolean) { }

  next(value?: T): void {
    if (this.isStopped) { return; }
    const copy = this.observers.slice();
    const len = copy.length;
    for (let i = 0; i < len; i = (i + 1) | 0) {
      copy[i].next(value as any); // Non-nullable
    }
  }

  complete(): void {
    if (this.isStopped) { return; }
    this.isStopped = true;
    const { observers } = this;

    const len = observers.length;
    for (let i = 0; i < len; i = (i + 1) | 0) {
      // @ts-ignore: Non-nullable
      observers.shift().complete();
    }
  }

  subscribe(next?: (value: T) => void, complete?: () => void): MlSubscription {
    const { observers } = this;

    const subscription = new MlSubscription(() => observers.splice(observers.length, 1));

    observers.push({
      next: next || noop,
      complete: this.noComplete
        ? noop
        : complete
          ? () => { subscription.closed = true; complete(); }
          : () => { subscription.closed = true; }
    });

    return subscription;
  }

  unsubscribe(): void {
    this.isStopped = true;
    // @ts-ignore: GC
    this.observers = null;
  }

  asObservable(): MlObservableFromSubject<T> {
    return new MlObservableFromSubject<T>(this);
  }
}

export class MlSubscription {
  closed: boolean = false;

  constructor(private _teardown: () => void) { }

  unsubscribe(): void {
    if (this.closed) { return; }
    this.closed = true;
    this._teardown();
  }
}

export class MlObservableFromSubject<T> {
  constructor(private _source: MlSubject<T>) { }

  subscribe(next?: (value: T) => void, complete?: () => void): MlSubscription {
    return this._source.subscribe(next, complete);
  }
}

interface OverwriteObservableFromSubject<T> extends MlObservableFromSubject<T> { subscribe: any; }
export interface MlNoCompleteObservableFromSubject<T> extends OverwriteObservableFromSubject<T> {
  subscribe(next?: () => void): MlSubscription;
}

interface OverwriteSubjectBase<T> extends MlSubject<T> { complete: never; asObservable(): any; }
type OverwriteSubject<T> = OverwriteSubjectBase<T> & OverwriteObservableFromSubject<T>;
export interface MlNoCompleteSubject<T> extends OverwriteSubject<T> {
  complete: never;
  asObservable(): MlNoCompleteObservableFromSubject<T>;
}