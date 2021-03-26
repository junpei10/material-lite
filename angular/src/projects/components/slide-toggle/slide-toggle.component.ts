import { DOCUMENT } from '@angular/common';
import {
  Attribute,
  ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef,
  Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Falsy, MlDocument, noop, RunOutsideNgZone, RUN_OUTSIDE_NG_ZONE } from '@material-lite/angular-cdk/utils';
import { mixinBundleFactory, mixinDisableRipple, mixinRippleDynamicConfig, mixinTabIndex, mixinTheme, MlRippleCore, theming } from '@material-lite/angular/core';

theming.set({
  theme: (theme) => `.ml-slide-toggle-bar-palette{background-color:${theme.sliderOffActive}}.ml-slide-toggle-thumb{background-color:${theme.sliderThumb}}`,
  palette: (name, color) => `.ml-checked.ml-${name} .ml-slide-toggle-bar-palette{background-color:${color};opacity:.56}.ml-checked.ml-${name} .ml-slide-toggle-thumb{background-color:${color}}.ml-checked.ml-${name} .ml-slide-toggle-ripple-outlet{color:${color}}`
});

export const ML_SLIDE_TOGGLE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MlSlideToggleComponent),
  multi: true
};

export class MlSlideToggleChange {
  constructor(
    public source: MlSlideToggleComponent,
    public checked: boolean
  ) {}
}

const SlideToggleMixin = mixinBundleFactory(mixinDisableRipple, mixinRippleDynamicConfig, mixinTabIndex, mixinTheme);

let uniqueId: number = 0;

@Component({
  selector: 'ml-slide-toggle',
  exportAs: 'mlSlideToggle',
  templateUrl: './slide-toggle.component.html',
  styleUrls: ['./slide-toggle.component.scss'],
  providers: [ML_SLIDE_TOGGLE_VALUE_ACCESSOR],
  host: {
    class: 'ml-slide-toggle',
    tabindex: '-1',
    '[id]': 'id',
    '[attr.aria-label]': 'null',
    '[attr.aria-labelledby]': 'null',
    '[class.ml-checked]': 'checked',
    '[class.ml-slide-toggle-label-before]': 'labelPosition == "before"',
  },
  inputs: ['theme', 'tabIndex', 'disableRipple', 'rippleConfig'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MlSlideToggleComponent extends SlideToggleMixin implements OnInit, ControlValueAccessor {
  private _onChange: (_: any) => any = noop;
  private _onTouched = this._onChange;

  @Input('disabled') set setDisabled(isDisabled: true | Falsy) {
    // @ts-ignore: assign the readonly variable
    const result = this.disabled =
      isDisabled || isDisabled === '';

    const el = this._elementRef.nativeElement;
    if (result) {
      el.classList.add('ml-disabled');
      el.removeAttribute('tabindex');
      this.disableRipple = true;

    } else {
      el.classList.remove('ml-disabled');
      el.tabIndex = -1;
      this.disableRipple = false;
    }
  }
  readonly disabled: boolean = false;

  @ViewChild('input') private _inputElement: ElementRef<HTMLInputElement>;

  @Input('id') set setId(id: string) {
    // @ts-ignore: assign the readonly variable
    this.id = id; // @ts-ignore
    this.inputId = id + '-input';
  }
  readonly id: string;
  readonly inputId: string;

  @Input('name') name: string;

  @Input('checked') set setChecked(isEnabled: true | Falsy) {
    // @ts-ignore
    const result = this.checked =
      isEnabled || isEnabled === '';

    // @ts-ignore
    this.stringChecked = result + '';
  }
  readonly checked: boolean;
  readonly stringChecked: 'false' | 'true' = 'false';

  @Input('required') set setRequired(isEnabled: true | Falsy) {
    // @ts-ignore
    this.required = isEnabled || isEnabled === '';
  }
  readonly required: boolean = false;

  @Input() labelPosition: 'before' | 'after' = 'after';

  @Input('aria-label') ariaLabel: string | null = null;

  @Input('aria-labelledby') ariaLabelledby: string | null = null;

  @Output('change') get changeEmitter(): EventEmitter<MlSlideToggleChange> {
    return this._changeEventEmitter || (this._changeEventEmitter = new EventEmitter());
  }
  private _changeEventEmitter?: EventEmitter<MlSlideToggleChange>;

  @Output('toggleChange') get toggleChangeEmitter(): EventEmitter<void> {
    return this._toggleChangeEmitter || (this._toggleChangeEmitter = new EventEmitter());
  }
  private _toggleChangeEmitter?: EventEmitter<void>;

  readonly rippleCore: MlRippleCore;
  private _rippleCoreFactory: ((outletEl: HTMLElement) => MlRippleCore) | null;

  @ViewChild('mlRippleOutlet', { static: true })
  private set _setRippleCore(outletElementRef: ElementRef<HTMLElement>) {
    // @ts-ignore: assign the readonly variable
    this.rippleCore = this._rippleCoreFactory(outletElementRef.nativeElement);

    this._rippleCoreFactory = null;
  }

  constructor(
    protected _elementRef: ElementRef<HTMLElement>,
    @Attribute('tabindex') tabIndex: string,
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(DOCUMENT) _document: MlDocument,
    @Inject(RUN_OUTSIDE_NG_ZONE) runOutsideNgZone: RunOutsideNgZone
  ) {
    super();

    this.tabIndex = parseInt(tabIndex, void 0) || 0;

    const rippleConf = this._rippleDynamicConfig;

    rippleConf._dynamic = {
      entrance: 'center',
      radius: 20,
      animation: {
        enter: 160,
      }
    };

    this._rippleCoreFactory = (outletEl) =>
      new MlRippleCore(
        rippleConf, outletEl, runOutsideNgZone,
        _document.createElement.bind(_document),
        _elementRef.nativeElement
      );
  }

  ngOnInit(): void {
    if (this.rippleIsDisabled === void 0) {
      this.rippleCore.setTrigger('current');
    }

    if (!this.id) {
      this.setId = `ml-slide-toggle-${++uniqueId}`;
    }
  }

  onChangeEvent(event: Event): void {
    event.stopPropagation();

    const toggleChangeEmitter = this._toggleChangeEmitter;
    if (toggleChangeEmitter) {
      toggleChangeEmitter.emit();
    }

    this.setChecked = this._inputElement.nativeElement.checked;

    this._emitChangeEvent();
  }

  onInputClick(event: Event): void {
    event.stopPropagation();
  }

  toggle(): void {
    // @ts-ignore: assign readonly variable
    const checked = this.checked = !this.checked;
    this._onChange(checked);
  }

  private _emitChangeEvent(): void {
    this._onChange(this.checked);

    const changeEmitter = this.changeEmitter;
    if (changeEmitter) {
      changeEmitter.emit(new MlSlideToggleChange(this, this.checked));
    }
  }

  /** Implemented as part of ControlValueAccessor. */
  writeValue(value: any): void { // @ts-ignore: assign the readonly variable
    this.checked = !!value;
  }
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    // @ts-ignore: assign the readonly variable
    this.disabled = isDisabled;
    this._changeDetectorRef.markForCheck();
  }

}
