import { Directive, ElementRef, Inject, Input, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Falsy, MlDocument, noop, RunOutsideNgZone, RUN_OUTSIDE_NG_ZONE } from '@material-lite/angular-cdk/utils';
import { MlRippleAnimation, MlRippleCore, MlRippleEntrance, MlRippleOverdrive } from './ripple-core';

@Directive({
  selector: '[mlRipple]',
  exportAs: 'mlRipple'
})
export class MlRippleDirective implements OnInit {
  core: MlRippleCore;

  @Input('mlRippleDisabled') set setDisabled(isDisabled: true | Falsy) {
    // @ts-expect-error: Assign to readonly variable
    const result = this.disabled =
      isDisabled || isDisabled === '';

    result
      ? this.core.teardown()
      : this.core.setup();
  }
  readonly disabled: boolean;

  @Input('mlRippleOverdrive') overdrive?: MlRippleOverdrive;

  @Input('mlRippleColor') color?: string;

  @Input('mlRippleTheme') theme?: string;

  @Input('mlRippleOpacity') opacity?: number;

  @Input('mlRippleRadius') radius?: number;

  @Input('mlRippleRadiusMagnification') radiusMagnification?: number;

  @Input('mlRippleAnimation') animation?: MlRippleAnimation;

  @Input('mlRippleEntrance') entrance?: MlRippleEntrance;

  @Input('mlRippleTrigger') set setTrigger(trigger: EventTarget | 'outlet' | Falsy) {
    this._removeTriggerListener();

    if (trigger) {
      // @ts-expect-error: Assign to readonly variable
      const entryTrigger = this.trigger =
        trigger === 'outlet'
          ? this._elementRef.nativeElement
          : trigger;

      this._removeTriggerListener =
        this.core.addPointerdownListener(entryTrigger);

    } else {
      // @ts-expect-error: Assign to readonly variable
      this.trigger = null;
      this._removeTriggerListener = noop;
    }
  }
  readonly trigger: EventTarget | null;
  private _removeTriggerListener: () => void = noop;

  @Input('mlRippleFadeOutEventNames') fadeOutEventNames?: string[];

  constructor(
    private _elementRef: ElementRef<HTMLElement>,
    @Inject(DOCUMENT) _document: MlDocument,
    @Inject(RUN_OUTSIDE_NG_ZONE) runOutsideNgZone: RunOutsideNgZone,
  ) {
    this.core =
      new MlRippleCore(
        this, _elementRef.nativeElement, runOutsideNgZone,
        _document.createElement.bind(_document)
      );
  }

  ngOnInit(): void {
    if (this.disabled === void 0) {
      this.setDisabled = false;
    }

    if (this.trigger === void 0) {
      this.setTrigger = 'outlet';
    }
  }
}
