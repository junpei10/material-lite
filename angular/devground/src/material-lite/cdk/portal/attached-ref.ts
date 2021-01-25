import { Observable, PartialObserver, Subject, Subscription } from 'rxjs';
import { RunOutside } from '@material-lite/angular-cdk/utils';
import { MlPortalConfig, MlPortalOutletData, MlPortalContentData } from './outlet.service';

/** @description `AttachedRef class`のconstructorを固定するための引数 */
export type MlPortalAttachedRefArg = [
  outletKey: string | undefined,
  attachedOrder: number,
  attachConfig: any,
  contentData: MlPortalContentData,
  outletData: any,
  _runOutside: RunOutside
];


interface OverwriteObservable<T> extends Observable<T> { subscribe: any; }
interface NoCompleteObservable<T> extends OverwriteObservable<T> {
  subscribe(observer?: PartialObserver<void>): Subscription;
  subscribe(next: null | undefined, error: null | undefined): Subscription;
  subscribe(next: null | undefined, error: (error: any) => void): Subscription;
  subscribe(next: (value: T) => void, error: null | undefined): Subscription;
  subscribe(next?: (value: T) => void, error?: (error: any) => void): Subscription;
}

interface OverwriteSubjectBase<T> extends Subject<T> { complete: never; asObservable(): any; }
type OverwriteSubject<T> = OverwriteSubjectBase<T> & OverwriteObservable<T>;
interface NoCompleteSubject<T> extends OverwriteSubject<T> {
  complete: never;
  asObservable(): NoCompleteObservable<T>;
}

/** @description completeを代入できないように */
interface LifecycleHandler {
  subject?: NoCompleteSubject<void>;
  observable?: NoCompleteObservable<void>;
}

export class MlPortalAttachedRef<D extends MlPortalOutletData = MlPortalOutletData, C extends MlPortalConfig = MlPortalConfig> {
  /** Local handlers */
  private _afterAttachedHandler: LifecycleHandler | null;
  private _beforeDetachedHandler: LifecycleHandler | null;
  private _afterDetachedHandler: LifecycleHandler | null;

  protected _animationConfig: NonNullable<MlPortalConfig['animation']>;
  private _animationTimeout: number;

  constructor(
    public outletKey: string | undefined,
    public attachedOrder: number,
    attachConfig: C,
    public contentData: MlPortalContentData,
    public outletData: D, // Which protected ???
    protected _runOutside: RunOutside,
  ) {
    this._animationConfig = attachConfig.animation || {};
  }

  _init(): this {
    (this._animationConfig.enter)
      ? this._animate('enter', this._afterAttach.bind(this))
      : this._runOutside(() => setTimeout(this._afterAttach.bind(this)));

    this.outletData.detachEvents.push(this._detach.bind(this));

    // @ts-ignore
    if (this.onInit) { this.onInit(); }

    return this;
  }

  private _afterAttach(): void {
    const handler = this._afterAttachedHandler;
    if (handler) {
      this._fireLifecycleSubjectNext(handler.subject!);
    }

    // @ts-ignore
    if (this.afterAttachInit) { this.afterAttachInit(); }
  }

  detach(): void {
    this._detach();
  }

  /** @param destroy DirectiveのngOnDestroy時、処理を変更しないといけない */
  private _detach(destroyedOutlet?: boolean): void {
    const beforeDetachedHandler = this._beforeDetachedHandler;
    if (beforeDetachedHandler) {
      this._fireLifecycleSubjectNext(beforeDetachedHandler.subject!);
    }

    // @ts-ignore
    if (this.onDetachInit) { this.onDetachInit(); }

    if (destroyedOutlet) {
      const dest = this._animationConfig.destroy;
      dest
        ? this._runOutside(() => setTimeout(() => this._afterDetach(), dest))
        : this._afterDetach();

    } else {
      this._animate('leave', () => {
        this.contentData.ref.destroy();
        this._afterDetach();
      });
      this.outletData.detachEvents.splice(this.attachedOrder, 1);
    }
  }
  private _afterDetach(): void {
    const afterDetachedHandler = this._afterDetachedHandler;
    if (afterDetachedHandler) {
      this._fireLifecycleSubjectNext(afterDetachedHandler.subject!);
      this._afterDetachedHandler = null;
    }

    // @ts-ignore
    if (this.afterDetachInit) { this.afterDetachInit(); }

    this._afterAttachedHandler = null;
    this._beforeDetachedHandler = null;
  }


  private _animate(eventType: 'enter' | 'leave', finish: () => any): void {
    const amtConf = this._animationConfig;
    const duration: number | undefined = amtConf[eventType];

    if (!duration) {
      finish();
      return;
    }

    const name = amtConf.className;

    // Nameがない場合、Classを付与する処理をスキップする
    if (name) {
      const classList = this.contentData.rootElement.classList;
      const timeout = this._animationTimeout;
      if (timeout) {
        clearTimeout(timeout);
        classList.remove(name + '-enter-action', name + '-enter-to');
      }

      const eventClass = name + '-' + eventType;
      const eventToClass = eventClass + '-to';
      const eventActionClass = eventClass + '-active';

      classList.add(eventActionClass, eventClass);

      this._runOutside(() => {
        setTimeout(() => {
          classList.remove(eventClass);
          classList.add(eventToClass);

          this._animationTimeout = setTimeout(() => {
            classList.remove(eventToClass, eventActionClass);
            this._animationTimeout = 0;
            finish();
          }, duration) as any;
        }, 10);
      });
    } else {
      this._runOutside(() => setTimeout(finish, duration));
    }
  }

  private _fireLifecycleSubjectNext(subject: LifecycleHandler['subject']): void {
    subject!.next();
    // @ts-ignore
    subject!.observers = null;
    subject!.isStopped = true;
  }

  afterAttached(): NoCompleteObservable<void> {
    let handler = this._afterAttachedHandler;
    if (!handler) { handler = this._afterAttachedHandler = {}; }

    return this._getLifecycleObservable(handler);
  }
  beforeDetached(): NoCompleteObservable<void> {
    let handler = this._beforeDetachedHandler;
    if (!handler) { handler = this._beforeDetachedHandler = {}; }

    return this._getLifecycleObservable(handler);
  }
  afterDetached(): NoCompleteObservable<void> {
    let handler = this._afterDetachedHandler;
    if (!handler) { handler = this._afterDetachedHandler = {}; }

    return this._getLifecycleObservable(handler);
  }
  private _getLifecycleObservable(handler: LifecycleHandler): NoCompleteObservable<void> {
    if (!handler.subject) {
      handler.subject = new Subject() as any;
      handler.observable = handler.subject!.asObservable();
    }

    return handler.observable!;
  }

}

