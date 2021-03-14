import { Directive, ElementRef, Inject, Input, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Falsy, RunOutsideNgZone, RUN_OUTSIDE_NG_ZONE } from '@material-lite/angular-cdk/utils';
import { MlRippleCore, MlRippleEntrance, MlRippleOverdrive, MlRippleTrigger } from './ripple-core';

// @dynamic
@Directive({
  selector: '[mlRipple]',
  exportAs: 'mlRipple'
})
export class MlRippleDirective implements OnInit {
  core: MlRippleCore;

  private _hasInitialized: boolean;

  @Input('mlRipple') set setEnabled(isEnable: true | Falsy) {
    // @ts-ignore: assign the readonly variable
    const result = this.isEnabled =
      isEnable || isEnable === '';

    if (this._hasInitialized) {
      (result)
        ? this.core.setTrigger(this.trigger)
        : this.core.finalize();
    }
  }
  readonly isEnabled: boolean | undefined;

  @Input('mlRippleOverdrive') overdrive?: MlRippleOverdrive;

  @Input('mlRippleColor') color?: string;

  @Input('mlRippleTheme') theme?: string;

  @Input('mlRippleOpacity') opacity?: number;

  @Input('mlRippleRadius') radius?: number;

  @Input('mlRippleAnimation') animation: {
    enter?: number;
    leave?: number;
  };

  @Input('mlRippleEntrance') entrance?: MlRippleEntrance;

  @Input('mlRippleTrigger') set setTrigger(trigger: MlRippleTrigger) {
    // @ts-ignore: assign the readonly variable
    this.trigger = trigger;

    this.core.setTrigger(trigger);
  }
  // @ts-ignore: 未代入化を判断するために、初期値は 1
  readonly trigger: MlRippleTrigger = 1;

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

  ngOnInit(): void {
    if (this.isEnabled && this.trigger === 1 as any) {
      this.setTrigger = 'host';
    }

    this._hasInitialized = true;
  }
}
