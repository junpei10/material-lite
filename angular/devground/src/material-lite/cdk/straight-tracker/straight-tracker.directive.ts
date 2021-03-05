import { DOCUMENT } from '@angular/common';
import {
  AfterContentChecked, Directive, ElementRef, Inject, Input,
  OnChanges, OnDestroy, SimpleChange, SimpleChanges
} from '@angular/core';
import { RunOutsideNgZone, RUN_OUTSIDE_NG_ZONE } from '@material-lite/angular-cdk/utils';
import { MlStraightTrackerCore, MlStraightTrackerSizingMode } from './straight-tracker-core';

interface Changes extends SimpleChanges {
  orientation: SimpleChange;
  position: SimpleChange;
}

// @dynamic
@Directive({
  selector: '[mlStraightTracker]',
  exportAs: 'mlStraightTracker'
})
export class MlStraightTrackerDirective implements OnChanges, AfterContentChecked, OnDestroy {
  core: MlStraightTrackerCore;

  @Input('mlStraightTracker') set setEnabled(isEnabled: boolean | undefined | '') {
    // @ts-ignore: assign readonly variable
    const result = this.isEnabled =
      isEnabled || isEnabled === '';

    result
      ? this.core.initialize()
      : this.core.finalize();
  }
  readonly isEnabled: boolean;

  @Input('mlStraightTrackerSizingMode')
  set setSizingMode(mode: MlStraightTrackerSizingMode) {
    this.core.setSizingMode(mode);

    // @ts-ignore: assign readonly variable
    this.currentSizingMode = mode;
  }
  readonly currentSizingMode: MlStraightTrackerCore;

  @Input('mlStraightTrackerOrientation') orientation: 'horizontal' | 'vertical';
  @Input('mlStraightTrackerPosition') position: 'before' | 'after';

  @Input('mlStraightTrackerTarget') set setTarget(target: HTMLElement) {
    const core = this.core;

    if (core.shouldTrackTarget(target)) {
      const targetIndex = core.indexOfBrotherElements(target);

      if (targetIndex !== -1) {
        core.trackTarget(targetIndex);
      }
    }
  }
  get target(): HTMLElement {
    return this.core.targetElement;
  }

  @Input('mlStraightTrackerTargetIndex') set setTargetIndex(targetIndex: number) {
    const core = this.core;

    if (core.shouldTrackTarget(targetIndex)) {
      core.trackTarget(targetIndex);
    }
  }
  get targetIndex(): number {
    return this.core.targetIndex;
  }


  @Input('mlStraightTrackerUnobserveContainer')
  set setTargetToUnobserved(isEnabled: boolean | undefined | '') {
    const result = isEnabled || isEnabled === '';

    this.core.setTargetObserverState(!result);
  }
  get hasObservedTarget(): boolean {
    return this.core.hasObservedTarget;
  }

  /**
   * コンテナ(親)要素に`ResizeObserver`を追加するかどうか。
   */
  @Input('mlStraightTrackerObserveContainer')
  set setContainerToObserved(isEnabled: boolean | undefined | '') {
    const result = isEnabled || isEnabled === '';

    result
      ? this.core.containerResizeObserver?.observe({ box: 'border-box' })
      : this.core.containerResizeObserver?.unobserve();
  }
  get hasObservedContainer(): boolean {
    return !!this.core.containerResizeObserver?.hasObserved;
  }

  constructor(
    elementRef: ElementRef<HTMLElement>,
    @Inject(DOCUMENT) _document: Document,
    @Inject(RUN_OUTSIDE_NG_ZONE) runOutsideNgZone: RunOutsideNgZone
  ) {
    this.core =
      new MlStraightTrackerCore(
        this, elementRef.nativeElement, runOutsideNgZone,
        _document.createElement.bind(_document)
      );
  }

  ngOnChanges(changes: Changes): void {
    if (changes.orientation && changes.position) {
      this.core.updateTrackerPosition();
    }
  }

  ngOnDestroy(): void {
    this.core.finalize();
  }

  ngAfterContentChecked(): void {
    this.core.checkBrotherElement();
  }
}