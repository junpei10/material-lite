import { ElementRef } from '@angular/core';
import { NoConstructor } from './mixin';

export declare abstract class CanTheme {
  protected abstract _elementRef: ElementRef<HTMLElement>;
  theme?: string;
}

export function mixinTheme(base: NoConstructor<any>): NoConstructor<CanTheme> {
  // @ts-ignore
  return class extends base {
    _elementRef: ElementRef<HTMLElement>;
    _theme?: string;

    get theme(): string | undefined { return this._theme; }
    set theme(theme: string | undefined) {
      const classList = this._elementRef.nativeElement.classList;

      if (this._theme) {
        classList.remove('ml-' + this._theme);
      }

      if (theme) {
        classList.add('ml-' + theme);
      }

      this._theme = theme;
    }
  };
}

mixinTheme.prototype.id = 2;
