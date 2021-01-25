import { MlNoCompleteObservableFromSubject, MlNoCompleteSubject, MlSubject } from '../utils';
import { MlPortalConfig, MlPortalOutletData, MlPortalContentData } from './outlet-service';

// /** @description `AttachedRef class`のconstructorを固定するための引数 */
// export type MlPortalAttachedRefArg<C, D> = [
//   outletKey: string | undefined,
//   attachedOrder: number,
//   attachConfig: C,
//   contentData: MlPortalContentData,
//   outletData: D,
// ];


/** @description completeを代入できないように */
interface LifecycleHandler {
  subject?: MlNoCompleteSubject<void>;
  observable?: MlNoCompleteObservableFromSubject<void>;
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
  ) {
    this._animationConfig = attachConfig.animation || {};
  }

  _init(): this {
    (this._animationConfig.enter)
      ? this._animate('enter', this._afterAttach.bind(this))
      : setTimeout(this._afterAttach.bind(this));

    this.outletData.detachEvents.push(this._detach.bind(this));

    // @ts-ignore
    if (this.onInit) { this.onInit(); }

    return this;
  }

  private _afterAttach(): void {
    const handler = this._afterAttachedHandler;
    if (handler) {
      const subject = handler.subject!;
      subject.next();
      subject.unsubscribe();
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
      const subject = beforeDetachedHandler.subject!;
      subject.next();
      subject.unsubscribe();
    }

    // @ts-ignore
    if (this.onDetachInit) { this.onDetachInit(); }

    if (destroyedOutlet) {
      const dest = this._animationConfig.destroy;
      dest
        ? setTimeout(() => this._afterDetach(), dest)
        : this._afterDetach();

    } else {
      this._animate('leave', () => {
        this.contentData.destroy();
        this._afterDetach();
      });
      this.outletData.detachEvents.splice(this.attachedOrder, 1);
    }
  }
  private _afterDetach(): void {
    const afterDetachedHandler = this._afterDetachedHandler;
    if (afterDetachedHandler) {
      const subject = afterDetachedHandler.subject!;
      subject.next();
      subject.unsubscribe();
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
        classList.remove(name + '-enter-active', name + '-enter-to');
      }

      const eventClass = name + '-' + eventType;
      const eventToClass = eventClass + '-to';
      const eventActionClass = eventClass + '-active';

      classList.add(eventClass, eventActionClass);

      console.log(classList);

      setTimeout(() => {
        classList.remove(eventClass);
        classList.add(eventToClass);

        this._animationTimeout = setTimeout(() => {
          classList.remove(eventToClass, eventActionClass);
          this._animationTimeout = 0;
          finish();
        }, duration) as any;
      }, 10);

    } else {
      setTimeout(finish, duration);
    }
  }

  afterAttached(): MlNoCompleteObservableFromSubject<void> {
    let handler = this._afterAttachedHandler;
    if (!handler) { handler = this._afterAttachedHandler = {}; }

    return this._getLifecycleObservable(handler);
  }
  beforeDetached(): MlNoCompleteObservableFromSubject<void> {
    let handler = this._beforeDetachedHandler;
    if (!handler) { handler = this._beforeDetachedHandler = {}; }

    return this._getLifecycleObservable(handler);
  }
  afterDetached(): MlNoCompleteObservableFromSubject<void> {
    let handler = this._afterDetachedHandler;
    if (!handler) { handler = this._afterDetachedHandler = {}; }

    return this._getLifecycleObservable(handler);
  }
  private _getLifecycleObservable(handler: LifecycleHandler): MlNoCompleteObservableFromSubject<void> {
    if (!handler.subject) {
      handler.subject = new MlSubject(true) as any;
      handler.observable = handler.subject!.asObservable();
    }

    return handler.observable!;
  }

}

