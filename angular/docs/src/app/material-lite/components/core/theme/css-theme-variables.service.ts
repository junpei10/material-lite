import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { MlPalette, MlTheme, MlThemeKeys } from './theming';

let THEME_KEYS: MlThemeKeys;

// @dynamic
@Injectable({
  providedIn: 'root'
})
export class MlCssVariables {
  private _styleElement: HTMLElement;

  constructor(@Inject(DOCUMENT) _document: Document) {
    const el = this._styleElement = _document.createElement('style');
    _document.head.appendChild(el);
  }

  set(theme: MlTheme, palette: MlPalette & { keys: string[] }, wrapperClass?: string): void {
    let keys: string[];
    if (THEME_KEYS) {
      keys = THEME_KEYS;
    } else {
      keys = THEME_KEYS =
        Object.keys(theme) as MlThemeKeys;
    }

    let result = (wrapperClass || ':root') + '{';

    let len = keys.length;
    for (let i = 0; i < len; i++) {
      const key = keys[i];
      // @ts-ignore
      result += '--ml-' + key + ':' + theme[key] + ';';
    }

    keys = palette.keys;
    len = keys.length;
    for (let i = 0; i < len; i++) {
      const key = keys[i];
      const val = palette[key];
      result += '--ml-' + key + ':' + val.color + ';--ml-' + key + '-contrast:' + val.contrast + ';';
    }

    this._styleElement.textContent = result;
  }
}
