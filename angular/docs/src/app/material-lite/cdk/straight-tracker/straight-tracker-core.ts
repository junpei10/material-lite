import { ElementRef } from '@angular/core';
import { RunOutsideNgZone, ContainerResizeObserver, noop, insertStyleElement, CoreConfig, setCoreConfig } from '@material-lite/angular-cdk/utils';

insertStyleElement('.ml-straight-tracker{position:absolute;transition-timing-function:cubic-bezier(0.35, 0, 0.25, 1);transition-duration: 400ms}');

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
  brothersIsFixed?: boolean;
}

export type MlStraightTrackerSizingMode = 'loose' | 'strict' | 'strict-origin' | 'strict-target-point';

const ZERO_ORIGIN = {
  x: 0,
  y: 0
};

export class MlStraightTrackerCore {
  private _brothersCollection: HTMLCollection;

  private _brotherElements: HTMLElement[] = [];
  private _prevBrotherElementCount: number;

  private _onFirstUpdate: (() => number) | null = (() => 0);

  readonly targetElement: HTMLElement;
  readonly targetIndex: number;

  readonly hasObservedTarget: boolean = true;
  private _unobserveTargetObserver: () => void = noop;

  private _resizeObserver?: ResizeObserver;
  containerResizeObserver?: ContainerResizeObserver;

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

    this._brothersCollection = this._containerElement.children;

    _trackerElement.classList.add('ml-straight-tracker', 'ml-bottom-0');

    if (ResizeObserver) {
      const resizeObs = this._resizeObserver =
        new ResizeObserver(this._onResize.bind(this));

      this.containerResizeObserver =
        new ContainerResizeObserver(
          resizeObs, _trackerElement.append.bind(_trackerElement), _createElement
        );
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
    const trackerClasslist = this._trackerElement.classList;
    trackerClasslist.add('ml-straight-tracker-initializing');
    this._runOutsideNgZone(() =>
      setTimeout(() => trackerClasslist.remove('ml-straight-tracker-initializing'), 16)
    );
  }

  /**
   * - `ResizeObserver`に接続されている要素をすべて`unsubscribe`
   * - `"ml-straight-tracker-finalizing" class`を一瞬だけ要素に付与
   */
  finalize(): void {
    const contResizeObs = this.containerResizeObserver;
    if (contResizeObs) {
      contResizeObs.unobserve();
      this._resizeObserver!.disconnect();
    }

    const trackerClasslist = this._trackerElement.classList;
    trackerClasslist.add('ml-straight-tracker-finalizing');
    this.trackTarget(this.targetIndex);
    this._runOutsideNgZone(() =>
      setTimeout(() => trackerClasslist.remove('ml-straight-tracker-finalizing'), 16)
    );
  }


  /**
   * 第一引数に代入した番号を追跡する。追跡済みの場合や、追跡したい要素が見つからなかった場合は処理を行わない。
   *
   * - `targetElement`変数と`targetIndex`変数の更新
   * - `ResizeObserver`で監視する要素の更新
   * - `setTrackStyle`関数の呼び出し
   * - 追跡が始まったときに一瞬、`"ml-straight-tracker-starting" class`を付与
   */
  trackTarget(targetIndex: number): void {
    // `ignoreBrock`=true かつ 現在選択されているインデックスと引数のインデックスが同じ場合中断
    if (targetIndex === this.targetIndex) { return; }

    const currTargetEl = this._brotherElements[targetIndex];
    if (!currTargetEl) { return; } // ターゲットがない場合は中断

    // @ts-ignore: assign the readonly variable
    this.targetIndex = targetIndex; this.targetElement = currTargetEl;

    const targetResizeObs = this._resizeObserver;
    if (targetResizeObs && this.hasObservedTarget) {
      this._unobserveTargetObserver();
      this._unobserveTargetObserver = () => targetResizeObs.unobserve(currTargetEl);

      targetResizeObs.observe(currTargetEl, { box: 'border-box' });

    } else {
      const targetPoint = currTargetEl.getBoundingClientRect();

      this.setTrackerStyle(
        this._originFactory(),
        targetPoint, targetPoint
      );
    }

    // １フレームクラスを追加
    const trackerClassList = this._trackerElement.classList;
    trackerClassList.add('ml-straight-tracker-starting');
    this._runOutsideNgZone(() => {
      setTimeout(() => trackerClassList.remove('ml-straight-tracker-starting'), 16);
    });
  }

