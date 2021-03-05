import { listen, RunOutsideNgZone, noop, ListenedTarget } from '@material-lite/angular-cdk/utils';

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

  fadeOutEventNames: string[];
  // fadeOutTarget: 'trigger' | 'container';
}

interface RippleElement extends HTMLElement {
  enterDuration: number;
}

export class MlRippleCore {
  private _removeTriggerListener: () => void = noop;

  private _removeListeners: (() => void)[] = [];

  private _containerRect: DOMRect | null;

  readonly existingRippleCount: number;

  constructor(
    private _config: MlRippleCoreConfig,
    private _containerElement: HTMLElement,
    private _runOutsideNgZone: RunOutsideNgZone,
    private _createElement: Document['createElement'],
  ) { _containerElement.classList.add('ml-ripple'); }

  finalize(): void {
    this._removeTriggerListener();

    const events = this._removeListeners;
    const listenerLen = events.length;

    for (let i = 0; listenerLen < i; i++) {
      events[i]();
    }
  }

  /**
   * @returns `Ripple`を`fade out`させる方法は複数あるため、関数ではなく`Ripple`の要素を返し、柔軟に対応できるようしている。
   */
  fadeInRipple(x: number, y: number): RippleElement {
    // @ts-ignore
    const rippleEl = this._createElement('div') as RippleElement;
    rippleEl.classList.add('ml-ripple-element');

    const containerEl = this._containerElement;

    const containerRect = this._containerRect || (this._containerRect = containerEl.getBoundingClientRect());

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

    let distance: number;

    if (conf.radius) {
      distance = conf.radius;
    } else {
      const distX = Math.max(Math.abs(x - containerRect.left), Math.abs(x - containerRect.right));
      const distY = Math.max(Math.abs(y - containerRect.top), Math.abs(y - containerRect.bottom));
      distance = Math.sqrt(distX * distX + distY * distY);
    }

    const enterDur = conf.animation?.enter || 448;
    rippleEl.enterDuration = enterDur;

    const size = distance * 2;
    let rippleStyle: string = `top:${y - containerRect.top - distance}px;left:${x - containerRect.left - distance}px;width:${size}px;height:${size}px;transition-duration:${enterDur}ms;opacity:${conf.opacity || 0.12};`;

    (conf.theme)
      ? rippleEl.classList.add(`ml-${conf.theme}-bg`)
      : rippleStyle += `background-color: ${conf.color || 'currentColor'};`;

    rippleEl.setAttribute('style', rippleStyle);
    containerEl.appendChild(rippleEl);

    this._runOutsideNgZone(() =>
      setTimeout(() => rippleEl.style.transform = 'scale(1)')
    );

    return rippleEl;
  }


  /**
   * 一瞬で広がる`Ripple`を出現させる。
   */
  fadeInOverdrive(): RippleElement {
    // @ts-ignore
    const rippleEl = this._createElement('div') as RippleElement;
    rippleEl.classList.add('ml-overdrive-element');

    const conf = this._config;

    let rippleStyle = `transition-duration:${(conf.animation?.enter || 448) * 0.4}ms;`;
    (conf.theme)
      ? rippleEl.classList.add(`ml-${conf.theme}-bg`)
      : rippleStyle += `background-color: ${conf.color || 'currentColor'};`;

    rippleEl.setAttribute('style', rippleStyle);
    this._containerElement.appendChild(rippleEl);

    this._runOutsideNgZone(() =>
      setTimeout(() => rippleEl.style.opacity = (conf.opacity || 0.12) + '')
    );

    rippleEl.enterDuration = 0;
    return rippleEl;
  }

  fadeOutRipple(rippleElement: RippleElement): void {
    const conf = this._config;

    const leaveTiming = conf.animation?.leave || 400;

    rippleElement.style.transitionDuration = leaveTiming + 'ms';
    rippleElement.style.opacity = '0';

    this._runOutsideNgZone(() => {
      setTimeout(() => {
        this._containerElement.removeChild(rippleElement);

        // @ts-ignore: assign readonly variable
        const count = this.existingRippleCount -= 1;
        if (count === 0) {
          this._containerRect = null;
        }
      }, leaveTiming);
    });
  }

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
    const eventNames = conf.fadeOutEventNames;

    const nameLen = eventNames.length;
    if (nameLen) {
      const removeListenerEvents: (() => void)[] = [];

      const finalize = () => {
        removeListenerEvents.forEach((r) => r());

        rippleHasEntered
          ? this.fadeOutRipple(rippleElement)
          : listenerHasRemoved = true;
      };

      const target = listenedTarget || this._containerElement;

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

  setTrigger(trigger: ListenedTarget | false): void {
    this._removeTriggerListener();

    if (trigger === false) {
      this._removeTriggerListener = noop;

    } else {
      const trg = trigger || this._containerElement;

      this._runOutsideNgZone(() => {
        this._removeTriggerListener =
          listen(trg, 'pointerdown', (event) => this._addPointerdownListenerCallback(event, trg));
      });
    }
  }

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
      const rect = this._containerRect || (this._containerRect = this._containerElement.getBoundingClientRect());
      const height = overdrive.height;
      const width = overdrive.width;
      overdrive = ((height && height <= rect.height) || (width && width <= rect.width)) as boolean;
    }

    const rippleEl = (overdrive)
      ? this.fadeInOverdrive()
      : this.fadeInRipple(event.pageX, event.pageY);

    this.autoFadeOutRipple(rippleEl, trigger);
  }

}
