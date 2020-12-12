import { Directive, ElementRef, Inject, Input, OnChanges } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { listen, ListenTarget, noop, RunOutside, RUN_OUTSIDE } from '@material-lite/angular-cdk/utils';

export interface MlRippleBinder {
  mlRipple?: boolean | '';
  mlRippleOverdrive?: boolean | { width?: number, height?: number };

  mlRippleColor?: string;
  mlRippleTheme?: string;
  mlRippleOpacity?: number;
  mlRippleRadius?: number;
  mlRippleAnimationDuration?: { enter?: number, leave?: number } | number;

  mlRippleTarget?: ListenTarget;
  mlRippleTargetIsOutside?: boolean;

  mlRippleCentered?: boolean;
  mlRippleFixedSize?: boolean;
}

type Binder = MlRippleBinder;

// @dynamic
@Directive({
  selector: '[mlRipple]',
  exportAs: 'mlRipple'
})
export class MlRippleDirective implements OnChanges {
  @Input() set mlRipple(_enable: Binder['mlRipple']) {
    const enable = this.isEnabled = _enable === '' || _enable;
    (enable)
      ? this._needSetPointerdownListener = true
      : this._removePointerdownListener();
  }
  isEnabled?: boolean;

  @Input('mlRippleOverdrive') overdrive: Binder['mlRippleOverdrive'];

  private _hostElement: HTMLElement;
  private _needSetPointerdownListener: boolean;

  private _removePointerdownListener: () => void = noop;

  @Input('mlRippleColor') color: Binder['mlRippleColor'];

  @Input('mlRippleTheme') theme: Binder['mlRippleTheme'];

  @Input('mlRippleOpacity') opacity: Binder['mlRippleOpacity'];

  @Input() set mlRippleAnimationDuration(duration: Binder['mlRippleAnimationDuration']) {
    if (!duration) {
      this.animationDuration = {
        enter: 448,
        leave: 400
      };

    } else if (typeof duration === 'number') {
      const _entryDuration = duration * 0.5;
      this.animationDuration = {
        enter: _entryDuration,
        leave: _entryDuration
      };

    } else {
      const amtDur = this.animationDuration;
      amtDur.enter = (duration.enter) === 0
        ? 0
        : duration.enter || 448;

      amtDur.leave = (duration.leave) === 0
        ? 0
        : duration.leave || 448;
    }
  }
  animationDuration = {
    enter: 448,
    leave: 400
  };

  @Input() set mlRippleTrigger(target: Binder['mlRippleTarget']) {
    this.trigger = target;
    this._needSetPointerdownListener = true;
  }
  trigger?: ListenTarget;

  @Input() mlRippleTargetIsOutside: Binder['mlRippleTargetIsOutside'];

  @Input() mlRippleCentered: Binder['mlRippleCentered'];

  @Input() mlRippleRadius: Binder['mlRippleRadius'];

  @Input() mlRippleFixedSize: Binder['mlRippleFixedSize'];

  private _containerRect: ClientRect | null;

  private _existingRippleCount: number = 0;

  constructor(
    _elementRef: ElementRef,
    @Inject(RUN_OUTSIDE) private _runOutside: RunOutside,
    @Inject(DOCUMENT) private _document: Document
  ) {
    this._hostElement = _elementRef.nativeElement;
    this._hostElement.classList.add('ml-ripple');
  }

  ngOnChanges(): void {
    if (this._needSetPointerdownListener) {
      this._removePointerdownListener();

      const listenTarget = this.trigger || this._hostElement;

      this._runOutside(() => {
        this._removePointerdownListener =
          listen(listenTarget, 'pointerdown',
            (event: PointerEvent) => this._fadeInRipple(listenTarget, this._hostElement, event.clientX, event.clientY)
          );
      });

      this._needSetPointerdownListener = false;
    }
  }

