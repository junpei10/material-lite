import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy, Component, ElementRef, Inject,
  Input, OnChanges, OnInit, ViewChild, ViewEncapsulation
} from '@angular/core';
import { RunOutsideNgZone, RUN_OUTSIDE_NG_ZONE, Falsy, MlDocument } from '@material-lite/angular-cdk/utils';
import { mixinBundleFactory, mixinDisableRipple, mixinRippleDynamicConfig, mixinTheme, MlRippleCore, theming } from '@material-lite/angular/core';

export type MlButtonVariant = 'basic' | 'raised' | 'stroked' | 'flat' | 'fab' | 'icon';
export type MlButtonHoverAction = 'enabled' | 'disabled' | 'auto';

theming.set({
  base: `
.ml-button {
  display: inline-flex;
  position: relative;
  overflow: visible !important;
  justify-content: center;
  align-items: center;
  vertical-align: middle;

  cursor: pointer;
  user-select: none;

  font-weight: 500;
  font-family: inherit;
  font-size: 14px;
  white-space: nowrap;

  border: none;
  outline: none;

  box-sizing: border-box;
}

.ml-button:focus-visible .ml-button-overlay {
  opacity: 0.056;
}

.ml-button a, a.ml-button {
  text-decoration: none;
}
.ml-button a:link, a.ml-button:link {
  color: #3F51B5;
}
.ml-button a:visited, a.ml-button:visited {
  color: #673AB7;
}

.ml-simple-button {
  background-color: transparent;
}

.ml-basic-button,
.ml-raised-button,
.ml-stroked-button,
.ml-flat-button {
  min-width: 64px;
  height: 36px;
  padding: 0 16px;
  border-radius: 4px;
}

.ml-icon-button,
.ml-fab {
  height: 32px;
  width: 32px;
  padding: 0;
  border-radius: 50%;
}

.ml-raised-button .ml-button-ripple {
  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12);
}
.ml-raised-button:active .ml-button-ripple {
  box-shadow: 0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12);
}

.ml-stroked-button {
  padding: 0 15px;
  border: 1px solid currentColor;
}

.ml-icon-button {
  height: 40px;
  width: 40px;
  font-size: 24px;
}

.ml-fab .ml-button-ripple {
  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12);
}
.ml-fab:active .ml-button-ripple {
  box-shadow: 0px 7px 8px -4px rgba(0,0,0,0.2), 0px 12px 17px 2px rgba(0,0,0,0.14), 0px 5px 22px 4px rgba(0,0,0,0.12);
}

.ml-anchor-button {
  padding: 0;
}
.ml-anchor-button a {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: 100%; width: 100%;
  padding: 0 16px;
}

.ml-button-ripple, .ml-button-overlay {
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  pointer-events: none;
}

.ml-button-overlay {
  display: none;
  background-color: currentColor;
  opacity: 0;
}
.ml-button-hover-action .ml-button-overlay {
  display: inline;
  transition: opacity 280ms cubic-bezier(0.35, 0, 0.25, 1);
}

.ml-button-hover-action:hover .ml-button-overlay {
  opacity: 0.056;
}

.ml-button.ml-disabled {
  cursor: default;
  box-shadow: 0 0 0 0 transparent;
}
.ml-disabled .ml-button-ripple {
  box-shadow: 0 0 0 0 transparent;
}

.ml-disabled .ml-button-overlay {
  display: none;
}
`,


  theme: (theme) => {
    return `
.ml-button {
  color: ${theme.text};
}
.ml-filled-button {
  background-color: ${theme.secondaryContainer};
}
.ml-filled-button.ml-disabled {
  background-color: ${theme.disabledContainer} !important;
}
.ml-stroked-button {
  border-color: ${theme.divider};
}
.ml-button.ml-disabled {
  color: ${theme.disabledText} !important;
}`;
  },


  palette: (name, color, contrast) => `

.ml-simple-button.ml-${name} {
  color: ${color};
}
.ml-filled-button.ml-${name} {
  background-color: ${color};
  color: ${contrast};
}

`

});

const ButtonMixin = mixinBundleFactory(mixinDisableRipple, mixinRippleDynamicConfig, mixinTheme);

