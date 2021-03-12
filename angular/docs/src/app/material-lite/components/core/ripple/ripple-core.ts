import { ElementRef } from '@angular/core';
import { listen, RunOutsideNgZone, noop, ListenedTarget, insertStyleElement, CoreConfig, setCoreConfig, Falsy } from '@material-lite/angular-cdk/utils';

insertStyleElement(`
.ml-ripple {
  position: relative;
  overflow: hidden;
  user-select: none;
}
.ml-ripple-element {
  will-change: opacity, transform;
  transform: scale(0);
  transition-property: opacity, transform;
  transition-timing-function: cubic-bezier(0,0,.2,1);
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  background: currentColor;
}
.ml-overdrive-element {
  will-change: opacity;
  opacity: 0;
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0,0,.2,1);
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  border-radius: 0;
  pointer-events: none;
  background: currentColor;
}
`);

export type MlRippleTrigger = ListenedTarget | 'host' | Falsy;

export interface MlRippleCoreConfig {
  overdrive?: {
    width?: number,
    height?: number
  } | boolean;

  color?: string;
  theme?: string;

  radius?: number;
  opacity?: number;

  centered?: boolean;

  triggerIsOutside?: boolean;

  animation?: {
    enter?: number;
    leave?: number;
  };

  fadeOutEventNames?: string[];
}

interface RippleElement extends HTMLElement {
  enterDuration: number;
}

export class MlRippleCore {
  readonly triggerElement: ListenedTarget;

  private _removeTriggerListener: () => void = noop;

  private _removeListeners: (() => void)[] = [];

  private _hostElementRect: DOMRect | null;

  readonly existingRippleCount: number = 0;

  private _config: MlRippleCoreConfig;

  constructor(
    config: CoreConfig<MlRippleCoreConfig>,
    private _hostElement: HTMLElement,
    private _runOutsideNgZone: RunOutsideNgZone,
    private _createElement: Document['createElement'],
  ) {
    setCoreConfig(this, config);

    _hostElement.classList.add('ml-ripple');
  }

  finalize(): void {
    this._removeTriggerListener();

    const events = this._removeListeners;
    const listenerLen = events.length;

    for (let i = 0; listenerLen < i; i++) {
      events[i]();
    }
  }

