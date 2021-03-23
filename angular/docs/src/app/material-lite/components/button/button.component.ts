import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy, Component, ElementRef, Inject,
  Input, OnChanges, OnInit, ViewChild, ViewEncapsulation
} from '@angular/core';
import { RunOutsideNgZone, RUN_OUTSIDE_NG_ZONE, Falsy, MlDocument } from '@material-lite/angular-cdk/utils';
import { mixinBundleFactory, mixinDisableRipple, mixinRippleDynamicConfig, mixinTheme, MlRippleCore, MlTheming } from '@material-lite/angular/core';

export type MlButtonVariant = 'basic' | 'raised' | 'stroked' | 'flat' | 'fab' | 'icon';
export type MlButtonHoverAction = 'enabled' | 'disabled' | 'auto';

MlTheming.setStyle({
  base: `
.ml-button {
  display: inline-flex;
  position: relative;
  overflow: visible !important;
  justify-content: center;
  align-items: center;
  vertical-align: middle;

  cursor: pointer;

  font-weight: 500;
  font-family: inherit;
  font-size: 14px;

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

.ml-disabled-button {
  pointer-events: none;
  box-shadow: 0 0 0 0 transparent !important;
}
.ml-disabled-button .ml-button-ripple {
  box-shadow: 0 0 0 0 transparent !important;
}

.ml-button-ripple, .ml-button-overlay {
  position: absolute !important;
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
}`,


  theme: (theme) => {
    const { text, secondaryContainer, disabledContainer, disabledText, divider } = theme;
    return `

.ml-button {
  color: ${text};
}
.ml-filled-button {
  background-color: ${secondaryContainer};
}
.ml-filled-button.ml-disabled-button {
  background-color: ${disabledContainer} !important;
}
.ml-stroked-button {
  border-color: ${divider} !important;
}
.ml-disabled-button {
  color: ${disabledText} !important;
}`;
  },


  palette: (name, color, contrast) => {
    return `

.ml-simple-button.ml-${name} {
  color: ${color};
}
.ml-filled-button.ml-${name} {
  background-color: ${color};
  color: ${contrast};
}`;

  }

});

const ButtonMixin = mixinBundleFactory(mixinDisableRipple, mixinRippleDynamicConfig, mixinTheme);

@Component({
  selector: '[mlButton]',
  exportAs: 'mlButton',
  templateUrl: './button.component.html',
  inputs: ['theme', 'disableRipple', 'rippleConfig'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class MlButtonComponent extends ButtonMixin implements OnInit, OnChanges {
  private _needSetVariant: boolean = true;

  private _currClassList: string[] = [];

  @Input('mlButton') set setEnabled(isEnabled: true | Falsy) {
    // @ts-ignore assign the readonly variable
    const result = this.isEnabled =
      isEnabled || isEnabled === '';

    const classList = this._elementRef.nativeElement.classList;

    (result)
      ? classList.remove('ml-disabled-button')
      : classList.add('ml-disabled-button');
  }
  readonly isEnabled: boolean;

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

  rippleCore: MlRippleCore;

  @ViewChild('mlRippleOutlet', { static: true })
  private set _setRippleCore(outletElementRef: ElementRef<HTMLElement>) {
    const core = this.rippleCore = new MlRippleCore(
      this._rippleDynamicConfig, outletElementRef.nativeElement,
      this._runOutsideNgZone, this._createElement
    );

    core.triggerElement = this._elementRef.nativeElement;
  }

  private _createElement: MlDocument['createElement'];

  constructor(
    protected _elementRef: ElementRef<HTMLElement>,
    @Inject(RUN_OUTSIDE_NG_ZONE) private _runOutsideNgZone: RunOutsideNgZone,
    @Inject(DOCUMENT) _document: MlDocument,
  ) {
    super();
    this._createElement = _document.createElement.bind(_document);
    _elementRef.nativeElement.classList.add('ml-button');
  }

  ngOnInit(): void {
    if (this.rippleIsDisabled === void 0) {
      this.rippleCore.setTrigger('current');
    }
  }

  ngOnChanges(): void {
    if (this._needSetVariant) {
      this._needSetVariant = false;

      const hostClassList = this._elementRef.nativeElement.classList;
      const v = this.variant;
      hostClassList.remove(...this._currClassList);

      if (!v || v === 'basic') {
        this._currClassList = [
          'ml-basic-button',
          'ml-simple-button',
        ];
        this._rippleDynamicConfig.dynamic.entrance = null;
        this._setHoverActionForEnabledByDefault();

      } else if (v === 'raised') {
        this._currClassList = [
          'ml-raised-button',
          'ml-filled-button'
        ];
        this._rippleDynamicConfig.dynamic.entrance = null;
        this._setHoverActionForDisabledByDefault();

      } else if (v === 'icon') {
        this._currClassList = [
          'ml-icon-button',
          'ml-simple-button'
        ];
        this._rippleDynamicConfig.dynamic.entrance = 'center';
        this._setHoverActionForDisabledByDefault();

      } else if (v === 'fab') {
        this._currClassList = [
          'ml-fab',
          'ml-filled-button'
        ];
        this._rippleDynamicConfig.dynamic.entrance = null;
        this._setHoverActionForDisabledByDefault();

      } else if (v === 'flat') {
        this._currClassList = [
          'ml-flat-button',
          'ml-filled-button'
        ];
        this._rippleDynamicConfig.dynamic.entrance = null;
        this._setHoverActionForDisabledByDefault();

      } else if (v === 'stroked') {
        this._currClassList = [
          'ml-stroked-button',
          'ml-simple-button',
        ];
        this._rippleDynamicConfig.dynamic.entrance = null;
        this._setHoverActionForEnabledByDefault();

      } else {
        this._currClassList = [
          'ml-basic-button',
          'ml-simple-button',
        ];
        this._rippleDynamicConfig.dynamic.entrance = null;
        this._setHoverActionForEnabledByDefault();
      }

      hostClassList.add(...this._currClassList);
    }
  }

  private _setHoverActionForEnabledByDefault(): void {
    if (this.hoverAction !== 'disabled') {
      this._currClassList.push('ml-button-hover-action');
    }
  }

  private _setHoverActionForDisabledByDefault(): void {
    if (this.hoverAction === 'enabled') {
      this._currClassList.push('ml-button-hover-action');
    }
  }
}
