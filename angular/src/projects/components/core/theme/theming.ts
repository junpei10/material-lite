import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Falsy, MlDocument, styling } from '@material-lite/angular-cdk/utils';
import { noop } from 'rxjs';

export type MlThemeKeys = [
  'base', 'oppositeBase',

  'background', 'primaryContainer', 'secondaryContainer', 'tertiaryContainer', 'disabledContainer',

  'divider', 'elevation', 'scrollbar', 'icon',
  'sliderMin', 'sliderOff', 'sliderOffActive', 'sliderThumb',

  'text', 'secondaryText', 'hintText', 'disabledText',
];
export type MlTheme = {
  [key in MlThemeKeys[number]]: string;
};

export type MlPalette = {
  [palette: string]: {
    color: string;
    contrast: string;
  }
};

export type MlThemeStyle = {
  theme?: (theme: MlTheme) => string,
  palette?: (name: string, color: string, contrast: string) => string
};

export type MlThemeValueStorage = {
  keys: string[] } & {
  [key: string]: MlThemeValue
};

export interface MlThemeValue {
  theme: MlTheme;
  palette: MlPalette & { keys: string[] };
  wrapperClass?: string | Falsy;
  wrapperTagName?: string | Falsy;
}

interface Theming {
  readonly valueStorage: MlThemeValueStorage;
  readonly themeKeys: MlThemeKeys;
  set: (style: MlThemeStyle) => void;
}

export const theming: Theming = {
  themeKeys: ['base', 'oppositeBase', 'background', 'primaryContainer', 'secondaryContainer', 'tertiaryContainer', 'disabledContainer', 'divider', 'elevation', 'scrollbar', 'icon', 'sliderMin', 'sliderOff', 'sliderOffActive', 'sliderThumb', 'text', 'secondaryText', 'hintText', 'disabledText'],

  set(style): void {
    // @ts-ignore
    this._themeStacks.push(style);
  },

  // @ts-ignore
  _themeStacks: [],

  _init(themeBases: ThemeBases): void {
    // @ts-ignore: assign the readonly variable
    const storage = this.valueStorage = {
      keys: []
    } as MlThemeValueStorage;

    let entryStyle = '';

    const storageKeys = storage.keys;
    let storageLen = 0;

    let forLen = themeBases.length;
    let skipCount = 0;

    while (storageLen < forLen) {
      const base = themeBases[storageLen] as MlThemeValue;
      const wrapperClass = base.wrapperClass || (base.wrapperClass = null!);

      storageLen++;
      if (storage[wrapperClass]) { skipCount++; continue; }

      storageKeys.push(wrapperClass);

      storage[wrapperClass] = base;

      const paletteFactory: MlThemeStyle['palette'] = (name, color, contrast) =>
        `.ml-${name}-style{background-color:${color};color:${contrast}}.ml-${name}-bg{background-color:${color}}.ml-${name}-color{color:${color}}.ml-${name}-contrast{color:${contrast}}`;

      const palette = base.palette as MlThemeValue['palette'];

      const pltKeys = palette.keys = Object.keys(palette);
      const pltLen = pltKeys.length;
      let _entryStyle = '';
      for (let i = 0; i < pltLen; i++) {
        const pltName = pltKeys[i];
        const plt = palette[pltName];
        _entryStyle += paletteFactory(pltName, plt.color, plt.contrast);
      }

      const wrapperTagName = base.wrapperTagName === void 0 ? 'body' : base.wrapperTagName;
      const theme = base.theme;

      if (wrapperClass) {
        const wc = '.' + wrapperClass; // { {
        _entryStyle =
          (wrapperTagName ? `${wrapperTagName + wc}{background-color:${theme.background};color:${theme.text}}` : '') +
          wc + ' ' + _entryStyle.replace(/\}\s*\./g, `}${wc} .`).replace(/\,\s*\.(?![0-9])/g, `,${wc} .`);

      } else if (wrapperTagName) {
        _entryStyle += `${wrapperTagName}{background-color:${theme.background};color:${theme.text}}`;
      }

      entryStyle += _entryStyle;
    }

    storageLen -= skipCount;

    this.set = (style: MlThemeStyle) => {
      let es: string = '';

      for (let i = 0; i < storageLen; i++) {
        es += createThemeStyle(storage[storageKeys[i]], style);
      }

      styling.insert(es);
    };

    // init()が呼び出される前に設定されてたスタイルをすべて追加する。
    // @ts-ignore
    const stacks = this._themeStacks as MlThemeStyle[];
    forLen = stacks.length;

    for (let index = 0; index < forLen; index++) {
      const style = stacks[index];
      entryStyle += '';

      for (let i = 0; i < storageLen; i++) {
        entryStyle += createThemeStyle(storage[storageKeys[i]], style);
      }
    }

    styling.insert(entryStyle);

    // @ts-ignore
    this._themeStacks = null; this._init = null;
  }
};

