import { Directive, ElementRef, Inject, Input, OnChanges } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Falsy, ListenedTarget, RunOutsideNgZone, RUN_OUTSIDE_NG_ZONE } from '@material-lite/angular-cdk/utils';
import { MlRippleCore, MlRippleEntrance, MlRippleOverdrive, MlRippleTrigger } from './ripple-core';

// @dynamic
@Directive({
  selector: '[mlRipple]',
  exportAs: 'mlRipple'
})
export class MlRippleDirective implements OnChanges {
  core: MlRippleCore;

  @Input('mlRipple') set setEnabled(isEnable: true | Falsy) {
    // @ts-ignore: assign readonly variable
    const result = this.isEnabled =
      isEnable || isEnable === '';

    (result)
      ? this._needInitialize = true
      : this.core.finalize();
  }
  readonly isEnabled: boolean | undefined;

  private _needInitialize: boolean;

  @Input('mlRippleOverdrive') overdrive?: MlRippleOverdrive;

  @Input('mlRippleColor') color?: string;

  @Input('mlRippleTheme') theme?: string;

  @Input('mlRippleOpacity') opacity?: number;

  @Input('mlRippleRadius') radius?: number;

  @Input('mlRippleAnimation') animation: {
    enter?: number;
    leave?: number;
  };

  @Input('mlRippleTrigger') set setTrigger(trigger: MlRippleTrigger) {
    // @ts-ignore: assign readonly variable
    this._triggerBinder = trigger;
    this._needInitialize = true;
  }
  get trigger(): ListenedTarget {
    return this.core.triggerElement;
  }
  private _triggerBinder: MlRippleTrigger = 'host';

  @Input('mlRippleEntrance') entrance?: MlRippleEntrance;

  @Input('mlRippleFadeOutEventNames') fadeOutEventNames?: string[] = [
    'pointerup', 'pointerout'
  ];

  constructor(
    elementRef: ElementRef<HTMLElement>,
    @Inject(DOCUMENT) _document: Document,
    @Inject(RUN_OUTSIDE_NG_ZONE) runOutsideNgZone: RunOutsideNgZone,
  ) {
    this.core = new MlRippleCore(
      this, elementRef.nativeElement, runOutsideNgZone,
      _document.createElement.bind(_document)
    );
  }

  ngOnChanges(): void {
    if (this._needInitialize && this.isEnabled) {
      const core = this.core;

      core.setTrigger(this._triggerBinder);

      this._needInitialize = false;
    }
  }
}
