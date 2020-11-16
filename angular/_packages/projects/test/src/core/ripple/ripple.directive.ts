import { Directive, ElementRef, Inject, Input, NgZone, OnChanges } from '@angular/core';
import { noop } from '../../utils/noop';
import { MlThemeStyle, MlTheming } from '../../theming';
import { DOCUMENT } from '@angular/common';
import { listen } from '../../utils/listen';

const STYLE: MlThemeStyle = {
  base: '.ml-ripple{position:relative;overflow:hidden;user-select:none;}.ml-ripple-element{will-change:opacity,transform;transform:scale(0);transition-property:opacity,transform;transition-timing-function:cubic-bezier(0,0,.2,1);position:absolute;border-radius:50%;pointer-events:none;}.ml-immediate-ripple{will-change:opacity;opacity:0;transition-property:opacity;transition-timing-function:cubic-bezier(0,0,.2,1);position:absolute;top:0;left:0;width:100%;height:100%;border-radius:0;pointer-events:none;}ml-ripple-outlet{width:100%;height:100%;position:absolute;top:0;left:0;overflow:hidden;pointer-events:none;}'
};

@Directive({
  selector: '[mlRipple]'
})
export class MlRippleDirective implements OnChanges {
  @Input() set mlRipple(_enable: boolean | '') {
    const enable = _enable === '' || _enable;
    (enable)
      ? this._removePointerdownListener()
      : this._needSetPointerdownListener = true;
  }

  @Input() mlImmediateRipple: boolean;
  @Input() mlImmediateRippleBreakpoint: { width?: number, height?: number } | undefined;

  private _hostElement: HTMLElement;

  private _removePointerdownListener: () => void = noop;
  private _needSetPointerdownListener: boolean;

  @Input() mlRippleColor: string;

  @Input() mlRippleTheme: string;

  @Input() mlRippleOpacity: number;

  @Input() set mlRippleAnimationDuration(duration: { enter?: number, leave?: number } | number) {
    if (typeof duration === 'number') {
      const _entryDuration = duration * 0.5;
      this._amtDuration = {
        enter: _entryDuration,
        leave: _entryDuration
      };
    } else {
      const _amtDuration = this._amtDuration;
      if (duration.enter) { _amtDuration.enter = duration.enter; }
      if (duration.leave) { _amtDuration.leave = duration.leave; }
    }
  }
  private _amtDuration = {
    enter: 450,
    leave: 400
  };

  @Input() set mlRippleTarget(target: EventTarget) {
    this._target = target;
    this._needSetPointerdownListener = true;
  }
  private _target: EventTarget;

  @Input() mlRippleTargetIsLargerThanOutlet: boolean;

  @Input() set mlRippleTrigger(trigger: { nativeElement: HTMLElement }) {
    this._target = trigger.nativeElement;
    this._needSetPointerdownListener = true;
  }

  @Input() set mlRippleWrapped(enable: boolean) {
    let rippleOutletElement = this._rippleOutletElement;
    if (!rippleOutletElement) {
      rippleOutletElement = this._rippleOutletElement =
        this._document.createElement('ml-ripple-outlet');
    }

    if (enable) {
      this._hostElement.appendChild(rippleOutletElement);
    } else if (this._wrapped) {
      this._hostElement.removeChild(rippleOutletElement);
    }

    this._wrapped = enable;
    this._needSetPointerdownListener = true;
  }
  private _wrapped: boolean;
  private _rippleOutletElement: HTMLElement;

  @Input() mlRippleCentered: boolean;

  @Input() mlRippleRadius: number;

  @Input() mlRippleFixedSize: boolean;

  /** @description Cache */
  private _containerRect: ClientRect | null;

  private _existingRippleCount: number = 0;

  constructor(
    _elementRef: ElementRef,
    private _ngZone: NgZone,
    @Inject(DOCUMENT) private _document: Document
  ) {
    MlTheming.setStyle(STYLE);
    this._hostElement = _elementRef.nativeElement;
    this._hostElement.classList.add('ml-ripple');
  }

  ngOnChanges(changes: any): void {
    console.log(changes);

    if (this._needSetPointerdownListener) {
      this._setPointerdownListener();
      this._needSetPointerdownListener = false;
    }
  }

  private _setPointerdownListener(): void {
    this._removePointerdownListener();

    const containerElement =
      (this._wrapped) ? this._rippleOutletElement : this._hostElement;

    const eventTarget = this._target || this._hostElement;

    this._ngZone.runOutsideAngular(() => {
      this._removePointerdownListener =
        listen(eventTarget, 'pointerdown',
          (event: PointerEvent) => this._fadeInRipple(eventTarget, containerElement, event.clientX, event.clientY)
        );
    });
  }

  private _fadeInRipple(eventTarget: EventTarget, containerElement: HTMLElement, x: number, y: number): void {
    let enableImmediateRipple: true | undefined;

    /** 通常の`Ripple`か`ImmediateRipple`かを判断する */
    if (this.mlImmediateRipple) {
      const breakpoint = this.mlImmediateRippleBreakpoint;

      /**
       * `Breakpoint`が設定されている場合、コンテンツの大きさを比較し`Breakpoint`より大きかった場合`ImmediateRipple`の処理へ。
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

      let rippleStyle = `transition-duration:${this._amtDuration.enter * 0.5}ms;`;
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

      removePointerupListener = listen(eventTarget, 'pointerup', handlerEvent);
      removePointerleaveListener = listen(eventTarget, 'pointerleave', handlerEvent);

    } else {
      const containerRect = this._containerRect =
        this._containerRect || containerElement.getBoundingClientRect();

      if (this.mlRippleCentered) {
        x = containerRect.left + containerRect.width * 0.5;
        y = containerRect.top + containerRect.height * 0.5;
      } else if (this._target || !this.mlRippleTargetIsLargerThanOutlet) {
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

      const enterDuration = this._amtDuration.enter;

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

      removePointerupListener = listen(eventTarget, 'pointerup', handlerEvent);
      removePointerleaveListener = listen(eventTarget, 'pointerleave', handlerEvent);
    }
  }

  private _fadeOutRipple(rippleElement: HTMLElement, containerElement: HTMLElement): void {
    const leaveTiming = this._amtDuration.leave;

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