@Component({
  selector: '[mlButton]',
  exportAs: 'mlButton',
  templateUrl: './button.component.html',
  inputs: ['theme', 'disableRipple', 'rippleConfig'],
  host: {
    class: 'ml-button',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class MlButtonComponent extends ButtonMixin implements OnInit, OnChanges {
  readonly isButtonElement: boolean;

  private _needSetVariant: boolean = true;

  private _currentClassList: string[] = [];

  @Input('disabled') set setDisabled(isDisabled: true | Falsy) {
    // @ts-ignore assign the readonly variable
    const result = this.disabled =
      isDisabled || isDisabled === '';

    const el = this._elementRef.nativeElement as HTMLButtonElement;

    if (result) {
      el.classList.add('ml-disabled');
      this.disableRipple = true;

      if (this.isButtonElement) {
        el.disabled = true;
      }

    } else {
      el.classList.remove('ml-disabled');
      this.disableRipple = false;

      if (this.isButtonElement) {
        el.disabled = false;
      }

    }
  }
  readonly disabled: boolean = false;

  @Input('variant') set setVariant(variant: MlButtonVariant) {
    // @ts-ignore assign the readonly variable
    this.variant = variant;
    this._needSetVariant = true;
  }
  readonly variant: MlButtonVariant;

  @Input('hoverAction') set setHoverAction(type: MlButtonHoverAction) {
    // @ts-ignore assign the readonly variable
    this.hoverAction = type;
    this._needSetVariant = true;
  }
  readonly hoverAction: MlButtonHoverAction;

  @Input('wrappedAnchor') set setAnchorToWrapped(isEnabled: true | Falsy) {
    // @ts-ignore assign the readonly variable
    const result = this.hasWrappedAnchor =
      isEnabled || isEnabled === '';

    const classList = this._elementRef.nativeElement.classList;

    result
      ? classList.add('ml-anchor-button')
      : classList.remove('ml-anchor-button');
  }
  readonly hasWrappedAnchor: boolean;

  readonly rippleCore: MlRippleCore;
  private _rippleCoreFactory?: (outletEl: HTMLElement) => MlRippleCore;

  @ViewChild('mlRippleOutlet', { static: true })
  private set _setRippleCore(outletElementRef: ElementRef<HTMLElement>) {
    // @ts-ignore: assign the readonly variable
    this.rippleCore =
      this._rippleCoreFactory(outletElementRef.nativeElement);

    this._rippleCoreFactory = null;
  }

  constructor(
    protected _elementRef: ElementRef<HTMLElement>,
    @Inject(RUN_OUTSIDE_NG_ZONE) runOutsideNgZone: RunOutsideNgZone,
    @Inject(DOCUMENT) _document: MlDocument,
  ) {
    super();

    const el = this._elementRef.nativeElement;

    const isButtonEl = this.isButtonElement = el instanceof HTMLButtonElement;
    if (!isButtonEl) {
      el.addEventListener('click', this._haltDisabledEvents.bind(this));
    }

    this._rippleCoreFactory = (outletEl) =>
      new MlRippleCore(
        this._rippleDynamicConfig, outletEl, runOutsideNgZone,
        _document.createElement.bind(_document), el);
  }

  ngOnInit(): void {
    if (this.rippleIsDisabled === void 0) {
      this.rippleCore.setTrigger('current');
    }

    this.ngOnChanges();
  }

  ngOnChanges(): void {
    if (this._needSetVariant) {
      this._needSetVariant = false;

      const hostClassList = this._elementRef.nativeElement.classList;
      const v = this.variant;
      hostClassList.remove(...this._currentClassList);

      if (!v || v === 'basic') {
        this._currentClassList = [
          'ml-basic-button',
          'ml-simple-button',
        ];
        this._rippleDynamicConfig._dynamic.entrance = null;
        this._setHoverActionForEnabledByDefault();

      } else if (v === 'raised') {
        this._currentClassList = [
          'ml-raised-button',
          'ml-filled-button'
        ];
        this._rippleDynamicConfig._dynamic.entrance = null;
        this._setHoverActionForDisabledByDefault();

      } else if (v === 'icon') {
        this._currentClassList = [
          'ml-icon-button',
          'ml-simple-button'
        ];
        this._rippleDynamicConfig._dynamic.entrance = 'center';
        this._setHoverActionForDisabledByDefault();

      } else if (v === 'fab') {
        this._currentClassList = [
          'ml-fab',
          'ml-filled-button'
        ];
        this._rippleDynamicConfig._dynamic.entrance = null;
        this._setHoverActionForDisabledByDefault();

      } else if (v === 'flat') {
        this._currentClassList = [
          'ml-flat-button',
          'ml-filled-button'
        ];
        this._rippleDynamicConfig._dynamic.entrance = null;
        this._setHoverActionForDisabledByDefault();

      } else if (v === 'stroked') {
        this._currentClassList = [
          'ml-stroked-button',
          'ml-simple-button',
        ];
        this._rippleDynamicConfig._dynamic.entrance = null;
        this._setHoverActionForEnabledByDefault();

      } else {
        this._currentClassList = [
          'ml-basic-button',
          'ml-simple-button',
        ];
        this._rippleDynamicConfig._dynamic.entrance = null;
        this._setHoverActionForEnabledByDefault();
      }

      hostClassList.add(...this._currentClassList);
    }
  }

  private _setHoverActionForEnabledByDefault(): void {
    if (this.hoverAction !== 'disabled') {
      this._currentClassList.push('ml-button-hover-action');
    }
  }

  private _setHoverActionForDisabledByDefault(): void {
    if (this.hoverAction === 'enabled') {
      this._currentClassList.push('ml-button-hover-action');
    }
  }

  private _haltDisabledEvents(event: Event): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
}
