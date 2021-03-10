export type TransitionType = 'leave' | 'enter';

export class TransitionClasses {
  private _timeout: number;

  readonly previousBaseClassName: string;

  get animateRef(): this['animate'] {
    return this.animate.bind(this);
  }

  constructor(private _targetClassList: DOMTokenList) {}

  /**
   * クラス生成時に代入した要素の`classList`に対し、適切なタイミングで`css class`を追加・削除する。
   * Vueの`Transition Classes`と参考に作成した関数。
   *
   * @param type -
   * @param className
   * 適切に付与される`css class`の名前に影響を与える。
   * `.{className}-{type}` (ex)`.example-enter`
   *
   * @param duration animationに要する期間を入力する。vueと違い、自動で`transition-duration`を算出する機能は今のところない。
   *
   * @ref-site https://jp.vuejs.org/v2/guide/transitions.html
   * @ref-image https://jp.vuejs.org/images/transition.png
   */
  animate(type: TransitionType, className: string, duration: number): Promise<void> {
    const classList = this._targetClassList;

    const timeout = this._timeout;
    if (timeout) {
      clearTimeout(timeout);
      this._timeout = 0;

      const prevNameBase = this.previousBaseClassName;
      classList.remove(prevNameBase + '-active', prevNameBase + '-to');
    }

    const baseClass = className + '-' + type;
    const toClass = baseClass + '-to';
    const activeClass = baseClass + '-active';

    // @ts-ignore assign readonly variable
    this.previousBaseClassName = baseClass;

    // add [.ex] & [.ex-active]
    classList.add(baseClass, activeClass);

    return new Promise(resolve => {
      setTimeout(() => {
        classList.remove(baseClass);
        classList.add(toClass);

        this._timeout = setTimeout(() => {
          // remove [.ex-to] & [.ex-active]
          classList.remove(toClass, activeClass);
          this._timeout = 0;
          resolve();
        }, duration) as any;
      }, 16);
    });
  }
}