  trackTargetByIndex(index: number): void {
    // const bros = trackerEl.parentElement!.children;

    // const containerObsEl = this.containerResizeObserver.element;

    // let skipCount: number;
    // for (let i = 0; i < index; i++) {
    //   const el = bros[i];
    //   if (el === trackerEl || el === containerObsEl) {
    //     skipCount++;
    //   }
    // }

    // const targetIndex = index + skipCount;
    // const target = bros[targetIndex];
  }

  trackTargetByElement(element: Element): void {
    // const bros = this._trackerElementRef.nativeElement.parentElement!.childNodes;

    // const containerObsEl = this.containerResizeObserver.element;
  }


  /**
   * 兄弟要素が取得されているかどうかを判定する。
   *
   * また、兄弟要素が取得される前に`trackTarget(...)`関数を呼び出す場合、この関数を呼ぶことで引数の値を保存し、
   * 兄弟要素が取得されたタイミングで`trackTarget(保存した値)`関数を呼び出すように設定できる。
   */
  shouldTrackTarget(target: HTMLElement | number): boolean {
    if (this._onFirstUpdate) {
      this._onFirstUpdate =
        (typeof target === 'number')
          ? () => target
          : () => this.indexOfBrotherElements(target);

      return false;
    } else {

      return true;
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

  setTargetObserverState(isEnabled: boolean): void {
    // @ts-ignore: assign readonly variable
    const result = this.hasObservedTarget = isEnabled;

    const targetResizeObs = this._resizeObserver;
    const targetEl = this.targetElement;

    if (!(targetResizeObs && targetEl)) { return; }

    if (result) {
      this._unobserveTargetObserver();
      this._unobserveTargetObserver = () => targetResizeObs.unobserve(targetEl);

      targetResizeObs.observe(targetEl);

    } else {
      this._unobserveTargetObserver();
      this._unobserveTargetObserver = noop;
    }
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


  /**
   * 以前この関数を呼び出したときに保存してある兄弟要素の数と比較し、要素の数に変更があった場合`_ouUpdateBrotherElements`関数を呼び出す。
   * `ngAfterContentInit`関数などで呼び出す。
   */
  checkBrotherElement(): void {
    const count = this.targetElement.childElementCount;

    if (this._prevBrotherElementCount !== count) {
      this._prevBrotherElementCount = count;
      this.onUpdateBrotherElements();
    }
  }

  /**
   * 親要素にアクセスし、兄弟要素の一覧を取得。その後、`tracker`と`親要素のサイズ監視用の要素`を除いた配列を作成し、
   * 最後に`trackerTarget(...)`関数を呼び出すことで、スタイルのアップデートを行う。
   */
  onUpdateBrotherElements(): void {
    // `_firstUpdateData`が存在するということは、初めて`BrotherElement`を取得したということ
    const _onFirstUpdate = this._onFirstUpdate;
    if (_onFirstUpdate) {
      // @ts-ignore: assign readonly variable
      this.targetIndex = _onFirstUpdate();
      this._onFirstUpdate = null;
    }

    const trackerEl = this._trackerElement;

    const brothersCollection = trackerEl.parentElement!.children;
    const brothersCollectionLen = brothersCollection.length;

    const currBrothers: HTMLElement[] = [];
    let currBrotherLen: number = brothersCollectionLen;

    const contResizeObsEl = this.containerResizeObserver?.element;

    for (let i = 0; brothersCollectionLen > i; i++) {
      const value = brothersCollection[i] as HTMLElement;
      (trackerEl === value || contResizeObsEl === value)
        ? currBrotherLen--
        : currBrothers.push(value);
    }

    const prevBrotherLen = this._brotherElements.length;
    this._brotherElements = currBrothers;

    const targetIndex = this.targetIndex;
    if ((prevBrotherLen - 1 === targetIndex) && (prevBrotherLen > currBrotherLen)) {
      // 最後のタブを選択していたとき & 兄弟要素の数が減った
      this.trackTarget(currBrotherLen - 1);

    } else {
      const currIndex = this.targetIndex;

      // @ts-ignore: 重複追跡を回避
      this.targetIndex = null;
      this.trackTarget(currIndex);
    }
  }


  /**
   * 引数に代入した要素のインデックスを求め、戻り地として返す。
   *
   * 存在しない場合は`-1`が返る。
   */
  indexOfBrotherElements(element: Element): number {
    const broEls = this._brotherElements;
    const len = broEls.length;

    let result: number = -1;

    for (let i = 0; i < len; i++) {
      if (element === broEls[i]) {
        result = i;
        break;
      }
    }

    return result;
  }
}


function createLoosePoint(element: HTMLElement): XY {
  return {
    x: element.offsetLeft,
    y: element.offsetTop,
  };
}
