import { RunOutsideNgZone, noop, CoreConfig, setCoreConfig } from '@material-lite/angular-cdk/utils';

interface WH {
  width: number;
  height: number;
}

interface XY {
  x: number;
  y: number;
}

export interface MlStraightTrackerCoreConfig {
  position?: 'before' | 'after';
  orientation?: 'horizontal' | 'vertical';
  transitionClasses?: {
    initializing?: boolean;
    starting?: boolean;
    finalize?: boolean;
  };
}

export type MlStraightTrackerSizingMode = 'loose' | 'strict' | 'strict-origin' | 'strict-target-point';

const ZERO_ORIGIN = {
  x: 0,
  y: 0
};

export class MlStraightTrackerCore {
  private _onFirstUpdate: (() => void) | null = noop;

  readonly targetElement: HTMLElement;
  readonly targetIndex: number;

  private _resizeObserver?: ResizeObserver;

  readonly hasObservedContainer: boolean = false;
  readonly hasObservedTarget: boolean = true;
  private _unobserveTargetObserver: () => void = noop;

  private _originFactory: () => XY;
  private _targetPointFactory: () => XY;

  private _prevPositionClass: string = 'ml-bottom-0';

  private _config: MlStraightTrackerCoreConfig;

  constructor(
    config: CoreConfig<MlStraightTrackerCoreConfig>,
    private _containerElement: HTMLElement,
    private _trackerElement: HTMLElement,
    private _runOutsideNgZone: RunOutsideNgZone,
    _createElement: (tagName: string, ...arg: any[]) => HTMLElement,
  ) {
    setCoreConfig(this, config);

    _trackerElement.classList.add('ml-straight-tracker', 'ml-bottom-0');

    if (ResizeObserver) {
      this._resizeObserver =
        new ResizeObserver(this._onResize.bind(this));
    }

    this.setSizingMode('loose');
  }

  /**
   * `resizeObserver`が変更を感知したときに呼び出される関数。
   * 引数に渡される値から、ターゲットのサイズの情報だけをくり抜き、`setTrackerStyle`関数を呼び出す。
   */
  private _onResize(entries: ResizeObserverEntry[]): void {
    const targetEl = this.targetElement;

    const entry0 = entries[0];
    const entry1 = entries[1];

    let targetSize: WH | undefined;

    if (entry0.target === targetEl) {
      const base = entry0.borderBoxSize[0];
      targetSize = {
        width: base.inlineSize,
        height: base.inlineSize
      };

    } else if (entry1 && entry1.target === targetEl) {
      const base = entry1.borderBoxSize[0];
      targetSize = {
        width: base.inlineSize,
        height: base.inlineSize
      };
    }

    this.setTrackerStyle(
      this._originFactory(),
      this._targetPointFactory(),
      targetSize
    );
  }

  /**
   * - `setSizingMode`関数が呼び出されていないとき、デフォルトとして`loose`を設定
   * - `"ml-straight-tracker-initializing" class`を一瞬だけ要素に付与
   */
  initialize(): void {
    if (this._config.transitionClasses?.initializing) {
      this._oneFrameTransitionClasses('initializing');
    }
  }

  /**
   * - `ResizeObserver`に接続されている要素をすべて`unsubscribe`
   * - `"ml-straight-tracker-finalizing" class`を一瞬だけ要素に付与
   */
  finalize(): void {
    const resizeObs = this._resizeObserver;
    if (resizeObs) {
      resizeObs.disconnect();
    }

    if (this._config.transitionClasses?.finalize) {
      this._oneFrameTransitionClasses('finalizing');
    }
  }

  trackTargetByIndex(index: number): void {
    if (this._onFirstUpdate) {
      this._onFirstUpdate = () => {
        this._onFirstUpdate = null;
        this.trackTargetByIndex(index);
      };
      return;
    }

    const brothers = this._containerElement.parentElement!.children;

    const containerEl = this._containerElement;

    let targetIndex = index;
    for (let i = 0; i <= index; i++) {
        if (brothers.item(i) === containerEl) {
        targetIndex++;
        break;
      }
    }

    const targetEl = brothers[targetIndex] as HTMLElement;

    if (!targetEl || this.targetElement === targetEl) {
      return; // 抽出されたターゲットが既に選択されている場合
    }

    this._trackTarget(targetEl, targetIndex);
  }


  trackTargetByElement(target: HTMLElement): void {
    if (this._onFirstUpdate) {
      this._onFirstUpdate = () => {
        this._onFirstUpdate = null;
        this.trackTargetByElement(target);
      };
      return;
    }

    const brothers = this._containerElement.parentElement!.children;
    const broLen = brothers.length;

    const targetIndex = -1;
    for (let i = 0; i < broLen; i++) {
      if (brothers[i] === target) {
        // @ts-ignore
        targetIndex = i;
        return;
      }
    }

    if (targetIndex === -1 || this.targetElement === target) {
      return; // targetがbrothersに存在しない場合 または 存在したターゲットが既に選択されている場合
    }

    this._trackTarget(target, targetIndex);
  }


  private _trackTarget(targetEl: HTMLElement, targetIndex: number): void {
    // @ts-ignore: assign the readonly variable
    this.targetElement = targetEl; // @ts-ignore
    this.targetIndex = targetIndex;

    const resizeObs = this._resizeObserver;
    if (resizeObs && this.hasObservedTarget) {
      this._unobserveTargetObserver();
      this._unobserveTargetObserver = () => resizeObs.unobserve(targetEl);

      resizeObs.observe(targetEl, { box: 'border-box' });

    } else {
      const targetPoint = targetEl.getBoundingClientRect();

      this.setTrackerStyle(
        this._originFactory(),
        targetPoint, targetPoint
      );
    }

    if (this._config.transitionClasses?.starting) {
      this._oneFrameTransitionClasses('starting');
    }
  }


