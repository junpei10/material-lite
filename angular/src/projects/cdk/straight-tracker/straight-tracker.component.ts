import { DOCUMENT } from '@angular/common';
import { AfterContentInit, ChangeDetectionStrategy, Component, ElementRef, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Falsy, RunOutsideNgZone, RUN_OUTSIDE_NG_ZONE } from '@material-lite/angular-cdk/utils';
import {
  MlStraightTrackerCore, MlStraightTrackerOrientation,
  MlStraightTrackerPosition, MlStraightTrackerSizingMode,
  MlStraightTrackerTransitionClasses
} from './straight-tracker-core';

interface Changes {
  position: MlStraightTrackerPosition;
  orientation: MlStraightTrackerOrientation;
}

interface DocumentType {
  createElement: (tagName: string, ...arg: any[]) => HTMLElement;
}

@Component({
  selector: 'ml-straight-tracker',
  exportAs: 'mlStraightTracker',
  template: '<div #trackerElement class="ml-tracker"><ng-content></ng-content></div>',
  styles: ['ml-straight-tracker{width:100%;height:100%;position:absolute;top:0;pointer-events:none}.ml-tracker{position:absolute;transition-timing-function:cubic-bezier(0.35, 0, 0.25, 1);pointer-events:auto;z-index:1;}'],
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

  @Input('disabled') set setDisabled(isDisabled: true | Falsy) {
    // @ts-ignore: assign the readonly variable
    const result = this.isDisabled =
      isDisabled || isDisabled === '';

    result
      ? this.core.finalize()
      : this.core.initialize();
  }
  // @ts-ignore: 代入されたかどうかを確認するために１を代入
  readonly isDisabled: boolean = 1;

  @Input('target') set setTarget(target: HTMLElement) {
    if (!this.isDisabled) {
      this.core.trackTargetByElement(target);
    }
  }

  @Input('targetIndex') set setTargetIndex(targetIndex: number) {
    if (!this.isDisabled) {
      this.core.trackTargetByIndex(targetIndex);
    }
  }

  @Input() orientation?: 'horizontal' | 'vertical';
  @Input() position?: 'before' | 'after';

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
    @Inject(DOCUMENT) _document: DocumentType
  ) {
    this._coreFactory = (trackerEl) => new MlStraightTrackerCore(
      this, _elementRef.nativeElement, trackerEl,
      _runOutsideNgZone, _document.createElement.bind(_document)
    );
  }

  ngOnInit(): void {
    if (this.isDisabled === 1 as any) {
      this.core.initialize();
      // @ts-ignore: assign the readonly variable
      this.isDisabled = false;
    }
  }

  ngOnChanges(changes: Changes): void {
    if (changes.orientation || changes.position) {
      this.core.updateTrackerStyle();
    }
  }

  ngAfterContentInit(): void {
    this.core.onFirstUpdateBrothers();
  }
}

