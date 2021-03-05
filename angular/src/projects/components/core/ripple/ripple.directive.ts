import { Directive, ElementRef, Inject, Input, OnChanges } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { listen, ListenTarget, noop, RunOutside, RUN_OUTSIDE } from '@material-lite/angular-cdk/utils';

export interface MlRippleBinder {
  mlRipple?: boolean | '';
  overdrive?: {
    width?: number,
    height?: number
  } | boolean;

  color?: string;
  theme?: string;
  opacity?: number;
  radius?: number;
  duration?: {
    enter?: number,
    leave?: number
  } | number;

  trigger?: ListenTarget;
  triggerIsOutside?: boolean;

  centered?: boolean;
}

type Binder = MlRippleBinder;
type FadeInRippleConfig = { [P in Exclude<keyof Binder, 'mlRipple'>]?: Binder[P] };

// @dynamic
@Directive({
  selector: '[mlRipple]',
  exportAs: 'mlRipple'
})
export class MlRippleDirective implements OnChanges {
  @Input() private set mlRipple(_enable: Binder['mlRipple']) {
    const enable = this.isEnabled = _enable === '' || _enable;
    (enable)
      ? this._needSetPointerdownListener = true
      : this._removePointerdownListener();
  }
  isEnabled: boolean | undefined;

  @Input('mlRippleOverdrive') overdrive: Binder['overdrive'];

  private _containerElement: Element;
  private _needSetPointerdownListener: boolean;

  private _removePointerdownListener: () => void = noop;

  @Input('mlRippleColor') color: Binder['color'];

  @Input('mlRippleTheme') theme: Binder['theme'];

  @Input('mlRippleOpacity') opacity: Binder['opacity'] = 0.12;

  @Input() set mlRippleDuration(duration: Binder['duration']) {
    if (!duration) {
      this.enterDuration = 448;
      this.leaveDuration = 400;

    } else if (typeof duration === 'number') {
      const dur = duration * 0.5;
      this.enterDuration = dur;
      this.leaveDuration = dur;

    } else {
      const enterDur = this.enterDuration;
      this.enterDuration = (enterDur) === 0
        ? 0
        : enterDur || 448;

      const leaveDur = this.leaveDuration;
      this.leaveDuration = (leaveDur) === 0
        ? 0
        : leaveDur || 448;
    }
  }
  @Input('mlRippleDuration.enter') enterDuration?: number = 448;
  @Input('mlRippleDuration.leave') leaveDuration?: number = 400;

  @Input() private set mlRippleTrigger(target: Binder['trigger']) {
    this.trigger = target;
    this._needSetPointerdownListener = true;
  }
  trigger: Binder['trigger'];

  @Input('mlRippleTriggerIsOutside') triggerIsOutside: Binder['triggerIsOutside'];

  @Input('mlRippleCentered') centered: Binder['centered'];

  @Input('mlRippleRadius') radius: Binder['radius'];

  private _containerRect: ClientRect | null;

  private _existingRippleCount: number = 0;

  constructor(
    _elementRef: ElementRef<Element>,
    @Inject(RUN_OUTSIDE) private _runOutside: RunOutside,
    @Inject(DOCUMENT) private _document: Document
  ) {
    const hostEl = _elementRef.nativeElement;

    this._containerElement = hostEl;

    hostEl.classList.add('ml-ripple');
  }

  ngOnChanges(): void {
    if (this._needSetPointerdownListener && this.isEnabled) {
      this._removePointerdownListener();

      const listenTarget = this.trigger || this._containerElement;

      this._runOutside(() => {
        this._removePointerdownListener =
          listen(listenTarget, 'pointerdown',
            (event: PointerEvent) => this._fadeInRipple(listenTarget, event.clientX, event.clientY)
          );
      });

      this._needSetPointerdownListener = false;
    }
  }

  // インスタンスから起動させるとき用
  // tslint:disable-next-line:max-line-length
  fadeInRipple(listenTarget: ListenTarget, x: number, y: number, config: FadeInRippleConfig = {}): void {
    this._fadeInRipple.bind(config)(listenTarget, x, y);
  }

