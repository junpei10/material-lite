import { Observable, Observer, Subject, Subscription } from 'rxjs';

interface OverwriteObservable<T> extends Observable<T> { subscribe: any; }
export interface NoCompleteObservable<T> extends OverwriteObservable<T> {
  subscribe(observer?: Observer<T>): Subscription;
  subscribe(next: null | undefined, error: null | undefined): Subscription;
  subscribe(next: null | undefined, error: (error: any) => void): Subscription;
  subscribe(next: (value: T) => void, error: null | undefined): Subscription;
  subscribe(next?: (value: T) => void, error?: (error: any) => void): Subscription;
}

interface OverwriteSubjectBase<T> extends Subject<T> { complete: never; asObservable(): any; }
type OverwriteSubject<T> = OverwriteSubjectBase<T> & OverwriteObservable<T>;
export interface NoCompleteSubject<T> extends OverwriteSubject<T> {
  complete: never;
  asObservable(): NoCompleteObservable<T>;
}

export type LifecycleSubjectRef<T extends string> = {
  [key in T]: NoCompleteSubject<void>
} | {[key: string]: undefined};

export type LifecycleSubjectNextor<T extends string> = {
  [key in T]: () => void;
};

export type LifecycleObservableGetter<T extends string> = {
  [key in T]: () => NoCompleteObservable<T>;
};

export type lifecycleControllersFactory<T extends string> =
  () => [LifecycleSubjectNextor<T>, LifecycleObservableGetter<T>];

// tslint:disable:only-arrow-functions

/**
 * 使用される`subject`のみ作成し、無駄な`subject`を作らないようにするのを操作するクラス(２つ)を作成し、その各クラスからインスタンスを作成し配列として提供する関数自体を作る関数。
 *
 * 主な役割は、クラスを作ること。
 *
 * @returns 内部に作成した２つのクラスに、共通のSubjectの参照をもたせたインスタンスを配列にして返す関数。
 * - [0] Nextor(造語)。`subject.next()`を呼び出し、`subject`を閉じる関数をまとめたオブジェクト。`private`変数推奨。
 * - [1] Getter。`subject.asObservable()`を返す関数をまとめたオブジェクト。`public`変数推奨。
 *
 * @returnsNaming
 * `material-lite`では、Reactっぽく `const useLifecycle = createLifecycleControllersFactory(...);`として使っている。
 */
export function createLifecycleControllersFactory<T extends string>(...keys: T[]): lifecycleControllersFactory<T> {
  class SubjectNextor {
    constructor(public subjectRef: LifecycleSubjectRef<T>) {}
  }

  class ObservableGetter {
    constructor(private _subjectRef: LifecycleSubjectRef<T>) {}
  }

  const subjectNextorProtoRef = SubjectNextor.prototype;
  const observableGetterProtoRef = ObservableGetter.prototype;

  const len = keys.length;
  for (let i = 0; i < len; i++) {
    const key = keys[i];
    // @ts-ignore
    subjectNextorProtoRef[key] = function(): void {
      // @ts-ignore
      const subject = this.subjectRef[key];

      if (!subject) { return; }

      callLifecycleSubjectNext(subject);
    };

    // @ts-ignore
    observableGetterProtoRef[key] = function(): NoCompleteObservable<void> {
      // @ts-ignore
      let subject = this._subjectRef[key];

      if (!subject) {
        // @ts-ignore
        subject = this._subjectRef[key] = new Subject();
      }

      return subject!.asObservable() as any;
    };
  }

  return () => {
    const subjectRef = {};
    return [new SubjectNextor(subjectRef), new ObservableGetter(subjectRef)] as any;
  };
}
// tslint:enabled:only-arrow-functions

export const callLifecycleSubjectNext = (subject: NoCompleteSubject<void>) => {
  subject.next();
  // @ts-ignore
  subject.observers = null;
  subject.isStopped = true;
};
