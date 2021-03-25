import { DOCUMENT } from '@angular/common';
import {
  AfterContentInit, ChangeDetectionStrategy, Component, ElementRef,
  Inject, Input, OnChanges, OnInit, SimpleChange, ViewChild, ViewEncapsulation
} from '@angular/core';
import { Falsy, MlDocument, RunOutsideNgZone, RUN_OUTSIDE_NG_ZONE } from '@material-lite/angular-cdk/utils';
import {
  MlStraightTrackerCore, MlStraightTrackerSizingMode,
  MlStraightTrackerTransitionClasses
} from './straight-tracker-core';

type Changes = {
  position: SimpleChange;
  orientation: SimpleChange;
};

@Component({
  selector: 'ml-straight-tracker',
  exportAs: 'mlStraightTracker',
  template: '<div #trackerElement class="ml-tracker" [style.transition]="transition"><ng-content></ng-content></div>',
  styles: ['ml-straight-tracker{width:100%;height:100%;position:absolute;top:0;pointer-events:none}.ml-tracker{position:absolute;transition-timing-function:cubic-bezier(0.35, 0, 0.25, 1);pointer-events:auto;z-index:1;}.ml-top-tracker{top:0}.ml-right-tracker{right:0}.ml-bottom-tracker{bottom:0}.ml-left-tracker{left:0}'],
  host: {
    class: 'ml-straight-tracker'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class MlStraightTrackerComponent implements OnInit, OnChanges, AfterContentInit {
  core: MlStraightTrackerCore;
  private _coreFactory?: (trackerEl: HTMLElement) => MlStraightTrackerCore;

  private _initialized: boolean = false;

  @ViewChild('trackerElement', { static: true })
  private set _setCore(elementRef: ElementRef<HTMLElement>) {
    this.core = this._coreFactory(elementRef.nativeElement);
    this._coreFactory = null;
  }

  @Input('disabled') set setDisabled(isDisabled: true | Falsy) {
    // @ts-ignore: assign the readonly variable
    const result = this.disabled =
      isDisabled || isDisabled === '';

    result
      ? this.core.finalize()
      : this.core.initialize();
  }
  readonly disabled: boolean;

  @Input('target') set setTarget(target: HTMLElement) {
    this.core.trackTargetByElement(target);
  }

  @Input('targetIndex') set setTargetIndex(targetIndex: number) {
    this.core.trackTargetByIndex(targetIndex);
  }

  @Input() orientation?: 'horizontal' | 'vertical';
  @Input() position?: 'before' | 'after';

  @Input() transition?: string;
  @Input() transitionClasses?: MlStraightTrackerTransitionClasses;

  @Input('sizingMode')
  set setSizingMode(mode: MlStraightTrackerSizingMode) {
    this.core.setSizingMode(mode);

    // @ts-ignore: assign the readonly variable
    this.sizingMode = mode;
  }
  readonly sizingMode: MlStraightTrackerCore;

  @Input('unobserveTarget')
  set setTargetToUnobserved(isEnabled: true | Falsy) {
    const result = isEnabled || isEnabled === '';

    this.core.switchTargetObserverState(!result);
  }

  /**
   * コンテナ(親)要素に`ResizeObserver`を追加するかどうか。
   */
  @Input('observeContainer')
  set setContainerToObserved(isEnabled: true | Falsy) {
    const result = isEnabled || isEnabled === '';

    this.core.switchContainerObserverState(result);
  }

  constructor(
    _elementRef: ElementRef<HTMLElement>,
    @Inject(RUN_OUTSIDE_NG_ZONE) _runOutsideNgZone: RunOutsideNgZone,
    @Inject(DOCUMENT) _document: MlDocument
  ) {
    this._coreFactory = (trackerEl) =>
      new MlStraightTrackerCore(
        this, _elementRef.nativeElement, trackerEl,
        _runOutsideNgZone, _document.createElement.bind(_document)
      );
  }

  ngOnInit(): void {
    if (this.disabled === void 0) {
      this.setDisabled = false;
    }

    this._initialized = true;
  }

  ngOnChanges(changes: Changes): void {
    const orientationChanges = !!changes.orientation;

    if (orientationChanges || changes.position) {
      this.core.updateTrackerStyle(this._initialized && orientationChanges);
    }
  }

  ngAfterContentInit(): void {
    this.core.onFirstUpdateBrothers();
  }
}

