import './Button.scss';

import React, {
  Component, createRef
} from 'react';
import MatRipple from '../core/Ripple/Ripple';

export type MatButtonVariant = 'basic' | 'raised' | 'stroked' | 'flat' | 'fab' | 'icon';

export interface MatButtonProps {
  // color?: string;
  // contrast?: string;
  inlineLink?: boolean;
  theme?: MatLiteThemePalette;
  variant?: MatButtonVariant | null;
  hoverAction?: 'enable' | 'disable' | 'default';
  disabled?: boolean;
  disableRipple?: boolean;
}
export interface MatButtonState {
  centeredRipple: boolean;
}

class MatButton extends Component<MatButtonProps, MatButtonState> {
  overlayRef: React.RefObject<any>;
  hostElement: HTMLElement;

  // currentStyleType: 'simple' | 'filled';
  addedThemeClass: string;
  addedClassList: string[] = [];

  constructor(props: MatButtonProps) {
    super(props);
    this.state = { centeredRipple: false }
    this.overlayRef = createRef();
  }

  componentDidMount() {
    this.hostElement = this.overlayRef.current.parentElement;
    this.hostElement.classList.add('Ml-button');
    this.componentDidUpdate({
      variant: null,
    });
  }

  static getDerivedStateFromProps(nextProps: MatButtonProps) {
    return { centeredRipple: nextProps.variant === 'icon' };
  }

  componentDidUpdate(prevProps: MatButtonProps) {
    console.log(this.state);
    const { hostElement, props } = this;
    const hostElementClassList = hostElement.classList;

    /** @changes variant */
    if (props.variant !== prevProps.variant) {
      const v = props.variant;

      hostElementClassList.remove(...this.addedClassList);

      if (!v || v === 'basic') {
        this.addedClassList = [
          'Ml-basic-button',
          'Ml-simple-button',
        ];
        // this.currentStyleType = 'simple';
        this.setHoverActionForEnabledByDefault();

      } else if (v === 'raised') {
        this.addedClassList = [
          'Ml-raised-button',
          'Ml-filled-button'
        ];
        // this.currentStyleType = 'filled';
        this.setHoverActionForDisabledByDefault();

      } else if (v === 'icon') {
        this.addedClassList = [
          'Ml-icon-button',
          'Ml-simple-button'
        ];
        // this.currentStyleType = 'simple';
        this.setHoverActionForDisabledByDefault();

      } else if (v === 'fab') {
        this.addedClassList = [
          'Ml-fab',
          'Ml-filled-button'
        ];
        // this.currentStyleType = 'filled';
        this.setHoverActionForDisabledByDefault();

      } else if (v === 'flat') {
        this.addedClassList = [
          'Ml-flat-button',
          'Ml-filled-button'
        ];
        // this.currentStyleType = 'filled';
        this.setHoverActionForDisabledByDefault();

      } else if (v === 'stroked') {
        this.addedClassList = [
          'Ml-stroked-button',
          'Ml-simple-button',
        ];
        // this.currentStyleType = 'simple';
        this.setHoverActionForEnabledByDefault();
      }

      hostElementClassList.add(...this.addedClassList);
    }

    /** @changes disabled */
    if (props.disabled) {
      hostElementClassList.add('Ml-disabled-button');
    } else if (prevProps.disabled) {
      hostElementClassList.remove('Ml-disabled-button');
    }

    /** @changes theme */
    const themeProp = props.theme;
    if (themeProp && themeProp !== prevProps.theme) {
      hostElementClassList.remove(this.addedThemeClass);

      const newThemeClass = `Ml-button-${themeProp}`;

      hostElementClassList.add(newThemeClass);
      this.addedThemeClass = newThemeClass;
    }

    const linkProp = props.inlineLink;
    if (linkProp !== prevProps.inlineLink) {
      const className = 'Ml-link-button';
      linkProp
        ? hostElementClassList.add(className)
        : hostElementClassList.remove(className);
    }

    /** @changes color or contrast */
    // const hostElementStyle = this.hostElement.style;
    // if (this.currentStyleType === 'simple') {
    //   const currentColor = this.props.color;
    //   if (currentColor === prevProps.color) {

    //   }
    //   const propColor = this.props.color;
    //   hostElementStyle.color =
    //     (propColor) ? propColor : '';
    //   hostElementStyle.background = '';

    // } else {
    //   const propColor = this.props.color;
    //   hostElementStyle.backgroundColor =
    //     (propColor) ? propColor : '';

    //   const propContrast = this.props.contrast;
    //   hostElementStyle.color =
    //     (propContrast) ? propContrast : '';
    // }
  }

  setHoverActionForEnabledByDefault(): void {
    if (this.props.hoverAction !== 'disable') {
      this.addedClassList.push('Ml-button-hover-action');
    }
  }

  setHoverActionForDisabledByDefault(): void {
    if (this.props.hoverAction === 'enable') {
      this.addedClassList.push('Ml-button-hover-action');
    }
  }

  render() {
    return (
      <>
        <span ref={this.overlayRef} className='Ml-button-overlay'></span>
        <MatRipple
          disabled={this.props.disableRipple}
          centered={this.state.centeredRipple}
          wrapped
        />
      </>
    )
  }
}

export default MatButton;