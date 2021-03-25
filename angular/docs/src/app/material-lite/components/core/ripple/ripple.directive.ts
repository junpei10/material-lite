import { Directive, ElementRef, Inject, Input, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Falsy, MlDocument, RunOutsideNgZone, RUN_OUTSIDE_NG_ZONE } from '@material-lite/angular-cdk/utils';
import { MlRippleCore, MlRippleEntrance, MlRippleOverdrive, MlRippleTrigger } from './ripple-core';

@Directive({
  selector: '[mlRipple]',
  exportAs: 'mlRipple'
})
export class MlRippleDirective implements OnInit {
  core: MlRippleCore;

  private _hasInitialized: boolean;

  @Input('mlRippleDisabled') set setDisabled(isDisabled: true | Falsy) {
    // @ts-ignore: assign the readonly variable
    const result = this.disabled =
      isDisabled || isDisabled === '';

    if (this._hasInitialized) {
      result
        ? this.core.setTrigger(null)
        : this.core.setTrigger('current');
    }
  }
  readonly disabled: boolean;

  @Input('mlRippleOverdrive') overdrive?: MlRippleOverdrive;

  @Input('mlRippleColor') color?: string;

  @Input('mlRippleTheme') theme?: string;

  @Input('mlRippleOpacity') opacity?: number;

  @Input('mlRippleRadius') radius?: number;

  @Input('mlRippleRadiusMagnification') radiusMagnification?: number;

  @Input('mlRippleAnimation') animation: {
    enter?: number;
    leave?: number;
  };

  @Input('mlRippleEntrance') entrance?: MlRippleEntrance;

  @Input('mlRippleTrigger') set setTrigger(trigger: MlRippleTrigger) {
    // @ts-ignore: assign the readonly variable
    this.trigger = trigger;

    this.core.setTrigger(trigger);
  } // @ts-ignore
  readonly trigger: MlRippleTrigger = 1;

  @Input('mlRippleFadeOutEventNames') fadeOutEventNames?: string[] = [
    'pointerup', 'pointerout'
  ];

  constructor(
    elementRef: ElementRef<HTMLElement>,
    @Inject(DOCUMENT) _document: MlDocument,
    @Inject(RUN_OUTSIDE_NG_ZONE) runOutsideNgZone: RunOutsideNgZone,
  ) {
    this.core =
      new MlRippleCore(this, elementRef.nativeElement, runOutsideNgZone, _document.createElement.bind(_document));
  }

  ngOnInit(): void {
    const trigger = this.trigger as MlRippleTrigger & 1;

    if (!this.disabled) {
      // @ts-ignore
      this.disabled = false;

      if (trigger === 1) {
        // @ts-ignore: assign the readonly variable
        this.trigger = 'outlet';
        this.core.setTrigger('current');
      }

    } else if (trigger === 1) {
      // @ts-ignore: assign the readonly variable
      this.trigger = 'outlet';
    }

    this._hasInitialized = true;
  }
}
