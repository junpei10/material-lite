import { CoreConfig, Falsy, listen, RunOutsideNgZone, setCoreConfig, styling } from '@material-lite/angular-cdk/utils';

styling.insert('.ml-ripple-outlet{position:relative;overflow:hidden;user-select:none}.ml-ripple{will-change:opacity,transform;transform:scale(0);transition-property:opacity,transform;transition-timing-function:cubic-bezier(0,0,.2,1);position:absolute;border-radius:50%;pointer-events:none;background:currentColor}.ml-overdrive{will-change:opacity;opacity:0;transition-property:opacity;transition-timing-function:cubic-bezier(0,0,.2,1);position:absolute;top:0;left:0;width:100%;height:100%;border-radius:0;pointer-events:none;background:currentColor}');

export type MlRippleOverdrive = {
  width: number;
  height: number;
} | true | Falsy;

export interface MlRippleAnimation {
  enter?: number;
  leave?: number;
}

export type MlRippleEntrance = 'center' | 'resonance' | 'default' | Falsy;

export interface MlRippleCoreConfig {
  overdrive?: MlRippleOverdrive;

  color?: string;
  theme?: string;

  radius?: number;
  radiusMagnification?: number;
  opacity?: number;

  entrance?: MlRippleEntrance;

  animation?: MlRippleAnimation;

  fadeOutEventNames?: string[];
}

export interface MlRippleElement extends HTMLElement {
  rippleEnterDuration: number;
}

interface IncompleteEventHandler {
  trigger: EventTarget;
  removePointerdownListener?: undefined;
  onMousedown?: undefined;
  onTouchstart?: undefined;
}

interface EventHandler {
  trigger: EventTarget;
  removePointerdownListener: () => void;
  onMousedown: (e: any) => void;
  onTouchstart: (e: any) => void;
}

const DEFAULT_FADEOUT_EVENT_NAMES = ['mouseup', 'touchend', 'pointerout'];

export class MlRippleCore {
  private _isEnabled: boolean;

  private _eventHandlers: (EventHandler | IncompleteEventHandler)[] = [];

  readonly existingRippleCount: number = 0;

  private _hasFiredTouchstart: boolean;

  private _outletElementRect: DOMRect | null;

  private _config: MlRippleCoreConfig;

  constructor(
    config: CoreConfig<MlRippleCoreConfig>,
    private _outletElement: HTMLElement,
    private _runOutsideNgZone: RunOutsideNgZone,
    private _createElement: Document['createElement'],
  ) {
    setCoreConfig(this, config);

    _outletElement.classList.add('ml-ripple-outlet');
  }

  setTrigger(trigger: EventTarget): void {
    this._eventHandlers.push({ trigger });
  }

  getRemoveListener(trigger: EventTarget): (() => void) | undefined {
    const handlers = this._eventHandlers;
    const handlerLen = handlers.length;

    for (let i = 0; i < handlerLen; i++) {
      const handler = handlers[i];

      if (handler.trigger === trigger) {
        const removeListener = handler.removePointerdownListener;
        return () => {
          if (removeListener !== void 0) { removeListener(); }
          handlers.splice(handlers.indexOf(handler), 1);
        };
      }
    }

    return;
  }

  setup(): void {
    if (this._isEnabled) { return; }
    this._isEnabled = true;

    const handlers = this._eventHandlers;
    const handlerLen = handlers.length;

    if (handlerLen) {
      this._runOutsideNgZone(() => {
        for (let i = 0; i < handlerLen; i++) {
          const handler = handlers[i];
          const trigger = handler.trigger;

          if (!handler.removePointerdownListener) {
            handlers[i] = this._createHandler(trigger);

          } else {
            trigger.addEventListener('mousedown', handler.onMousedown);
            trigger.addEventListener('touchstart', handler.onTouchstart);
          }
        }
      });
    }
  }

  teardown(): void {
    if (!this._isEnabled) { return; }
    this._isEnabled = false;

    const handlers = this._eventHandlers;
    const handlerLen = handlers.length;

    for (let i = 0; i < handlerLen; i++) {
      const removeListener = handlers[i].removePointerdownListener;
      if (removeListener !== void 0) {
        removeListener();
      }
    }
  }

  reset(): void {
    this.teardown();
    this._eventHandlers = [];
  }

  addPointerdownListener(trigger: EventTarget): () => void {
    if (this._isEnabled) {
      const handlers = this._eventHandlers;
      const handler = this._createHandler(trigger);

      handlers.push(handler);

      return () => {
        handler.removePointerdownListener!();
        handlers.splice(handlers.indexOf(handler), 1);
      };

    } else {
      this.setTrigger(trigger);

      return () => {
        const removeListener = this.getRemoveListener(trigger);
        if (removeListener !== void 0) { removeListener(); }
      };
    }
  }

