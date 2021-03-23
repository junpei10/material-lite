import { insertStyleElement } from '@material-lite/angular-cdk/utils';

export type MlThemeKeys = [
  'base', 'oppositeBase',

  'background', 'primaryContainer', 'secondaryContainer', 'tertiaryContainer', 'disabledContainer',

  'divider', 'elevation', 'scrollbar', 'icon',
  'sliderMin', 'sliderOff', 'sliderOffActive',

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
  base?: string,
  theme?: (theme: MlTheme) => string,
  palette?: (name: string, color: string, contrast: string) => string
};

export type MlThemeValueStorage = {
  keys: string[] } & {
  [key: string]: MlThemeValue
};

export interface MlThemeValue {
  wrapperClass: string;
  theme: MlTheme;
  palette: MlPalette & { keys: string[] };
}

export interface MlThemingType {
  readonly valueStorage: MlThemeValueStorage;

  init(themeBases: { theme: MlTheme, palette: MlPalette, wrapperClass?: string | null }[]): void;

  setStyle(style: MlThemeStyle): void;
}

export const MlTheming: MlThemingType = {
  // @ts-ignore
  _themeStyleStacks: [],

  init(themeBases): void {
    const storage = this.valueStorage = {
      keys: []
    };

    let entryStyle = '';

    const storageKeys = storage.keys;
    let storageLen = 0;

    let forLen = themeBases.length;
    while (storageLen < forLen) {
      const base = themeBases[storageLen];
      const wrapperClass = base.wrapperClass || null!;

      if (storage[wrapperClass]) { forLen--; return; }

      storageKeys.push(wrapperClass);

      const palette = base.palette as MlPalette & { keys: string[] };

      storage[wrapperClass] = {
        wrapperClass,
        theme: base.theme,
        palette
      };

      const paletteFactory: MlThemeStyle['palette'] = (name, color, contrast) => {
        const head = '.ml-' + name;
        return `${head}-style{background-color:${color};color:${contrast}}${head}-bg{background-color:${color}}${head}-color{color:${color}}${head}-contrast{color:${contrast}}`;
      };

      const pltKeys = palette.keys = Object.keys(palette);
      const pltLen = pltKeys.length;
      let _entryStyle = '';
      for (let i = 0; i < pltLen; i++) {
        const pltName = pltKeys[i];
        const plt = palette[pltName];
        _entryStyle += paletteFactory(pltName, plt.color, plt.contrast);
      }

      if (wrapperClass) {
        const wc = '.' + wrapperClass;
        // { {
        _entryStyle = wc + ' ' + _entryStyle.replace(/\}\s*\./g, `}${wc} .`).replace(/\,\s*\./g, `,${wc} .`);
      }

      entryStyle += _entryStyle;

      storageLen++;
    }

    // init()が呼び出される前に設定されてたスタイルをすべて追加する。
    const stacks = this._themeStyleStacks as MlThemeStyle[];
    forLen = stacks.length;

    for (let index = 0; index < forLen; index++) {
      const style = stacks[index];
      entryStyle += style.base || '';

      for (let i = 0; i < storageLen; i++) {
        entryStyle += createThemeStyle(storage[storageKeys[i]], style);
      }
    }

    insertStyleElement(entryStyle);

    this._callbacks = null;
    this.init = null;
  },

  setStyle(style): void {
    const storage = this.valueStorage as MlThemeValueStorage;
    if (storage === void 0) {
      this._themeStyleStacks.push(style);
      return;
    }

    let entryStyle = style.base || '';

    const storageKeys = storage.keys;
    const storageLen = storageKeys.length;
    for (let i = 0; i < storageLen; i++) {
      entryStyle += createThemeStyle(storage[storageKeys[i]], style);
    }

    insertStyleElement(entryStyle);
  },
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

  if (value.wrapperClass) {
    const wrapperClass = '.' + value.wrapperClass;
    // { {
    entryStyle = wrapperClass + ' ' + entryStyle.replace(/\}\s*\./g, `}${wrapperClass} .`).replace(/\,\s*\./g, `,${wrapperClass} .`);
  }

  return entryStyle;
}
