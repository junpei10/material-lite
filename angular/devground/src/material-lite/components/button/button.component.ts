import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Inject, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { createListenedTarget, ListenedTarget, RunOutsideNgZone, RUN_OUTSIDE_NG_ZONE } from '@material-lite/angular-cdk/utils';
import { MlRippleCore, MlRippleCoreConfig } from '../core/ripple/ripple-core';

// export interface MlButtonBinder {
//   mlButton?: boolean | '';
//   theme?: string;
//   variant?: 'basic' | 'raised' | 'stroked' | 'flat' | 'fab' | 'icon';
//   hoverAction?: 'enable' | 'disable' | 'auto';
//   wrapAnchor?: boolean;
//   rippleDisabled?: boolean;
//   rippleOverdrive?: {
//     width?: number,
//     height?: number
//   } | boolean;
// }

// type Binder = MlButtonBinder;
export type MlButtonVariant = 'basic' | 'raised' | 'stroked' | 'flat' | 'fab' | 'icon';
export type MlButtonHoverAction = 'enable' | 'disable' | 'auto';

// @dynamic
@Component({
  selector: '[mlButton]',
  exportAs: 'mlButton',
  templateUrl: './button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MlButtonComponent implements OnInit, OnChanges {
  private _hostElementListenedTarget: ListenedTarget;
  private _hostElementClassList: DOMTokenList;

  private _needSetVariant: boolean = true;

  private _currClassList: string[] = [];

  @Input('mlButton') set setEnabled(isEnabled: boolean | '') {
    // @ts-ignore assign readonly variable
    const result = this.isEnabled =
      isEnabled === '' || isEnabled;

    (result)
      ? this._hostElementClassList.remove('ml-disabled-button')
      : this._hostElementClassList.add('ml-disabled-button');
  }
  readonly isEnabled: boolean | undefined;

  @Input('variant') set setVariant(variant: MlButtonVariant) {
    // @ts-ignore assign readonly variable
    this.variant = variant;
    this._needSetVariant = true;
  }
  readonly variant: MlButtonVariant;

  @Input('hoverAction') set setHoverAction(type: MlButtonHoverAction) {
    // @ts-ignore assign readonly variable
    this.hoverAction = type;
    this._needSetVariant = true;
  }
  readonly hoverAction: MlButtonHoverAction;

  @Input('theme') set setTheme(nextTheme: string) {
    const hostClassList = this._hostElementClassList;

    if (this.theme) {
      hostClassList.remove('ml-button-' + this.theme);
    }
    if (nextTheme) {
      hostClassList.add('ml-button-' + nextTheme);
    }

    // @ts-ignore assign readonly variable
    this.theme = nextTheme;
  }
  readonly theme: string;

  @Input('wrapAnchor') set setAnchorToWrapped(isEnabled: boolean | '') {
    // @ts-ignore assign readonly variable
    const result = this.wrapAnchor =
      isEnabled === '' || isEnabled;

    result
      ? this._hostElementClassList.add('ml-anchor-button')
      : this._hostElementClassList.remove('ml-anchor-button');
  }
  readonly anchorIsWrapped: boolean;

  rippleCore: MlRippleCore;

  @ViewChild('mlRippleOutlet', { static: true })
  private set _setRippleCore(outletElementRef: ElementRef) {
    this.rippleCore = new MlRippleCore(
      {
        fadeOutEventNames: ['pointerup', 'pointerout'],
        overdrive: this.rippleOverdrive,
        centered: this.rippleCentered
      },
      outletElementRef.nativeElement,
      this._runOutsideNgZone, this._createElement
    );
  }

  @Input('disableRipple') set setRippleToDisabled(disable: boolean | '') {
    // @ts-ignore: assign readonly variable
    const _disable = this.rippleIsDisabled =
      disable === '' || disable;

    _disable
      ? this.rippleCore.setTrigger(false)
      : this.rippleCore.setTrigger(this._hostElementListenedTarget);
  }
  readonly rippleIsDisabled: boolean;

  @Input() rippleOverdrive?: MlRippleCoreConfig['overdrive'];
  rippleCentered: boolean;

  private _createElement: Document['createElement'];

  constructor(
    elementRef: ElementRef<HTMLElement>,
    @Inject(RUN_OUTSIDE_NG_ZONE) private _runOutsideNgZone: RunOutsideNgZone,
    @Inject(DOCUMENT) _document: Document,
  ) {
    this._createElement = _document.createElement.bind(_document);

    const hostElement = elementRef.nativeElement;

    this._hostElementListenedTarget = createListenedTarget(hostElement);

    const hostClassList = this._hostElementClassList = hostElement.classList;
    hostClassList.add('ml-button');
  }

  ngOnInit(): void {
    if (this.rippleIsDisabled === undefined) {
      this.rippleCore.setTrigger(this._hostElementListenedTarget);
    }
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