  private _fadeInRipple(listenTarget: ListenTarget, x: number, y: number): void {
    const containerEl = this._containerElement;
    const containerRect = this._containerRect =
      this._containerRect || containerEl.getBoundingClientRect();
    this._existingRippleCount++;

    let overdrive = this.overdrive;
    /* 通常の`Ripple`か`overdrive`かを判断する */
    if (overdrive && overdrive !== true) {
      const height = overdrive.height;
      const width = overdrive.width;
      overdrive = !!((height && height <= containerRect.height) || (width && width <= containerRect.width));
    }

    const ripple: HTMLElement = this._document.createElement('div');

    if (overdrive) {
      /** Overdrive の処理 */
      ripple.classList.add('ml-ripple-overdrive');

      let rippleStyle = `transition-duration:${(this.enterDuration || 448) * 0.4}ms;`;
      (this.theme)
        ? ripple.classList.add(`ml-${this.theme}-bg`)
        : rippleStyle += `background-color: ${this.color || 'currentColor'};`;

      ripple.setAttribute('style', rippleStyle);
      containerEl.appendChild(ripple);

      setTimeout(() => ripple.style.opacity = (this.opacity || 0.12) + '');

      let removePointerupListener: () => void;
      let removePointerleaveListener: () => void;

      const handlerEvent = () => {
        removePointerupListener();
        removePointerleaveListener();
        this._fadeOutRipple(ripple);
      };

      removePointerupListener = listen(listenTarget, 'pointerup', handlerEvent);
      removePointerleaveListener = listen(listenTarget, 'pointerleave', handlerEvent);


    } else {
      /** 通常のRippleの処理 */
      ripple.classList.add('ml-ripple-element');

      if (this.centered) {
        x = containerRect.left + containerRect.width * 0.5;
        y = containerRect.top + containerRect.height * 0.5;
      } else if (this.trigger && this.triggerIsOutside) {
        const left = containerRect.left;
        const right = containerRect.right;
        x =
          (x < left)
            ? left
            : (x > right)
              ? right
              : x;

        const top = containerRect.top;
        const bottom = containerRect.bottom;
        y =
          (y < top)
            ? top
            : (y > bottom)
              ? bottom
              : y;
      }

      let distance: number;
      // distanceの代入処理。radiusが代入されていないときは求める。
      if (this.radius) {
        distance = this.radius;
      } else {
        const distX = Math.max(Math.abs(x - containerRect.left), Math.abs(x - containerRect.right));
        const distY = Math.max(Math.abs(y - containerRect.top), Math.abs(y - containerRect.bottom));
        distance = Math.sqrt(distX * distX + distY * distY);
      }

      const enterDur = this.enterDuration || 448;
      const size = distance * 2;
      let rippleStyle: string = `top:${y - containerRect.top - distance}px;left:${x - containerRect.left - distance}px;width:${size}px;height:${size}px;transition-duration:${enterDur}ms;opacity:${this.opacity || 0.12};`;

      (this.theme)
        ? ripple.classList.add(`ml-${this.theme}-bg`)
        : rippleStyle += `background-color: ${this.color || 'currentColor'};`;

      ripple.setAttribute('style', rippleStyle);
      containerEl.appendChild(ripple);

      setTimeout(() => ripple.style.transform = 'scale(1)');

      let listenerEventHasFired: boolean;
      let rippleHasEntered: boolean;

      setTimeout(() => {
        // listenerEventが既に発火されていた場合、fadeOutRipple()を呼び出す
        // されていなかったら、"rippleHasEntered"をtrueにすることで、ripple削除の処理は、eventListenerの方に任せている
        (listenerEventHasFired)
          ? this._fadeOutRipple(ripple)
          : rippleHasEntered = true;
      }, enterDur);

      let removePointerupListener: () => void;
      let removePointerleaveListener: () => void;

      const handlerEvent = () => {
        removePointerupListener();
        removePointerleaveListener();

        // rippleが完全にenterされていた場合、fadeOutRipple()を呼び出す。
        // されていなかったら、"listenerEventHasFired"をtrueにすることで、ripple削除の処理は、setTimeoutに任せている (つまり、entryされたらすぐにrippleを削除する処理に入る)
        (rippleHasEntered)
          ? this._fadeOutRipple(ripple)
          : listenerEventHasFired = true;
      };

      removePointerupListener = listen(listenTarget, 'pointerup', handlerEvent);
      removePointerleaveListener = listen(listenTarget, 'pointerleave', handlerEvent);
    }
  }

  private _fadeOutRipple(rippleElement: HTMLElement): void {
    const leaveTiming = this.leaveDuration || 400;

    rippleElement.style.transitionDuration = leaveTiming + 'ms';
    rippleElement.style.opacity = '0';

    setTimeout(() => {
      this._containerElement.removeChild(rippleElement);

      const count = this._existingRippleCount -= 1;
      if (count === 0) {
        this._containerRect = null;
      }
    }, leaveTiming);
  }
}
