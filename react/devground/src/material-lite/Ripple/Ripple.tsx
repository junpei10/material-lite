import React, {
  Component,
  createRef
} from 'react';
import './Ripple.css';
import { listen } from '../common';

export interface MatRippleProps {
  color?: string;
  theme?: MatLiteThemePalette;
  target?: any;
  nesting?: boolean;
  fitted?: boolean;
  disabled?: boolean;
  centered?: boolean;
  opacity?: number;
  amtEnterDuration?: number;
  amtLeaveDuration?: number;
}

export type EntryMatRippleProps = MatRippleProps & {
  amtDuration: { enter: number, leave: number };
};


class MatRipple extends Component<MatRippleProps> {
  ref: React.RefObject<any>;

  containerRect: DOMRect | null;

  existingRippleCount: number = 0;

  prevDisabled: boolean;

  pointerdownHandler: () => void = () => { };

  constructor(props: EntryMatRippleProps) {
    super(props);
    this.ref = createRef();
  }

  /** @lifecycle */
  componentDidMount() {
    this.componentDidUpdate({
      target: null
    });
  }

  /** @lifecycle */
  componentDidUpdate(prevProps: MatRippleProps) {
    if (this.props.disabled) {
      this.pointerdownHandler();
      this.prevDisabled = true;
    } else {
      const listenerTargetProp = this.props.target;
      const prevTarget = prevProps.target;
      if (listenerTargetProp !== prevTarget || this.prevDisabled) {
        // Remove listener
        this.pointerdownHandler();

        const refElement = this.ref.current;
        const hostElement = refElement.parentElement;

        const containerElement =
          (this.props.nesting) ? refElement : hostElement;

        const listenerTarget: HTMLElement =
          (listenerTargetProp) ? listenerTargetProp : hostElement;

        prevTarget?.classList.remove('Ml-ripple-container');
        listenerTarget.classList.add('Ml-ripple-container');

        // Listen
        this.pointerdownHandler = listen(listenerTarget, 'pointerdown',
          (event: PointerEvent) => this.fadeInRipple(
            containerElement, listenerTarget,
            event.clientX, event.clientY
          ));

        this.prevDisabled = false;
      }
    }
  }

  /** @lifecycle */
  componentWillUnmount() {
    this.pointerdownHandler();
  }

  fadeInRipple(
    containerElement: HTMLElement | HTMLDivElement,
    listenerTarget: HTMLElement | HTMLDivElement,
    clientX: number, clientY: number
  ) {
    //TODO: 要素のrectを取得するのを、子供か親のどちらにするか決めないといけない
    const containerRect = this.containerRect =
      this.containerRect || containerElement.getBoundingClientRect();

    let x: number;
    let y: number;

    if (this.props.centered) {
      x = containerRect.left + containerRect.width * 0.5;
      y = containerRect.top + containerRect.height * 0.5;
    } else if (!this.props.target || this.props.fitted) {
      x = clientX;
      y = clientY;
    } else {
      const left = ~~containerRect.left;
      const right = ~~containerRect.right;
      x =
        (clientX < left) ? left :
          (clientX > right) ? right :
            clientX;


      const top = ~~containerRect.top;
      const bottom = ~~containerRect.bottom;
      y =
        (clientY < top) ? top :
          (clientY > bottom) ? bottom :
            clientY;
    }

    const distance = (() => {
      const rect = containerRect;
      const distX = Math.max(Math.abs(x - rect.left), Math.abs(x - rect.right));
      const distY = Math.max(Math.abs(y - rect.top), Math.abs(y - rect.bottom));
      return Math.sqrt(distX * distX + distY * distY);
    })();

    const size = distance * 2;

    const ripple: HTMLElement = document.createElement('div');

    const enterDuration = this.props.amtEnterDuration || 450;
    /**
     * left: ${x - containerRect.left - distance}px
     * top: ${y - containerRect.top - distance}px
     * width: ${size}px
     * height: ${size}px
     * transition-duration: ${enterDuration}ms
     * opacity: ${this.props.opacity || 0.12}
     */
    let rippleStyles: string =
      `left:${x - containerRect.left - distance}px;top: ${y - containerRect.top - distance}px;width: ${size}px;height: ${size}px;transition-duration: ${enterDuration}ms;opacity: ${this.props.opacity || 0.12};`;

    // themeがないとき
    (this.props.theme) ?
      ripple.classList.add(`Ml-${this.props.theme}-bg`) :
      rippleStyles += `background-color: ${this.props.color};`;

    ripple.classList.add('Ml-ripple-element');
    ripple.setAttribute('style', rippleStyles);

    containerElement.appendChild(ripple);

    // 非同期として扱わないとうまくアニメーションが起きない
    setTimeout(() => ripple.style.transform = 'scale(1)');

    let listenerEventHasFired: boolean;
    let rippleHasEntered: boolean;

    setTimeout(() => {
      // listenerEventが既に発火されていた場合、fadeOutRipple()を呼び出す
      // されていなかったら、"rippleHasEntered"をtrueにすることで、ripple削除の処理は、eventListenerの方に任せている
      (listenerEventHasFired) ?
        this.fadeOutRipple(ripple, containerElement)
        : rippleHasEntered = true;
    }, enterDuration);

    const pointerupHandler: () => void = listen(listenerTarget, 'pointerup', () => handlerEvent());
    const pointerleaveHandler: () => void = listen(listenerTarget, 'pointerleave', () => handlerEvent());

    const handlerEvent = () => {
      pointerupHandler();
      pointerleaveHandler();

      // rippleが完全にenterされていた場合、fadeOutRipple()を呼び出す
      // されていなかったら、"listenerEventHasFired"をtrueにすることで、ripple削除の処理は、setTimeoutに任せている (つまり、entryされたらすぐにrippleを削除する処理に入る)
      (rippleHasEntered) ?
        this.fadeOutRipple(ripple, containerElement)
        : listenerEventHasFired = true;
    };
  }


  /** @description 出現しているRippleを削除する */
  fadeOutRipple(rippleElement: HTMLElement, containerElement: HTMLElement) {
    const leaveTiming = this.props.amtLeaveDuration || 400;

    rippleElement.style.transitionDuration = leaveTiming + 'ms';
    rippleElement.style.opacity = '0';


    setTimeout(() => {
      containerElement.removeChild(rippleElement);

      this.existingRippleCount -= 1;
      if (!this.existingRippleCount) {
        this.containerRect = null;
      }
    }, leaveTiming);
  }


  render() {
    return <div className={this.props.nesting ? 'Ml-ripple-nest' : 'Ml-ref'} ref={this.ref}></div>
  }
}

export default MatRipple;
