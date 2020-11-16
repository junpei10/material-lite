import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges } from '@angular/core';
import { MlThemeStyle, MlTheming } from '../core/theming';

const STYLE: MlThemeStyle = {
  base: '.ml-button{display:inline-flex;position:relative;overflow:visible!important;align-items:center;justify-content:center;cursor:pointer;font-weight:500;font-family:inherit;font-size:14px;border:none;outline:none;box-sizing:border-box;}.ml-button:focus-visible.ml-button-overlay{opacity:0.056;}.ml-buttona,a.ml-button{text-decoration:none;}.ml-buttona:link,a.ml-button:link{color:#3F51B5;}.ml-buttona:visited,a.ml-button:visited{color:#673AB7;}.ml-simple-button{background-color:transparent;}.ml-basic-button,.ml-raised-button,.ml-stroked-button,.ml-flat-button{min-width:64px;min-height:36px;padding:016px;border-radius:4px;}.ml-icon-button,.ml-fab{min-height:32px;min-width:32px;padding:0;border-radius:50%;}.ml-raised-button.ml-button-ripple{transition:box-shadow280mscubic-bezier(0.4,0,0.2,1);box-shadow:0px3px1px-2pxrgba(0,0,0,0.2),0px2px2px0pxrgba(0,0,0,0.14),0px1px5px0pxrgba(0,0,0,0.12);}.ml-raised-button:active.ml-button-ripple{box-shadow:0px5px5px-3pxrgba(0,0,0,0.2),0px8px10px1pxrgba(0,0,0,0.14),0px3px14px2pxrgba(0,0,0,0.12);}.ml-stroked-button{padding:015px;border:1pxsolidcurrentColor;}.ml-icon-button{height:40px;width:40px;font-size:24px;}.ml-fab.ml-button-ripple{transition:box-shadow280mscubic-bezier(0.4,0,0.2,1);box-shadow:0px3px5px-1pxrgba(0,0,0,0.2),0px6px10px0pxrgba(0,0,0,0.14),0px1px18px0pxrgba(0,0,0,0.12);}.ml-fab:active.ml-button-ripple{box-shadow:0px7px8px-4pxrgba(0,0,0,0.2),0px12px17px2pxrgba(0,0,0,0.14),0px5px22px4pxrgba(0,0,0,0.12);}.ml-link-button{padding:0;}.ml-link-buttona{display:inline-flex;justify-content:center;align-items:center;height:100%;width:100%;padding:016px;}.ml-disabled-button{pointer-events:none;box-shadow:0000transparent!important;}.ml-disabled-button.ml-button-ripple{box-shadow:0000transparent!important;}.ml-button-ripple,.ml-button-overlay{position:absolute;top:0;left:0;width:100%;height:100%;border-radius:inherit;pointer-events:none;}.ml-button-overlay{display:none;background-color:currentColor;opacity:0;}.ml-button-hover-action.ml-button-overlay{display:inline;transition:opacity280mscubic-bezier(0.35,0,0.25,1);}.ml-button-hover-action:hover.ml-button-overlay{opacity:0.056;}',
  themeFactory: (theme, palette, forEach) => {
    const { text, secondaryContainer, disabledContainer, disabledText, divider } = theme;
    return `.ml-button{color:${text};}.ml-filled-button{background-color:${secondaryContainer};}.ml-filled-button.ml-disabled-button{background-color:${disabledContainer};}.ml-stroked-button{border-color:${divider}!important;}.ml-disabled-button{color:${disabledText};}` + forEach((paletteName, color, contrast) => (`.ml-simple-button.ml-button-${paletteName}{color:${color};}.ml-filled-button.ml-button-${paletteName}{background-color:${color};color:${contrast};}`));
  }
};

export type MlButtonVariant = 'basic' | 'raised' | 'stroked' | 'flat' | 'fab' | 'icon';
export type MlButtonHoverAction = 'enable' | 'disable' | 'default';
@Component({
  selector: '[mlButton]',
  templateUrl: './button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MlButtonComponent implements OnChanges {
  public hostElement: HTMLElement;
  private _needSetVariant: boolean = true;

  private _currentClassList: string[] = [];
  public rippleCentered: boolean;

  @Input() set mlButton(_enable: boolean | '') {
    const enable = _enable === '' || _enable;
    (enable)
      ? this.hostElement.classList.remove('ml-disabled-button')
      : this.hostElement.classList.add('ml-disabled-button');
  }

  @Input() set variant(variant: MlButtonVariant) {
    this._variant = variant;
    this._needSetVariant = true;
  }
  private _variant: string;

  @Input() set hoverAction(type: MlButtonHoverAction) {
    this._hoverAction = type;
    this._needSetVariant = true;
  }
  private _hoverAction: MlButtonHoverAction;

  @Input() set theme(nextTheme: string) {
    const hostElementClassList = this.hostElement.classList;

    hostElementClassList.remove('ml-button-' + this._theme);
    hostElementClassList.add('ml-button-' + nextTheme);

    this._theme = nextTheme;
  }
  private _theme: string;

  @Input() set inlineLink(enable: boolean) {
    enable
      ? this.hostElement.classList.add('Ml-link-button')
      : this.hostElement.classList.remove('Ml-link-button');
  }

  @Input() disableRipple: boolean | '';

  constructor(elementRef: ElementRef<HTMLElement>) {
    MlTheming.setStyle(STYLE);
    const hostElement = this.hostElement = elementRef.nativeElement;
    hostElement.classList.add('ml-button');
  }

  ngOnChanges(): void {
    if (this._needSetVariant) {
      this._needSetVariant = false;
      const hostElementClassList = this.hostElement.classList;
      const v = this._variant;
      hostElementClassList.remove(...this._currentClassList);

      if (!v || v === 'basic') {
        this._currentClassList = [
          'ml-basic-button',
          'ml-simple-button',
        ];
        this.rippleCentered = false;
        this._setHoverActionForEnabledByDefault();

      } else if (v === 'raised') {
        this._currentClassList = [
          'ml-raised-button',
          'ml-filled-button'
        ];
        this.rippleCentered = false;
        this._setHoverActionForDisabledByDefault();

      } else if (v === 'icon') {
        this._currentClassList = [
          'ml-icon-button',
          'ml-simple-button'
        ];
        this.rippleCentered = true;
        this._setHoverActionForDisabledByDefault();

      } else if (v === 'fab') {
        this._currentClassList = [
          'ml-fab',
          'ml-filled-button'
        ];
        this.rippleCentered = false;
        this._setHoverActionForDisabledByDefault();

      } else if (v === 'flat') {
        this._currentClassList = [
          'ml-flat-button',
          'ml-filled-button'
        ];
        this.rippleCentered = false;
        this._setHoverActionForDisabledByDefault();

      } else if (v === 'stroked') {
        this._currentClassList = [
          'ml-stroked-button',
          'ml-simple-button',
        ];
        this.rippleCentered = false;
        this._setHoverActionForEnabledByDefault();
      }

      hostElementClassList.add(...this._currentClassList);
    }
  }

  private _setHoverActionForEnabledByDefault(): void {
    if (this._hoverAction !== 'disable') {
      this._currentClassList.push('ml-button-hover-action');
    }
  }

  private _setHoverActionForDisabledByDefault(): void {
    if (this._hoverAction === 'enable') {
      this._currentClassList.push('ml-button-hover-action');
    }
  }
}