  private _fadeInRipple(listenTarget: ListenTarget, containerElement: HTMLElement, x: number, y: number): void {
    const containerRect = this._containerRect =
      this._containerRect || containerElement.getBoundingClientRect();

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

      let rippleStyle = `transition-duration:${this.animationDuration.enter * 0.4}ms;`;
      (this.theme)
        ? ripple.classList.add(`ml-${this.theme}-bg`)
        : rippleStyle += `background-color: ${this.color || 'currentColor'};`;

      ripple.setAttribute('style', rippleStyle);
      containerElement.appendChild(ripple);

      setTimeout(() => ripple.style.opacity = (this.opacity || 0.12) + '');

      let removePointerupListener: () => void;
      let removePointerleaveListener: () => void;

      const handlerEvent = () => {
        removePointerupListener();
        removePointerleaveListener();
        this._fadeOutRipple(ripple, containerElement);
      };

      removePointerupListener = listen(listenTarget, 'pointerup', handlerEvent);
      removePointerleaveListener = listen(listenTarget, 'pointerleave', handlerEvent);


    } else {
      /** 通常のRippleの処理 */
      ripple.classList.add('ml-ripple-element');

      if (this.mlRippleCentered) {
        x = containerRect.left + containerRect.width * 0.5;
        y = containerRect.top + containerRect.height * 0.5;
      } else if (this.trigger && this.mlRippleTargetIsOutside) {
        const left = ~~containerRect.left;
        const right = ~~containerRect.right;
        x =
          (x < left)
            ? left
            : (x > right)
              ? right
              : x;

        const top = ~~containerRect.top;
        const bottom = ~~containerRect.bottom;
        y =
          (y < top)
            ? top
            : (y > bottom)
              ? bottom
              : y;
      }

      let distance: number;
      if (this.mlRippleRadius) {
        distance = this.mlRippleRadius;
      } else {
        const distX = Math.max(Math.abs(x - containerRect.left), Math.abs(x - containerRect.right));
        const distY = Math.max(Math.abs(y - containerRect.top), Math.abs(y - containerRect.bottom));
        distance = Math.sqrt(distX * distX + distY * distY);
      }

      const size = distance * 2;
      const enterDur = this.animationDuration.enter;
      let rippleStyle: string = `top:${y - containerRect.top - distance}px;left:${x - containerRect.left - distance}px;width:${size}px;height:${size}px;transition-duration:${enterDur}ms;opacity:${this.opacity || 0.12};`;

      (this.theme)
        ? ripple.classList.add(`ml-${this.theme}-bg`)
        : rippleStyle += `background-color: ${this.color || 'currentColor'};`;

      ripple.setAttribute('style', rippleStyle);
      containerElement.appendChild(ripple);

      setTimeout(() => ripple.style.transform = 'scale(1)');

      let listenerEventHasFired: boolean;
      let rippleHasEntered: boolean;

      setTimeout(() => {
        // listenerEventが既に発火されていた場合、fadeOutRipple()を呼び出す
        // されていなかったら、"rippleHasEntered"をtrueにすることで、ripple削除の処理は、eventListenerの方に任せている
        (listenerEventHasFired)
          ? this._fadeOutRipple(ripple, containerElement)
          : rippleHasEntered = true;
      }, enterDur);

      let removePointerupListener: () => void;
      let removePointerleaveListener: () => void;

      const handlerEvent = () => {
        removePointerupListener();
        removePointerleaveListener();

        // rippleが完全にenterされていた場合、fadeOutRipple()を呼び出す
        // されていなかったら、"listenerEventHasFired"をtrueにすることで、ripple削除の処理は、setTimeoutに任せている (つまり、entryされたらすぐにrippleを削除する処理に入る)
        (rippleHasEntered)
          ? this._fadeOutRipple(ripple, containerElement)
          : listenerEventHasFired = true;
      };

      removePointerupListener = listen(listenTarget, 'pointerup', handlerEvent);
      removePointerleaveListener = listen(listenTarget, 'pointerleave', handlerEvent);
    }
  }

  private _fadeOutRipple(rippleElement: HTMLElement, containerElement: HTMLElement): void {
    const leaveTiming = this.animationDuration.leave;

    rippleElement.style.transitionDuration = leaveTiming + 'ms';
    rippleElement.style.opacity = '0';

    setTimeout(() => {
      containerElement.removeChild(rippleElement);

      const count = this._existingRippleCount -= 1;
      if (!(this.mlRippleFixedSize && count)) {
        this._containerRect = null;
      }
    }, leaveTiming);
  }
}