  private _createHandler(trigger: EventTarget): EventHandler {
    const onMousedown = (e: any) => this._onMousedown(e, trigger);
    const onTouchstart = (e: any) => this._onTouchstart(e, trigger);

    this._runOutsideNgZone(() => {
      trigger.addEventListener('touchstart', onTouchstart);
      trigger.addEventListener('mousedown', onMousedown);
    });

    const removePointerdownListener = () => {
      trigger.removeEventListener('touchstart', onTouchstart);
      trigger.removeEventListener('mousedown', onMousedown);
    };

    return { trigger, removePointerdownListener, onMousedown, onTouchstart };
  }

  private _onMousedown(event: MouseEvent, trigger: EventTarget): void {
    if (event.buttons !== 0 && !this._hasFiredTouchstart) {
      this._onPointerEvent(event, trigger);
    }
  }

  private _onTouchstart(event: TouchEvent, trigger: EventTarget): void {
    if (!isFakeTouchstartFromScreenReader(event)) {
      this._hasFiredTouchstart = true;

      const touches = event.changedTouches;
      const len = touches.length;

      for (let i = 0; i < len; i++) {
        this._onPointerEvent(touches[i], trigger);
      }
    }
  }

  private _onPointerEvent(event: { clientX: number, clientY: number }, trigger: EventTarget): void {
    const conf = this._config;

    let overdrive = conf.overdrive === '' || conf.overdrive;

    if (overdrive && overdrive !== true) {
      const rect = this._outletElementRect || (this._outletElementRect = this._outletElement.getBoundingClientRect());

      const height = overdrive.height;
      const width = overdrive.width;
      overdrive = ((height && height <= rect.height) || (width && width <= rect.width)) as boolean;
    }

    const rippleEl = (overdrive)
      ? this.fadeInOverdrive()
      : this.fadeInRipple(event.clientX, event.clientY);

    this.autoFadeOutRipple(rippleEl, trigger);
  }

  /**
   * 通常のRippleを出現させる。
   *
   * @returns 出現させたRippleを削除するためのトークン(DOM)を返す。
   * `Ripple`を削除させる方法は複数あるため、関数ではなく`Ripple`の要素を返し、柔軟に対応できるようしている。
   */
  fadeInRipple(x: number, y: number): MlRippleElement {
    // @ts-ignore
    const rippleEl: MlRippleElement = this._createElement('div');
    const rippleClassList = rippleEl.classList;

    rippleClassList.add('ml-ripple-element', 'ml-ripple');

    const outletEl = this._outletElement;
    const outletRect = this._outletElementRect || (this._outletElementRect = outletEl.getBoundingClientRect());

    const conf = this._config;

    if (conf.entrance === 'center') {
        x = outletRect.left + outletRect.width * 0.5;
        y = outletRect.top + outletRect.height * 0.5;

    } else if (conf.entrance === 'resonance') {
      const left = outletRect.left;
      const right = outletRect.right;
      x =
        (x < left)
          ? left
          : (x > right)
            ? right
            : x;

      const top = outletRect.top;
      const bottom = outletRect.bottom;
      y =
        (y < top)
          ? top
          : (y > bottom)
            ? bottom
            : y;
    }

    let radius: number;

    if (conf.radius) {
      radius = conf.radius * (conf.radiusMagnification || 1);

    } else {
      const distX = Math.max(Math.abs(x - outletRect.left), Math.abs(x - outletRect.right));
      const distY = Math.max(Math.abs(y - outletRect.top), Math.abs(y - outletRect.bottom));
      radius = Math.sqrt(distX * distX + distY * distY) * (conf.radiusMagnification || 1);
    }

    const enterDur = conf.animation?.enter || 448;
    rippleEl.rippleEnterDuration = enterDur;

    const size = radius * 2;
    let rippleStyle: string = `top:${y - outletRect.top - radius}px;left:${x - outletRect.left - radius}px;width:${size}px;height:${size}px;transition-duration:${enterDur}ms;opacity:${conf.opacity || 0.12}`;

    if (conf.theme) {
      rippleClassList.add(`ml-${conf.theme}-bg`);

    } else if (conf.color) {
      rippleStyle += `;background-color:${conf.color}`;
    }

    rippleEl.setAttribute('style', rippleStyle);
    outletEl.appendChild(rippleEl);

    // @ts-expect-error: Assign to readonly variable
    this.existingRippleCount++;

    this._runOutsideNgZone(() =>
      setTimeout(() => rippleEl.style.transform = 'scale(1)')
    );

    return rippleEl;
  }


