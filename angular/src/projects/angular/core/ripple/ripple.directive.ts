import { Directive, ElementRef, Inject, Input, OnChanges } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { listen, ListenTarget, noop, RunOutside, RUN_OUTSIDE } from '@material-lite/angular-cdk/utils';

export interface MlRippleBinder {
  mlRipple: boolean | '';
  mlImmediateRipple: boolean;
  mlImmediateRippleBreakpoint: { width?: number, height?: number } | undefined;
  mlRippleColor: string;
  mlRippleTheme: string;
  mlRippleOpacity: number;
  mlRippleAnimationDuration: { enter?: number, leave?: number } | number;
  mlRippleTarget: ListenTarget | ElementRef<ListenTarget>;
  mlRippleTargetIsLargerThanOutlet: boolean;
  mlRippleWrapped: boolean;
  mlRippleCentered: boolean;
  mlRippleRadius: number;
  mlRippleFixedSize: boolean;
}

// @dynamic
@Directive({
  selector: '[mlRipple]'
})
export class MlRippleDirective implements OnChanges {
  @Input() set mlRipple(_enable: MlRippleBinder['mlRipple']) {
    const enable = _enable === '' || _enable;
    (enable)
      ? this._removePointerdownListener()
      : this._needSetPointerdownListener = true;
  }

  @Input() mlImmediateRipple: boolean;
  @Input() mlImmediateRippleBreakpoint: MlRippleBinder['mlImmediateRippleBreakpoint'];

  private _hostElement: HTMLElement;
  private _needSetPointerdownListener: boolean;

  private _removePointerdownListener: () => void = noop;

  @Input() mlRippleColor: string;

  @Input() mlRippleTheme: string;

  @Input() mlRippleOpacity: number;

  @Input() set mlRippleAnimationDuration(duration: MlRippleBinder['mlRippleAnimationDuration']) {
    if (typeof duration === 'number') {
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

  @Input() set mlRippleTarget(target: MlRippleBinder['mlRippleTarget']) {
    this._currListenTarget = (target instanceof ElementRef)
      ? target.nativeElement
      : target;
    this._needSetPointerdownListener = true;
  }
  private _currListenTarget: ListenTarget;

  @Input() mlRippleTargetIsLargerThanOutlet: boolean;

  @Input() set mlRippleWrapped(enable: boolean) {
    let rippleOutletElement = this._rippleOutletElement;
    if (!rippleOutletElement) {
      rippleOutletElement = this._rippleOutletElement =
        this._document.createElement('ml-ripple-outlet');
    }

    if (enable) {
      this._hostElement.appendChild(rippleOutletElement);
    } else if (this._currWrapped) {
      this._hostElement.removeChild(rippleOutletElement);
    }

    this._currWrapped = enable;
    this._needSetPointerdownListener = true;
  }
  private _currWrapped: boolean;
  private _rippleOutletElement: HTMLElement;

  @Input() mlRippleCentered: boolean;

  @Input() mlRippleRadius: number;

  @Input() mlRippleFixedSize: boolean;

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
      const containerElement =
        (this._currWrapped) ? this._rippleOutletElement : this._hostElement;

      const listenTarget = this._currListenTarget || this._hostElement;

      this._runOutside(() => {
        this._removePointerdownListener =
          listen(listenTarget, 'pointerdown',
            (event: PointerEvent) => this._fadeInRipple(listenTarget, containerElement, event.clientX, event.clientY)
          );
      });

      this._needSetPointerdownListener = false;
    }
  }

  private _fadeInRipple(listenTarget: ListenTarget, containerElement: HTMLElement, x: number, y: number): void {
    let enableImmediateRipple: true | undefined;

    /* 通常の`Ripple`か`ImmediateRipple`かを判断する */
    if (this.mlImmediateRipple) {
      const breakpoint = this.mlImmediateRippleBreakpoint;

      /**
       * `Breakpoint`が設定されている場合、コンテンツの大きさを比較し`Breakpoint`より大きかった場合`ImmediateRipple`の処理へ
       * `Breakpoint`が設定されていない場合は`ImmediateRipple`の処理へ
       */
      if (breakpoint) {
        const height = breakpoint.height;
        const width = breakpoint.width;
        if ((height && height > containerElement.offsetHeight) || (width && width > containerElement.offsetWidth)) {
          enableImmediateRipple = true;
        }
      } else {
        enableImmediateRipple = true;
      }
    }

    const ripple: HTMLElement = this._document.createElement('div');

    /**
     * ここから、通常の`Ripple`と`immediateRipple`の２種類の処理に分岐する。
     * 共通の処理は存在するが、スコープ汚染やコードの可読性を考えて、処理をまとめていない。
     */
    if (enableImmediateRipple) {
      ripple.classList.add('ml-immediate-ripple');

      let rippleStyle = `transition-duration:${this._currAmtDuration.enter * 0.5}ms;`;
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
      const containerRect = this._containerRect =
        this._containerRect || containerElement.getBoundingClientRect();

      if (this.mlRippleCentered) {
        x = containerRect.left + containerRect.width * 0.5;
        y = containerRect.top + containerRect.height * 0.5;
      } else if (this._currListenTarget || !this.mlRippleTargetIsLargerThanOutlet) {
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

      const enterDuration = this._currAmtDuration.enter;

      ripple.classList.add('ml-ripple-element');
      let rippleStyle = `top: ${y - containerRect.top - distance}px;left:${x - containerRect.left - distance}px;width:${size}px;height:${size}px;transition-duration:${enterDuration}ms;opacity:${this.mlRippleOpacity || 0.12};`;

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