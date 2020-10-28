import './Button.scss';

import React, {
  Component, createRef
} from 'react';
import MatRipple from '../Ripple/Ripple';

export type MatButtonVariant = 'basic' | 'raised' | 'stroked' | 'flat' | 'fab' | 'icon';

export interface MatButtonProps {
  color?: string;
  contrast?: string;
  theme?: MatLiteThemePalette;
  variant?: MatButtonVariant | null;
  disabled?: boolean;
  hoverAction?: 'enable' | 'disable' | 'default';
}

class MatButton extends Component<MatButtonProps> {
  overlayRef: React.RefObject<any>;
  hostElement: HTMLElement;

  currentStyleType: 'simple' | 'filled';
  addedThemeClass: string;
  addedClassList: string[] = [];

  constructor(props: MatButtonProps) {
    super(props);
    this.overlayRef = createRef();
  }

  componentDidMount() {
    this.hostElement = this.overlayRef.current.parentElement;
    this.hostElement.classList.add('Ml-button');
    this.componentDidUpdate({
      variant: null,
    });
  }

  componentDidUpdate(prevProps: MatButtonProps) {
    const hostElementClassList = this.hostElement.classList;

    if (this.props.variant !== prevProps.variant) {
      const v = this.props.variant;
      hostElementClassList.remove(...this.addedClassList);

      if (!v || v === 'basic') {
        this.addedClassList = [
          'Ml-basic-button',
          'Ml-square-button',
          'Ml-simple-button',
        ];
        this.setSimpleButton();

      } else if (v === 'raised') {
        this.addedClassList = [
          'Ml-raised-button',
          'Ml-square-button',
          'Ml-filled-button'
        ];
        this.setFilledButton();

      } else if (v === 'icon') {
        this.addedClassList = [
          'Ml-icon-button',
          'Ml-circle-button',
          'Ml-simple-button'
        ];
        this.setSimpleButton();

      } else if (v === 'fab') {
        this.addedClassList = [
          'Ml-fab',
          'Ml-circle-button',
          'Ml-filled-button'
        ];
        this.setFilledButton();

      } else if (v === 'flat') {
        this.addedClassList = [
          'Ml-flat-button',
          'Ml-square-button',
          'Ml-filled-button'
        ];
        this.setFilledButton();

      } else if (v === 'stroked') {
        this.addedClassList = [
          'Ml-stroked-button',
          'Ml-square-button',
          'Ml-simple-button',
        ];
        this.setSimpleButton();
      }

      hostElementClassList.add(...this.addedClassList);
    }


    if (this.props.disabled) {
      hostElementClassList.add('Ml-disabled-button');
    } else if (prevProps.disabled) {
      hostElementClassList.remove('Ml-disabled-button');
    }

    const themeProp = this.props.theme;
    if (themeProp && themeProp !== prevProps.theme) {
      hostElementClassList.remove(this.addedThemeClass);

      const newThemeClass = `Ml-button-${themeProp}`;

      hostElementClassList.add(newThemeClass);
      this.addedThemeClass = newThemeClass;
    }

    const hostElementStyle = this.hostElement.style;
    if (this.currentStyleType === 'simple') {
      const propColor = this.props.color;
      hostElementStyle.color =
        (propColor) ? propColor : '';

    } else {
      const propColor = this.props.color;
      hostElementStyle.backgroundColor =
        (propColor) ? propColor : '';

      const propContrast = this.props.contrast;
      hostElementStyle.color =
        (propContrast) ? propContrast : '';
    }
  }

  setSimpleButton(): void {
    if (this.props.hoverAction !== 'disable') {
      this.addedClassList.push('Ml-button-opacity');
    }

    this.currentStyleType = 'simple';
  }

  setFilledButton(): void {
    if (this.props.hoverAction === 'enable') {
      this.addedClassList.push('Ml-button-opacity');
    }

    this.currentStyleType = 'filled';
  }

  render() {
    return (
      <>
        <span ref={this.overlayRef} className='Ml-button-overlay'></span>
        <MatRipple color='currentColor' nesting />
      </>
    )
  }
}

export default MatButton;