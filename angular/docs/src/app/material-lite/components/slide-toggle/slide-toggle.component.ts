import { DOCUMENT } from '@angular/common';
import {
  Attribute,
  ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef,
  Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Falsy, MlDocument, noop, RunOutsideNgZone, RUN_OUTSIDE_NG_ZONE } from '@material-lite/angular-cdk/utils';
import { mixinBundleFactory, mixinDisableRipple, mixinRippleDynamicConfig, mixinTheme, MlRippleCore, MlThemeStyle, MlTheming } from '@material-lite/angular/core';
import { mixinTabIndex } from '../core/common-behaviors/tabindex';

MlTheming.setStyle({
  base: `
.ml-slide-toggle {
  display: inline-block;
  height: 24px;
  max-width: 100%;

  line-height: 24px;
  white-space: nowrap;
  outline: none;

  -webkit-tap-highlight-color: transparent;
}

.ml-slide-toggle.ml-checked .ml-slide-toggle-thumb-container {
  transform: translate3d(16px , 0, 0);
}
[dir='rtl'] .ml-slide-toggle.ml-checked .ml-slide-toggle-thumb-container {
  transform: translate3d(-16px , 0, 0);
}

.ml-slide-toggle.ml-disabled {
  opacity: 0.38;
}
.ml-slide-toggle.ml-disabled .ml-slide-toggle-label, .ml-slide-toggle.ml-disabled .ml-slide-toggle-thumb-container {
  cursor: default;
}

.ml-slide-toggle-label {
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  height: inherit;
  cursor: pointer;
}

.ml-slide-toggle-content {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ml-slide-toggle-label-before .ml-slide-toggle-label {
  order: 1;
}
.ml-slide-toggle-label-before .ml-slide-toggle-bar {
  order: 2;
}

[dir='rtl'] .ml-slide-toggle-label-before .ml-slide-toggle-content, .ml-slide-toggle-content {
  margin-right: 0;
  margin-left: 8px;
}
[dir='rtl'] .ml-slide-toggle-content, .ml-slide-toggle-label-before .ml-slide-toggle-content {
  margin-left: 0;
  margin-right: 8px;
}

.ml-slide-toggle-content:empty {
  margin-left: 0;
  margin-right: 0;
}

.ml-slide-toggle-thumb-container {
  position: absolute;
  z-index: 1;
  width: 20px;
  height: 20px;
  top: -3px;
  left: 0;
  transform: translate3d(0, 0, 0);
  transition: all 80ms linear;
  transition-property: transform;
}

.ml-animation-noopable .ml-slide-toggle-thumb-container {
  transition: none;
}

[dir='rtl'] .ml-slide-toggle-thumb-container {
  left: auto;
  right: 0;
}

.ml-slide-toggle-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
}
.ml-slide-toggle-bar {
  position: relative;
  width: 36px;
  height: 14px;
  flex-shrink: 0;
}
.ml-slide-toggle-bar-palette {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.ml-slide-toggle-input {
  bottom: 0;
  left: 10px;
}
[dir='rtl'] .ml-slide-toggle-input {
  left: auto;
  right: 10px;
}

.ml-slide-toggle-thumb {
  box-shadow: 0 2px 1px -1px rgb(0 0 0 / 20%), 0 1px 1px 0 rgb(0 0 0 / 14%), 0 1px 3px 0 rgb(0 0 0 / 12%);
}

.ml-slide-toggle-bar, .ml-slide-toggle-thumb {
  transition: all 80ms linear;
  transition-property: background-color;
  transition-delay: 50ms;
}
.ml-animation-noopable .ml-slide-toggle-bar, .ml-animation-noopable .ml-slide-toggle-thumb {
  transition: none;
}
.ml-slide-toggle-ripple {
  position: absolute;
  top: calc(50% - 20px);
  left: calc(50% - 20px);
  height: 40px;
  width: 40px;
  z-index: 1;
  pointer-events: none;
  overflow: visible;
}

.ml-slide-toggle:not(.ml-checked) .ml-ripple-element {
  background-color: CurrentColor !important;
}
`,
  theme: (theme) => {
    const { primaryContainer, sliderOffActive } = theme;
    return `
.ml-slide-toggle-bar-palette {
  background-color: ${sliderOffActive};
}
.ml-slide-toggle-thumb {
  background-color: ${primaryContainer};
}
`;

  },
  palette: (name, color) => `
  .ml-${name} .ml-slide-toggle-ripple .ml-ripple-element {
    background: ${color};
  }

  .ml-checked.ml-${name} .ml-slide-toggle-bar-palette {
    background-color: ${color};
    opacity: 0.54;
  }
  .ml-checked.ml-${name} .ml-slide-toggle-thumb {
    background-color: ${color};
  }
`
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
  providers: [ML_SLIDE_TOGGLE_VALUE_ACCESSOR],
  host: {
    class: 'ml-slide-toggle',
    '[id]': 'id',
    '[attr.tabindex]': 'disabled ? null : -1',
    '[attr.aria-label]': 'null',
    '[attr.aria-labelledby]': 'null',
    '[class.ml-checked]': 'checked',
    '[class.ml-disabled]': 'disabled',
    '[class.ml-slide-toggle-label-before]': 'labelPosition == "before"',
  },
  inputs: ['theme', 'tabIndex', 'disableRipple', 'rippleConfig'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MlSlideToggleComponent extends SlideToggleMixin implements OnInit, ControlValueAccessor {
  private _onChange: (_: any) => any = noop;
  private _onTouched = this._onChange;

  @Input() disabled: boolean;

  @ViewChild('input') private _inputElement: ElementRef<HTMLInputElement>;

  @Input('id') id: string = `ml-slide-toggle-${++uniqueId}`;

  @Input('name') name: string;

  @Input('checked') set setChecked(isEnabled: true | Falsy) {
    // @ts-ignore
    const result = this.checked =
      isEnabled || isEnabled === '';

    // @ts-ignore
    this.stringChecked = result + '';
  }
  readonly checked: boolean;
  readonly stringChecked: string;

  @Input('required') set setRequired(isEnabled: true | Falsy) {
    // @ts-ignore
    this.required =
      isEnabled || isEnabled === '';
  }
  readonly required: boolean = false;

  @Input() labelPosition: 'before' | 'after' = 'after';

  @Input('aria-label') ariaLabel: string | null = null;

  @Input('aria-labelledby') ariaLabelledby: string | null = null;

  @Output('change') get changeEmitter(): EventEmitter<MlSlideToggleChange> {
    return this._changeEventEmitter || (this._changeEventEmitter = new EventEmitter());
  }
  private _changeEventEmitter?: EventEmitter<void>;

  @Output('toggleChange') get toggleChangeEmitter(): EventEmitter<void> {
    return this._toggleChangeEmitter || (this._toggleChangeEmitter = new EventEmitter());
  }
  private _toggleChangeEmitter?: EventEmitter<void>;

  rippleCore: MlRippleCore;
  private _createElement;

  @ViewChild('mlRippleOutlet', { static: true })
  private set _setRippleCore(outletElementRef: ElementRef<HTMLElement>) {
    const core = this.rippleCore =
      new MlRippleCore(this._rippleDynamicConfig, outletElementRef.nativeElement, this._runOutsideNgZone, this._createElement);

    core.triggerElement = this._elementRef.nativeElement;
  }

  constructor(
    protected _elementRef: ElementRef<HTMLElement>,
    @Attribute('tabindex') tabIndex: string,
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(DOCUMENT) _document: MlDocument,
    @Inject(RUN_OUTSIDE_NG_ZONE) private _runOutsideNgZone: RunOutsideNgZone
  ) {
    super();

    this.tabIndex = parseInt(tabIndex, void 0) || 0;

    this._createElement = _document.createElement.bind(_document);

    this._rippleDynamicConfig.dynamic = {
      entrance: 'center',
      radius: 20,
      animation: {
        enter: 150,
      }
    };
  }

  ngOnInit(): void {
    if (this.rippleIsDisabled === void 0) {
      this.rippleCore.setTrigger('current');
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

  toggle(): void { // @ts-ignore: assign readonly variable
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
    this.disabled = isDisabled;
    this._changeDetectorRef.markForCheck();
  }

}