  /**
   * 引数で代入された座標をもとに、trackerのstyleを変更する。
   *
   * - `orientation="vertical"`時
   *  - `height` and `top`
   * - `orientation="horizontal"`時
   *  - `width` and `left`
   */
  setTrackerStyle(origin: XY, targetPoint: XY, targetSize?: WH | undefined): void {
    const el = this._trackerElement;
    const conf = this._config;

    if (conf.orientation === 'vertical') {
      el.style.top = `${targetPoint.y - origin.y}px`;

      if (targetSize) {
        el.style.height = `${targetSize.height}px`;
      }

    } else {
      el.style.left = `${targetPoint.x - origin.x}px`;

      if (targetSize) {
        el.style.width = `${targetSize.width}px`;
      }
    }
  }

  switchTargetObserverState(isEnabled: boolean): void {
    const resizeObs = this._resizeObserver;

    if (this.hasObservedTarget === isEnabled || !resizeObs) { return; }

    // @ts-ignore: assign readonly variable
    this.hasObservedTarget = isEnabled;

    const targetEl = this.targetElement;

    if (isEnabled && targetEl) {
      this._unobserveTargetObserver();
      this._unobserveTargetObserver = () => resizeObs.unobserve(targetEl);

      resizeObs.observe(targetEl, { box: 'border-box' });

    } else {
      this._unobserveTargetObserver();
      this._unobserveTargetObserver = noop;
    }
  }

  switchContainerObserverState(isEnabled: boolean): void {
    const resizeObs = this._resizeObserver;

    if (this.hasObservedContainer === isEnabled || !resizeObs) { return; }

    // @ts-ignore assign the readonly variable
    this.hasObservedContainer = isEnabled;

    const containerEl = this._containerElement;

    isEnabled
      ? resizeObs.observe(containerEl, { box: 'border-box' })
      : resizeObs.unobserve(containerEl);
  }

  /**
   * 設定してある変数をもとに、`top: 0`, `right: 0`, `left: 0`, `bottom: 0`が付与される`class`を切り替える。
   *
   * - `.ml-top-0`, `.ml-left-0` `.ml-right-0`, `.ml-bottom-0`
   */
  updateTrackerPosition(): void {
    const classList = this._trackerElement.classList;
    const conf = this._config;

    classList.remove(this._prevPositionClass);

    let currPositionClass: string;

    if (conf.orientation === 'vertical') {
      this._prevPositionClass = currPositionClass =
        (conf.position === 'before')
          ? 'ml-left-0'
          : 'ml-right-0';

    } else {
      this._prevPositionClass = currPositionClass =
        (conf.position === 'before')
          ? 'ml-top-0'
          : 'ml-bottom-0';
    }

    classList.add(currPositionClass);
  }


  /**
   * `setTrackerStyle`のサイズを取得する方法を変え、その関数を呼び出す`trackTarget`関数等に影響を及ぼす。
   * デフォルトで`loose`になっている。
   *
   * - `"loose" mode`
   *  `getBoundingRect()`関数を呼び出さないため処理は軽くなるが、"追跡される要素の座標"の詳しい値を求めることができない。
   *
   * - `"strict" mode`
   *  "原点の座標"と"追跡される要素の座標"を`getBoundingRect()`関数を使用して詳しい値を求める。"原点の座標"と"追跡される要素の座標"どちらも不確定の場合に選択する。
   *
   * - `"strict-origin" mode`
   *  "原点の座標"のみ、`getBoundingRect()`関数を使用して正確な値を求める。"原点の座標"が不確定だが、"追跡される要素の座標"が整数とわかっているときに選択するのがおすすめ。
   *
   * - `"strict-target-point" mode`
   *  "追跡される要素の座標"のみ、`getBoundingRect()`関数を使用して正確な値を求める。"追跡される要素の座標"が不確定だが、"原点の座標"が整数とわかっているときに選択するのがおすすめ。
   */
  setSizingMode(mode: MlStraightTrackerSizingMode): void {
    switch (mode) {
      case 'loose':
        this._originFactory = () => ZERO_ORIGIN;
        this._targetPointFactory = () => createLoosePoint(this.targetElement);
        break;

      case 'strict':
        this._originFactory = () => this._trackerElement.parentElement.getBoundingClientRect();
        this._targetPointFactory = () => this.targetElement.getBoundingClientRect();
        break;

      case 'strict-origin':
        this._originFactory = () => this._trackerElement.parentElement.getBoundingClientRect();
        this._targetPointFactory = () => createLoosePoint(this.targetElement);
        break;

      case 'strict-target-point':
        this._originFactory = () => createLoosePoint(this._trackerElement.parentElement);
        this._targetPointFactory = () => this.targetElement.getBoundingClientRect();
    }
  }

  onUpdateBrothers(): void {
    const onFirstUpdate = this._onFirstUpdate;
    if (onFirstUpdate) {
      onFirstUpdate();
    }
  }

  private _oneFrameTransitionClasses(state: string): void {
    const name = 'ml-straight-tracker-' + state;
    const trackerClassList = this._trackerElement.classList;
    trackerClassList.add(name);
    this._runOutsideNgZone(() =>
      setTimeout(() => trackerClassList.remove(name), 16)
    );
  }
}

function createLoosePoint(element: HTMLElement): XY {
  return {
    x: element.offsetLeft,
    y: element.offsetTop,
  };
}
