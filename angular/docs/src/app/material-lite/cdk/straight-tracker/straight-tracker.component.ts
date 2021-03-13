import { DOCUMENT } from '@angular/common';
import { AfterContentInit, ChangeDetectionStrategy, Component, ElementRef, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Falsy, RunOutsideNgZone, RUN_OUTSIDE_NG_ZONE } from '../utils';
import { MlStraightTrackerCore, MlStraightTrackerSizingMode, MlStraightTrackerTransitionClasses } from './straight-tracker-core';

@Component({
  selector: 'ml-straight-tracker',
  exportAs: 'mlStraightTracker',
  template: '<div #trackerElement class="ml-straight-tracker"><ng-content></ng-content></div>',
  styles: ['ml-straight-tracker{width:100%;height:100%;position:absolute;top:0}.ml-straight-tracker{position:absolute;transition-timing-function:cubic-bezier(0.35, 0, 0.25, 1);transition-duration: 400ms}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class MlStraightTrackerComponent implements OnInit, AfterContentInit {
  core: MlStraightTrackerCore;
  private _coreFactory: ((trackerEl: HTMLElement) => MlStraightTrackerCore) | null;

  @ViewChild('trackerElement', { static: true })
  private set _setCore(elementRef: ElementRef<HTMLElement>) {
    this.core = this._coreFactory(elementRef.nativeElement);
    this._coreFactory = null;
  }

  @Input('disabled') set setEnabled(isDisabled: true | Falsy) {
    // @ts-ignore: assign readonly variable
    const result = this.isDisabled =
    isDisabled || isDisabled === '';

    result
      ? this.core.finalize()
      : this.core.initialize();
  }
  readonly isDisabled: boolean;

  @Input('target') set setTarget(target: HTMLElement) {
    this.core.trackTargetByElement(target);
  }

  @Input('targetIndex') set setTargetIndex(targetIndex: number) {
    this.core.trackTargetByIndex(targetIndex);
  }

  @Input() orientation?: 'horizontal' | 'vertical';
  @Input() position?: 'before' | 'after';
  @Input() transitionClasses?: MlStraightTrackerTransitionClasses;

  @Input('sizingMode')
  set setSizingMode(mode: MlStraightTrackerSizingMode) {
    this.core.setSizingMode(mode);

    // @ts-ignore: assign readonly variable
    this.sizingMode = mode;
  }
  readonly sizingMode: MlStraightTrackerCore;

  @Input('unobserveTarget')
  set setTargetToUnobserved(isEnabled: true | Falsy) {
    const result = isEnabled || isEnabled === '';

    this.core.switchTargetObserverState(!result);
  }
  get hasObservedTarget(): boolean {
    return this.core.hasObservedTarget;
  }

  /**
   * コンテナ(親)要素に`ResizeObserver`を追加するかどうか。
   */
  @Input('observeContainer')
  set setContainerToObserved(isEnabled: true | Falsy) {
    const result = isEnabled || isEnabled === '';

    this.core.switchContainerObserverState(result);
  }
  get hasObservedContainer(): boolean {
    return !this.core.hasObservedContainer;
  }

  constructor(
    _elementRef: ElementRef<HTMLElement>,
    @Inject(RUN_OUTSIDE_NG_ZONE) _runOutsideNgZone: RunOutsideNgZone,
    @Inject(DOCUMENT) _document: Document
  ) {
    this._coreFactory = (trackerEl) => new MlStraightTrackerCore(
      this, _elementRef.nativeElement, trackerEl,
      _runOutsideNgZone, _document.createElement.bind(_document)
    );
  }

  ngOnInit(): void {
    if (this.isDisabled === void 0) {
      this.core.initialize();
    }
  }

  ngAfterContentInit(): void {
    this.core.onFirstUpdateBrothers();
  }
}

