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
  selector: '[mlRipple]'
})
export class MlRippleDirective implements OnChanges {
  @Input() set mlRipple(_enable: Binder['mlRipple']) {
    const enable = _enable === '' || _enable;
    (enable)
      ? this._needSetPointerdownListener = true
      : this._removePointerdownListener();
  }

  @Input() mlRippleOverdrive: Binder['mlRippleOverdrive'];

  private _hostElement: HTMLElement;
  private _needSetPointerdownListener: boolean;

  private _removePointerdownListener: () => void = noop;

  @Input() mlRippleColor: Binder['mlRippleColor'];

  @Input() mlRippleTheme: Binder['mlRippleTheme'];

  @Input() mlRippleOpacity: Binder['mlRippleOpacity'];

  @Input() set mlRippleAnimationDuration(duration: Binder['mlRippleAnimationDuration']) {
    if (!duration) {
      this._currAmtDuration = {
        enter: 450,
        leave: 400
      };
    } else if (typeof duration === 'number') {
      const _entryDuration = duration * 0.5;
      this._currAmtDuration = {
        enter: _entryDuration,
        leave: _entryDuration
      };
    } else {
      const _amtDuration = this._currAmtDuration;
      if (duration.enter) { _amtDuration.enter = duration.enter; }
      if (duration.leave) { _amtDuration.leave = duration.leave; }
    }
  }
  private _currAmtDuration = {
    enter: 450,
    leave: 400
  };

  @Input() set mlRippleTarget(target: Binder['mlRippleTarget']) {
    this._currListenTarget = target;
    this._needSetPointerdownListener = true;
  }
  private _currListenTarget?: ListenTarget;

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

      const listenTarget = this._currListenTarget || this._hostElement;

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

    let overdrive = this.mlRippleOverdrive;
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

      let rippleStyle = `transition-duration:${this._currAmtDuration.enter * 0.4}ms;`;
      (this.mlRippleTheme)
        ? ripple.classList.add(`ml-${this.mlRippleTheme}-bg`)
        : rippleStyle += `background-color: ${this.mlRippleColor || 'currentColor'};`;

      ripple.setAttribute('style', rippleStyle);
      containerElement.appendChild(ripple);

      setTimeout(() => ripple.style.opacity = (this.mlRippleOpacity || 0.12) + '');

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

      const enterDuration = this._currAmtDuration.enter;

      if (this.mlRippleCentered) {
        x = containerRect.left + containerRect.width * 0.5;
        y = containerRect.top + containerRect.height * 0.5;
      } else if (this._currListenTarget && this.mlRippleTargetIsOutside) {
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
      let rippleStyle: string = `top:${y - containerRect.top - distance}px;left:${x - containerRect.left - distance}px;width:${size}px;height:${size}px;transition-duration:${this._currAmtDuration.enter}ms;opacity:${this.mlRippleOpacity || 0.12};`;

      (this.mlRippleTheme)
        ? ripple.classList.add(`ml-${this.mlRippleTheme}-bg`)
        : rippleStyle += `background-color: ${this.mlRippleColor || 'currentColor'};`;

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
      }, enterDuration);

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
    const leaveTiming = this._currAmtDuration.leave;

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
