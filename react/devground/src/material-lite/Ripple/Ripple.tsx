import React, {
  Component,
  createRef
} from 'react';
import './style.css';
import { listen } from '../common';

export interface MatRippleProps {
  target?: any;
  disabled?: boolean;
  centered?: boolean;
  color?: string;
  opacity?: number;
  amtDuration?: { enter?: number, leave?: number } | number;
}

export type EntryMatRippleProps = MatRippleProps & {
  amtDuration: { enter: number, leave: number };
};


class MatRipple extends Component<MatRippleProps> {
  ref: React.RefObject<HTMLElement>;

  containerRect: DOMRect | null;

  existingRippleCount: number = 0;

  prevTarget: HTMLElement | null = null;
  prevDisabled: boolean;

  amtDuration: EntryMatRippleProps['amtDuration'] = {
    enter: 440,
    leave: 400
  };

  pointerdownHandler: () => void = () => { };

  constructor(props: EntryMatRippleProps) {
    super(props);
    this.ref = createRef();
  }

  /** @lifecycle */
  componentDidMount() {
    // @ts-ignore: Non nullable
    this.ref.current.parentElement.classList.add('Mat-ripple-lite-container');
    this.componentDidUpdate();
  }

  /** @lifecycle */
  componentDidUpdate() {
    // propsの整理： amtDuration(local変数)へ
    const amtDurationPropRef = this.props.amtDuration;
    if (amtDurationPropRef) {
      this.amtDuration = (() => {
        if (typeof amtDurationPropRef === 'number') {
          const duration = amtDurationPropRef * 0.5;
          return {
            enter: duration,
            leave: duration
          }
        } else {
          return {
            enter: amtDurationPropRef.enter || this.amtDuration.enter,
            leave: amtDurationPropRef.leave || this.amtDuration.leave
          }
        }
      })()
    }

    if (this.props.disabled) {
      this.pointerdownHandler();

      this.prevDisabled = true;
    } else {
      const targetPropRef = this.props.target;
      if (this.prevTarget !== targetPropRef || this.prevDisabled) {
        // @ts-ignore
        this.prevTarget = this.props.target;

        // Remove listener
        this.pointerdownHandler();

        // @ts-ignore: Non nullable
        const hostElement = this.ref.current.parentElement as HTMLElement;

        const listenerTarget: HTMLElement = (!targetPropRef) ? hostElement : targetPropRef;

        // Listen
        this.pointerdownHandler = listen(listenerTarget, 'pointerdown',
          (event: PointerEvent) => this.fadeInRipple(
            hostElement, listenerTarget,
            event.clientX, event.clientY
          ));
      }

      this.prevDisabled = false;
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
    } else if (!this.props.target) {
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

    const rippleStyles: string =
      'left:' + (x - containerRect.left - distance) + 'px;' +
      'top:' + (y - containerRect.top - distance) + 'px;' +
      'width:' + size + 'px;height:' + size + 'px;' +
      'background-color:' + (this.props.color || 'var(--theme-opposite-base)') + ';' +
      'transition-duration:' + this.amtDuration.enter + 'ms;' +
      'opacity:' + (this.props.opacity || 0.12);

    ripple.classList.add('Mat-ripple-lite-element');
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
    }, this.amtDuration.enter);

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
    const leaveTiming = this.amtDuration.leave;

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
    return (<span className='Mat-ripple-lite-ref' ref={this.ref}></span>)
  }
}

export default MatRipple;
