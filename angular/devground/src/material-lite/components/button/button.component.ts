import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges } from '@angular/core';
import { createListenTarget, ListenTarget } from '@material-lite/angular-cdk/utils';

export interface MlButtonBinder {
  mlButton?: boolean | '';
  theme?: string;
  variant?: 'basic' | 'raised' | 'stroked' | 'flat' | 'fab' | 'icon';
  hoverAction?: 'enable' | 'disable' | 'auto';
  wrapAnchor?: boolean | '';
  rippleDisabled?: boolean | '';
  rippleOverdrive?: {
    width?: number,
    height?: number
  } | boolean;
}

type Binder = MlButtonBinder;

// @dynamic
@Component({
  selector: '[mlButton]',
  exportAs: 'mlButton',
  templateUrl: './button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MlButtonComponent implements OnChanges {
  hostElementListenTarget: ListenTarget;
  private _hostElementClassList: DOMTokenList;

  private _needSetVariant: boolean = true;

  private _currClassList: string[] = [];

  @Input() private set mlButton(_enable: Binder['mlButton']) {
    const enable = this.isEnabled = _enable === '' || _enable;
    (enable)
      ? this._hostElementClassList.remove('ml-disabled-button')
      : this._hostElementClassList.add('ml-disabled-button');
  }
  isEnabled: boolean | undefined;

  @Input('variant') private set setVariant(variant: Binder['variant']) {
    this.variant = variant;
    this._needSetVariant = true;
  }
  variant: Binder['variant'];

  @Input('hoverAction') private set setHoverAction(type: Binder['hoverAction']) {
    this.hoverAction = type;
    this._needSetVariant = true;
  }
  hoverAction: Binder['hoverAction'];

  @Input('theme') private set setTheme(nextTheme: Binder['theme']) {
    const hostClassList = this._hostElementClassList;

    if (this.theme) {
      hostClassList.remove('ml-button-' + this.theme);
    }
    if (nextTheme) {
      hostClassList.add('ml-button-' + nextTheme);
    }

    this.theme = nextTheme;
  }
  theme: Binder['theme'];

  @Input('wrapAnchor') private set setWrapAnchor(_enable: Binder['wrapAnchor']) {
    const enable = _enable;
    enable
      ? this._hostElementClassList.add('ml-anchor-button')
      : this._hostElementClassList.remove('ml-anchor-button');
  }
  wrapAnchor?: boolean;

  @Input() rippleDisabled: Binder['rippleDisabled'];
  @Input() rippleOverdrive: Binder['rippleOverdrive'];
  public rippleCentered: boolean;

  constructor(elementRef: ElementRef<HTMLElement>) {
    const hostElement = elementRef.nativeElement;
    this.hostElementListenTarget = createListenTarget(hostElement);
    const hostClassList = this._hostElementClassList = hostElement.classList;
    hostClassList.add('ml-button');
  }

  ngOnChanges(): void {
    if (this._needSetVariant) {
      this._needSetVariant = false;
      const hostClassList = this._hostElementClassList;
      const v = this.variant;
      hostClassList.remove(...this._currClassList);

      if (!v || v === 'basic') {
        this._currClassList = [
          'ml-basic-button',
          'ml-simple-button',
        ];
        this.rippleCentered = false;
        this._setHoverActionForEnabledByDefault();

      } else if (v === 'raised') {
        this._currClassList = [
          'ml-raised-button',
          'ml-filled-button'
        ];
        this.rippleCentered = false;
        this._setHoverActionForDisabledByDefault();

      } else if (v === 'icon') {
        this._currClassList = [
          'ml-icon-button',
          'ml-simple-button'
        ];
        this.rippleCentered = true;
        this._setHoverActionForDisabledByDefault();

      } else if (v === 'fab') {
        this._currClassList = [
          'ml-fab',
          'ml-filled-button'
        ];
        this.rippleCentered = false;
        this._setHoverActionForDisabledByDefault();

      } else if (v === 'flat') {
        this._currClassList = [
          'ml-flat-button',
          'ml-filled-button'
        ];
        this.rippleCentered = false;
        this._setHoverActionForDisabledByDefault();

      } else if (v === 'stroked') {
        this._currClassList = [
          'ml-stroked-button',
          'ml-simple-button',
        ];
        this.rippleCentered = false;
        this._setHoverActionForEnabledByDefault();

      } else {
        this._currClassList = [
          'ml-basic-button',
          'ml-simple-button',
        ];
        this.rippleCentered = false;
        this._setHoverActionForEnabledByDefault();
      }

      hostClassList.add(...this._currClassList);
    }
  }

  private _setHoverActionForEnabledByDefault(): void {
    if (this.hoverAction !== 'disable') {
      this._currClassList.push('ml-button-hover-action');
    }
  }

  private _setHoverActionForDisabledByDefault(): void {
    if (this.hoverAction === 'enable') {
      this._currClassList.push('ml-button-hover-action');
    }
  }
}
