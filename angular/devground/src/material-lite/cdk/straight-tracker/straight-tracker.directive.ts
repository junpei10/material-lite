import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, Inject, Input, OnDestroy, SimpleChange, SimpleChanges } from '@angular/core';
import { RunOutsideNgZone, RUN_OUTSIDE_NG_ZONE } from '@material-lite/angular-cdk/utils';
import { MlStraightTrackerCore } from './straight-tracker-core';

interface Changes extends SimpleChanges {
  orientation: SimpleChange;
  position: SimpleChange;
}

// @dynamic
@Directive({
  selector: '[mlStraightTracker]',
  exportAs: 'mlStraightTracker'
})
export class MlStraightTrackerDirective implements OnDestroy {
  core: MlStraightTrackerCore;

  @Input() set mlStraightTracker(_enable: boolean | '') {
    // @ts-ignore: assign readonly variable
    const enable = this.isEnabled = (_enable || _enable === '');

    enable
      ? this.core.initialize()
      : this.core.finalize();
  }
  readonly isEnabled: boolean;

  @Input('mlStraightTrackerOrientation') orientation: 'horizontal' | 'vertical';
  @Input('mlStraightTrackerPosition') position: 'before' | 'after';

  /**
   * コンテナ(親)要素に`ResizeObserver`を追加するかどうか。
   */
  @Input('mlStraightTrackerObserveContainer') set observeContainer(enable: boolean) {
    enable
      ? this.core.containerResizeObserver?.observe({ box: 'border-box' })
      : this.core.containerResizeObserver?.unobserve();
  }
  get hasObservedContainer(): boolean {
    return !!this.core.containerResizeObserver?.hasObserved;
  }

  /**
   * 追跡したい要素を入力し、その要素の順番（インデックス）を求め、追跡する。
   *
   * @param target 追跡したい兄弟要素
   */
  @Input('mlStraightTrackerTarget') set target(target: HTMLElement) {
    const core = this.core;
    const index = core.indexOfBrotherElements(target);

    if (index !== -1) {
      core.trackTarget(index);
    }
  }

  /**
   * 追跡したい要素の順番（インデックス）を入力し、追跡する。
   */
  @Input('mlStraightTrackerTargetIndex') set targetIndex(index: number) {
    this.core.trackTarget(index);
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