  /**
   * 通常のRippleを出現させる。
   *
   * @returns 出現させたRippleを削除するためのトークン(DOM)を返す。
   * `Ripple`を削除させる方法は複数あるため、関数ではなく`Ripple`の要素を返し、柔軟に対応できるようしている。
   */
  fadeInRipple(x: number, y: number): RippleElement {
    // @ts-ignore
    const rippleEl = this._createElement('div') as RippleElement;
    const rippleClassList = rippleEl.classList;

    rippleClassList.add('ml-ripple-element');

    const containerEl = this._hostElement;

    const containerRect = this._hostElementRect =
      this._hostElementRect || containerEl.getBoundingClientRect();

    const conf = this._config;

    if (conf.centered) {
        x = containerRect.left + containerRect.width * 0.5;
        y = containerRect.top + containerRect.height * 0.5;

    } else if (conf.triggerIsOutside) {
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

    let radius: number;

    if (conf.radius) {
      radius = conf.radius;
    } else {
      const distX = Math.max(Math.abs(x - containerRect.left), Math.abs(x - containerRect.right));
      const distY = Math.max(Math.abs(y - containerRect.top), Math.abs(y - containerRect.bottom));
      radius = Math.sqrt(distX * distX + distY * distY);
    }

    const enterDur = conf.animation?.enter || 448;
    rippleEl.enterDuration = enterDur;

    const size = radius * 2;
    let rippleStyle: string = `top:${y - containerRect.top - radius}px;left:${x - containerRect.left - radius}px;width:${size}px;height:${size}px;transition-duration:${enterDur}ms;opacity:${conf.opacity || 0.12}`;

    if (conf.theme) {
      rippleClassList.add(`ml-${conf.theme}-bg`);

    } else if (conf.color) {
      rippleStyle += `;background-color:${conf.color}`;
    }

    rippleEl.setAttribute('style', rippleStyle);
    containerEl.appendChild(rippleEl);

    // @ts-ignore: assign readonly variable
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
  fadeInOverdrive(): RippleElement {
    // @ts-ignore
    const rippleEl = this._createElement('div') as RippleElement;
    const rippleClassList = rippleEl.classList;

    rippleClassList.add('ml-overdrive-element');

    const conf = this._config;

    let rippleStyle = `transition-duration:${(conf.animation?.enter || 448) * 0.4}ms;`;

    if (conf.theme) {
      rippleClassList.add(`ml-${conf.theme}-bg`);

    } else if (conf.color) {
      rippleStyle += `background-color: ${conf.color};`;
    }

    rippleEl.setAttribute('style', rippleStyle);
    this._hostElement.appendChild(rippleEl);

    // @ts-ignore: assign readonly variable
    this.existingRippleCount++;

    this._runOutsideNgZone(() =>
      setTimeout(() => rippleEl.style.opacity = (conf.opacity || 0.12) + '')
    );

    rippleEl.enterDuration = 0;
    return rippleEl;
  }


  /**
   * Rippleを削除する。
   *
   * @param rippleElement `fadeInRipple`と`fadeInOverdrive`の戻り値。
   */
  fadeOutRipple(rippleElement: RippleElement): void {
    const conf = this._config;

    const leaveTiming = conf.animation?.leave || 400;

    rippleElement.style.transitionDuration = leaveTiming + 'ms';
    rippleElement.style.opacity = '0';

    this._runOutsideNgZone(() => {
      setTimeout(() => {
        this._hostElement.removeChild(rippleElement);

        // @ts-ignore: assign readonly variable
        const count = this.existingRippleCount -= 1;
        if (count === 0) {
          this._hostElementRect = null;
        }
      }, leaveTiming);
    });
  }

  /**
   * Rippleを自動で削除するアクションを追加する。
   *
   * @param rippleElement `fadeInRipple`と`fadeInOverdrive`の戻り値。
   * @param listenedTarget 自動で
   */
  autoFadeOutRipple(rippleElement: RippleElement, listenedTarget?: ListenedTarget): void {
    let listenerHasRemoved: boolean | undefined;
    let rippleHasEntered: boolean | undefined;

    const enterDur = rippleElement.enterDuration;
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
    const eventNames = conf.fadeOutEventNames || ['pointerup', 'pointerout'];

    const nameLen = eventNames.length;
    if (nameLen) {
      const removeListenerEvents: (() => void)[] = [];

      const finalize = () => {
        removeListenerEvents.forEach((r) => r());

        rippleHasEntered
          ? this.fadeOutRipple(rippleElement)
          : listenerHasRemoved = true;
      };

      const target = listenedTarget || this._hostElement;

      this._runOutsideNgZone(() => {
        for (let i = 0; i < nameLen; i++) {
          const name = eventNames[i];
          removeListenerEvents.push(listen(target, name, finalize));
        }
      });

    } else {
      if (rippleHasEntered) {
        this.fadeOutRipple(rippleElement);
      } else {
        listenerHasRemoved = true;
      }
    }
  }

  /**
   * トリガーを追加しない場合は、
   */
  setTrigger(trigger: MlRippleTrigger): void {
    this._removeTriggerListener();

    if (!trigger) {
      this._removeTriggerListener = noop;

    } else {
      // @ts-ignore: assign the readonly property
      const trg = this.triggerElement = trigger === 'host'
        ? this._hostElement
        : trigger;

      this._runOutsideNgZone(() => {
        this._removeTriggerListener =
          listen(trg, 'pointerdown', (event) => this._addPointerdownListenerCallback(event, trg));
      });
    }
  }

  /**
   * デフォルトというか、
   */
  addPointerdownListener(trigger: ListenedTarget): () => void {
    const removeListener =
      listen(trigger, 'pointerdown', (event) => this._addPointerdownListenerCallback(event, trigger));

    this._removeListeners.push(removeListener);

    return removeListener;
  }

  private _addPointerdownListenerCallback(event: PointerEvent, trigger: ListenedTarget): void {
    const conf = this._config;

    let overdrive = conf.overdrive;

    if (overdrive && overdrive !== true) {
      const rect = this._hostElementRect =
        this._hostElementRect || this._hostElement.getBoundingClientRect();

      const height = overdrive.height;
      const width = overdrive.width;
      overdrive = ((height && height <= rect.height) || (width && width <= rect.width)) as boolean;
    }

    const rippleEl = (overdrive)
      ? this.fadeInOverdrive()
      : this.fadeInRipple(event.clientX, event.clientY);

    this.autoFadeOutRipple(rippleEl, trigger);
  }

}