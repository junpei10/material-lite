import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy, Component, ElementRef, Inject,
  Input, OnChanges, OnInit, ViewChild, ViewEncapsulation
} from '@angular/core';
import { CoreDynamicConfig, RunOutsideNgZone, RUN_OUTSIDE_NG_ZONE, Falsy, MlDocument } from '@material-lite/angular-cdk/utils';
import { MlRippleCore, MlRippleCoreConfig } from '@material-lite/angular/core';

export type MlButtonVariant = 'basic' | 'raised' | 'stroked' | 'flat' | 'fab' | 'icon';
export type MlButtonHoverAction = 'enabled' | 'disabled' | 'auto';

@Component({
  selector: '[mlButton]',
  exportAs: 'mlButton',
  templateUrl: './button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class MlButtonComponent implements OnInit, OnChanges {
  private _needSetVariant: boolean = true;

  private _currClassList: string[] = [];

  @Input('mlButton') set setEnabled(isEnabled: true | Falsy) {
    // @ts-ignore assign the readonly variable
    const result = this.isEnabled =
      isEnabled || isEnabled === '';

    const classList = this._hostElementRef.nativeElement.classList;

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

  @Input('theme') set setTheme(nextTheme: string) {
    const classList = this._hostElementRef.nativeElement.classList;

    if (this.theme) {
      classList.remove('ml-button-' + this.theme);
    }
    if (nextTheme) {
      classList.add('ml-button-' + nextTheme);
    }

    // @ts-ignore assign the readonly variable
    this.theme = nextTheme;
  }
  readonly theme: string;

  @Input('wrappedAnchor') set setAnchorToWrapped(isEnabled: true | Falsy) {
    // @ts-ignore assign the readonly variable
    const result = this.hasWrappedAnchor =
      isEnabled || isEnabled === '';

    const classList = this._hostElementRef.nativeElement.classList;

    result
      ? classList.add('ml-anchor-button')
      : classList.remove('ml-anchor-button');
  }
  readonly hasWrappedAnchor: boolean;

  rippleCore: MlRippleCore;

  @ViewChild('mlRippleOutlet', { static: true })
  private set _setRippleCore(outletElementRef: ElementRef<HTMLElement>) {
    this.rippleCore = new MlRippleCore(
      this._rippleConfig, outletElementRef.nativeElement,
      this._runOutsideNgZone, this._createElement
    );
  }

  @Input('disableRipple') set setRippleToDisabled(isDisabled: true | Falsy) {
    // @ts-ignore: assign the readonly variable
    const result = this.rippleIsDisabled =
      isDisabled || isDisabled === '';

    result
      ? this.rippleCore.setTrigger(null)
      : this.rippleCore.setTrigger(this._hostElementRef.nativeElement);
  }
  readonly rippleIsDisabled: boolean;

  @Input('rippleConfig') set setRippleConfig(config: MlRippleCoreConfig) {
    this._rippleConfig.dynamic = config;
  }
  get rippleConfig(): MlRippleCoreConfig {
    return this._rippleConfig.dynamic;
  }
  private _rippleConfig: CoreDynamicConfig<MlRippleCoreConfig> = {
    dynamic: {}
  };

  private _createElement: MlDocument['createElement'];

  constructor(
    private _hostElementRef: ElementRef<HTMLElement>,
    @Inject(RUN_OUTSIDE_NG_ZONE) private _runOutsideNgZone: RunOutsideNgZone,
    @Inject(DOCUMENT) _document: MlDocument,
  ) {
    this._createElement = _document.createElement.bind(_document);
    _hostElementRef.nativeElement.classList.add('ml-button');
  }

  ngOnInit(): void {
    if (this.rippleIsDisabled === void 0) {
      // ダメ(X) => setTrigger('host');
      this.rippleCore.setTrigger(this._hostElementRef.nativeElement);
    }
  }

  ngOnChanges(): void {
    if (this._needSetVariant) {
      this._needSetVariant = false;

      const hostClassList = this._hostElementRef.nativeElement.classList;
      const v = this.variant;
      hostClassList.remove(...this._currClassList);

      if (!v || v === 'basic') {
        this._currClassList = [
          'ml-basic-button',
          'ml-simple-button',
        ];
        this._rippleConfig.dynamic.entrance = null;
        this._setHoverActionForEnabledByDefault();

      } else if (v === 'raised') {
        this._currClassList = [
          'ml-raised-button',
          'ml-filled-button'
        ];
        this._rippleConfig.dynamic.entrance = null;
        this._setHoverActionForDisabledByDefault();

      } else if (v === 'icon') {
        this._currClassList = [
          'ml-icon-button',
          'ml-simple-button'
        ];
        this._rippleConfig.dynamic.entrance = 'center';
        this._setHoverActionForDisabledByDefault();

      } else if (v === 'fab') {
        this._currClassList = [
          'ml-fab',
          'ml-filled-button'
        ];
        this._rippleConfig.dynamic.entrance = null;
        this._setHoverActionForDisabledByDefault();

      } else if (v === 'flat') {
        this._currClassList = [
          'ml-flat-button',
          'ml-filled-button'
        ];
        this._rippleConfig.dynamic.entrance = null;
        this._setHoverActionForDisabledByDefault();

      } else if (v === 'stroked') {
        this._currClassList = [
          'ml-stroked-button',
          'ml-simple-button',
        ];
        this._rippleConfig.dynamic.entrance = null;
        this._setHoverActionForEnabledByDefault();

      } else {
        this._currClassList = [
          'ml-basic-button',
          'ml-simple-button',
        ];
        this._rippleConfig.dynamic.entrance = null;
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
