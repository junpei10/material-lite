import { insertStyleElement } from './insert-style-element';

insertStyleElement('.container-resize-observer{position:absolute;top:0;width:100%;height:100%;pointer-events:none;}');

/**
 * コンテナ要素（親要素）に直接Observerを追加することを回避するためのクラス。（親要素に直接アクセスして変更を加えるのは良くないため）
 * コンテナ要素の下に、サイズが一緒かつレイアウトに影響を与えない要素を挿入し、それにResizeObserverで監視することで、擬似的にコンテナ要素のサイズを監視している。
 */
export class ContainerResizeObserver {
  readonly element: HTMLElement | null;

  get hasObserved(): boolean {
    return !!this.element;
  }

  constructor(
    private _containerElement: HTMLElement,
    private _resizeObserver: ResizeObserver,
    private _createElement: (tagName: string, ...a: any[]) => HTMLElement,
    private _tagName: string = 'div'
  ) {}

  observe(options?: ResizeObserverOptions): void {
    if (this.element) { return; }

    // @ts-ignore: assign readonly variable
    const el = this.element =
      this._createElement(this._tagName);

    el.classList.add('container-resize-observer');

    this._containerElement.appendChild(el);
    this._resizeObserver.observe(el, options);
  }

  unobserve(): void {
    const el = this.element;
    if (!el) { return; }

    this._containerElement.removeChild(el);
    this._resizeObserver.unobserve(el);

    // @ts-ignore: assign readonly variable
    this.element = null;
  }
}
