import { Directive, ElementRef, Inject, Input, OnChanges } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ListenedTarget, RunOutsideNgZone, RUN_OUTSIDE_NG_ZONE } from '@material-lite/angular-cdk/utils';
import { MlRippleCore } from './ripple-core';

// @dynamic
@Directive({
  selector: '[mlRipple]',
  exportAs: 'mlRipple'
})
export class MlRippleDirective implements OnChanges {
  core: MlRippleCore;

  @Input() set mlRipple(_enable: boolean | '') {
    // @ts-ignore: assign readonly variable
    const enable = this.isEnabled = _enable === '' || _enable;

    (enable)
      ? this._needInitialize = true
      : this.core.finalize();
  }
  readonly isEnabled: boolean | undefined;

  private _needInitialize: boolean;

  @Input('mlRippleOverdrive') overdrive?: {
    width: number;
    height: number;
  } & boolean;

  @Input('mlRippleColor') color?: string;

  @Input('mlRippleTheme') theme?: string;

  @Input('mlRippleOpacity') opacity?: number;

  @Input('mlRippleRadius') radius?: number;

  @Input('mlRippleAnimation') animation: {
    enter?: number;
    leave?: number;
  } = {};

  @Input() set mlRippleTrigger(target: ListenedTarget | false) {
    // @ts-ignore: assign readonly variable
    this.trigger = target;
    this._needInitialize = true;
  }
  readonly trigger: ListenedTarget | false;

  @Input('mlRippleTriggerIsOutside') triggerIsOutside?: boolean;

  @Input('mlRippleCentered') centered?: boolean;

  @Input('mlRippleFadeOutEventNames') fadeOutEventNames: string[] = [
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

      core.setTrigger(this.trigger);

      this._needInitialize = false;
    }
  }
}
