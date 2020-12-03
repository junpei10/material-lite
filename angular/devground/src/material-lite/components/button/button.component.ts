import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges } from '@angular/core';
import { createListenTarget, ListenTarget } from '@material-lite/angular-cdk/utils';

export interface MlButtonBinder {
  mlButton: boolean | '';
  theme?: string;
  variant?: 'basic' | 'raised' | 'stroked' | 'flat' | 'fab' | 'icon';
  hoverAction?: 'enable' | 'disable' | 'auto';
  wrapAnchor?: boolean;
  rippleDisabled?: boolean;
  rippleOverdrive?: boolean;
  rippleTypeBreakpoint?: { width?: number, height?: number } | undefined;
}

type Binder = MlButtonBinder;

@Component({
  selector: '[mlButton]',
  templateUrl: './button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MlButtonComponent implements OnChanges {
  public hostElementListenTarget: ListenTarget;
  private _hostElementClassList: DOMTokenList;

  private _needSetVariant: boolean = true;

  private _currClassList: string[] = [];

  @Input() set mlButton(_enable: Binder['mlButton']) {
    const enable = _enable === '' || _enable;
    (enable)
      ? this._hostElementClassList.remove('ml-disabled-button')
      : this._hostElementClassList.add('ml-disabled-button');
  }

  @Input() set variant(variant: Binder['variant']) {
    this._currVariant = variant;
    this._needSetVariant = true;
  }
  private _currVariant: Binder['variant'];

  @Input() set hoverAction(type: Binder['hoverAction']) {
    this._currHoverAction = type;
    this._needSetVariant = true;
  }
  private _currHoverAction: Binder['hoverAction'];

  @Input() set theme(nextTheme: Binder['theme']) {
    const hostClassList = this._hostElementClassList;

    if (this._currTheme) {
      hostClassList.remove('ml-button-' + this._currTheme);
    }
    if (nextTheme) {
      hostClassList.add('ml-button-' + nextTheme);
    }

    this._currTheme = nextTheme;
  }
  private _currTheme: Binder['theme'];

  @Input() set wrapAnchor(enable: boolean) {
    enable
      ? this._hostElementClassList.add('Ml-anchor-button')
      : this._hostElementClassList.remove('Ml-anchor-button');
  }

  @Input() rippleDisabled: Binder['rippleDisabled'];
  @Input() rippleOverdrive: Binder['rippleOverdrive'];
  @Input() rippleTypeBreakpoint: Binder['rippleTypeBreakpoint'];
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
      const v = this._currVariant;
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
    if (this._currHoverAction !== 'disable') {
      this._currClassList.push('ml-button-hover-action');
    }
  }

  private _setHoverActionForDisabledByDefault(): void {
    if (this._currHoverAction === 'enable') {
      this._currClassList.push('ml-button-hover-action');
    }
  }
}