function createThemeStyle(value: MlThemeValue, style: MlThemeStyle): string {
  let entryStyle = style.theme?.(value.theme) || '';

  const paletteFactory = style.palette;
  if (paletteFactory) {
    const pltValue = value.palette;
    const pltKeys = pltValue.keys;
    const pltLen = pltKeys.length;

    for (let i = 0; i < pltLen; i++) {
      const pltName = pltKeys[i];
      const plt = pltValue[pltName];
      entryStyle += paletteFactory(pltName, plt.color, plt.contrast);
    }
  }

  const wrapperClass = value.wrapperClass;

  if (wrapperClass) { // tslint:disable-next-line:max-line-length {{
    entryStyle = '.' + wrapperClass + ' ' + entryStyle.replace(/\}\s*\./g, `}.${wrapperClass} .`).replace(/\,\s*\.(?![0-9])/g, `,.${wrapperClass} .`);
  }

  return entryStyle;
}


type ThemeBases = (Omit<MlThemeValue, 'palette'> & {
  palette: MlPalette;
})[];

@Injectable({
  providedIn: 'root'
})
export class MlTheming {
  private _cssVariablesStyleElementRef: {
    [key: string]: HTMLStyleElement
  } = {};

  constructor(
    @Inject(DOCUMENT) private _document: MlDocument
  ) {}

  initialize(themeBases: ThemeBases | null): void {
    const _theming = theming as Theming & { _init: (b: ThemeBases) => void, _themeStacks: any[] };

    // 一度しか反映されない
    if (!_theming._init) { return; }

    if (themeBases) {
      _theming._init(themeBases);

    } else {
      // @ts-ignore: assign the readonly variable
      _theming.valueStorage = {};
      _theming.set = noop;

      // @ts-ignore
      _theming._init = null; _theming._themeStacks = null;
    }

    styling.setHeadElement(this._document.head);
  }

  setCssVariables(base: { theme: MlTheme, palette: MlPalette, wrapperClass?: string | null }): void {
    const wrapperClass = base.wrapperClass || null!;

    let styleElement = this._cssVariablesStyleElementRef[wrapperClass];
    if (!styleElement) {
      const doc = this._document;

      styleElement = this._cssVariablesStyleElementRef[wrapperClass]
        = doc.createElement('style') as HTMLStyleElement;

      doc.head.appendChild(styleElement);
    }

    let keys: string[] = theming.themeKeys;

    const themeValue = theming.valueStorage[wrapperClass];

    let entryStyle = (wrapperClass ? '.' + wrapperClass : ':root') + '{';

    const theme = base.theme;
    let len = keys.length;
    for (let i = 0; i < len; i++) {
      const key = keys[i]; // @ts-ignore
      entryStyle += '--ml-' + key + ':' + theme[key] + ';';
    }

    const palette = themeValue.palette;
    keys = palette.keys;
    len = keys.length;
    for (let i = 0; i < len; i++) {
      const key = keys[i];
      const val = palette[key];
      entryStyle += '--ml-' + key + ':' + val.color + ';--ml-' + key + '-contrast:' + val.contrast + ';';
    }

    styleElement.textContent = entryStyle;
  }
}