  /**
   * 一瞬で広がる`Ripple`を出現させる。
   *
   * @returns 出現させたRippleを削除するためのトークン(DOM)を返す。
   */
  fadeInOverdrive(): MlRippleElement {
    // @ts-ignore
    const rippleEl = this._createElement('div') as MlRippleElement;
    const rippleClassList = rippleEl.classList;

    rippleClassList.add('ml-ripple-element', 'ml-overdrive');

    const conf = this._config;

    const enterDuration = (conf.animation?.enter || 400) * 0.4;
    let rippleStyle = `transition-duration:${enterDuration}ms;`;

    if (conf.theme) {
      rippleClassList.add(`ml-${conf.theme}-bg`);

    } else if (conf.color) {
      rippleStyle += `background-color: ${conf.color};`;
    }

    rippleEl.setAttribute('style', rippleStyle);
    this._outletElement.appendChild(rippleEl);

    // @ts-expect-error: Assign to readonly variable
    this.existingRippleCount++;

    this._runOutsideNgZone(() =>
      setTimeout(() => rippleEl.style.opacity = (conf.opacity || 0.12) + '')
    );

    rippleEl.rippleEnterDuration = enterDuration;
    return rippleEl;
  }

  /**
   * Rippleを削除する。
   *
   * @param rippleElement `fadeInRipple`と`fadeInOverdrive`の戻り値。
   */
  fadeOutRipple(rippleElement: MlRippleElement): void {
    const conf = this._config;

    const leaveTiming = conf.animation?.leave || 400;

    rippleElement.style.transitionDuration = leaveTiming + 'ms';
    rippleElement.style.opacity = '0';

    this._runOutsideNgZone(() => {
      setTimeout(() => {
        this._outletElement.removeChild(rippleElement);
        this._hasFiredTouchstart = false;

        // @ts-expect-error: Assign to readonly variable
        const count = (this.existingRippleCount -= 1);
        if (count === 0) {
          this._outletElementRect = null;
        }
      }, leaveTiming);
    });
  }

  /**
   * Rippleを自動で削除するアクションを追加する。
   *
   * @param rippleElement `fadeInRipple`と`fadeInOverdrive`の戻り値。
   * @param eventTarget 自動で
   */
  autoFadeOutRipple(rippleElement: MlRippleElement, trigger?: EventTarget): void {
    let listenerHasRemoved: boolean | undefined;
    let rippleHasEntered: boolean | undefined;

    const enterDur = rippleElement.rippleEnterDuration;
    if (enterDur) {
      this._runOutsideNgZone(() => {
        setTimeout(() => {
          (listenerHasRemoved)
            ? this.fadeOutRipple(rippleElement)
            : rippleHasEntered = true;
        }, enterDur);
      });

    } else {
      rippleHasEntered = true;
    }

    const conf = this._config;
    const eventNames = conf.fadeOutEventNames || DEFAULT_FADEOUT_EVENT_NAMES;

    const nameLen = eventNames.length;
    if (nameLen) {
      const removeListenerEvents: (() => void)[] = [];

      const finalize = () => {
        const eventLen = removeListenerEvents.length;
        for (let i = 0; i < eventLen; i++) {
          removeListenerEvents[i]();
        }

        rippleHasEntered
          ? this.fadeOutRipple(rippleElement)
          : listenerHasRemoved = true;
      };

      const target = trigger || this._outletElement;

      this._runOutsideNgZone(() => {
        for (let i = 0; i < nameLen; i++) {
          const name = eventNames[i];
          removeListenerEvents.push(listen(target, name, finalize));
        }
      });

    } else {
      rippleHasEntered
        ? this.fadeOutRipple(rippleElement)
        : listenerHasRemoved = true;
    }
  }
}


/** @引用 ソースコードから */
export function isFakeTouchstartFromScreenReader(event: TouchEvent): boolean {
  const touch: Touch | undefined =
    (event.touches && event.touches[0]) ||
    (event.changedTouches && event.changedTouches[0]);

  // A fake `touchstart` can be distinguished from a real one by looking at the `identifier`
  // which is typically >= 0 on a real device versus -1 from a screen reader. Just to be safe,
  // we can also look at `radiusX` and `radiusY`. This behavior was observed against a Windows 10
  // device with a touch screen running NVDA v2020.4 and Firefox 85 or Chrome 88.
  return !!touch && touch.identifier === -1 && (touch.radiusX == null || touch.radiusX === 1) &&
          (touch.radiusY == null || touch.radiusY === 1);
}
