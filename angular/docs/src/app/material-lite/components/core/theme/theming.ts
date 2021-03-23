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
  valueStorage: MlThemeValueStorage;

  init(themeBases: { theme: MlTheme, palette: MlPalette, wrapperClass?: string | null }[]): void;

  setStyle(style: MlThemeStyle): void;
}

const STYLE: MlThemeStyle = {
  palette: (name, color, contrast) => {
    const head = '.ml-' + name;
    return `${head}-style{background-color:${color};color:${contrast}}${head}-bg{background-color:${color}}${head}-color{color:${color}}${head}-contrast{color:${contrast}}`;
  }
};

export const MlTheming: MlThemingType = {
  // @ts-ignore
  _callbacks: [],

  init(themeBases): void {
    this.valueStorage = {
      keys: []
    };

    let forLen = themeBases.length;

    for (let i = 0; i < forLen; i++) {
      const base = themeBases[i];
      const wrapperClass = base.wrapperClass || null!;

      if (this.valueStorage[wrapperClass]) { return; }

      this.valueStorage.keys.push(wrapperClass);

      const val = this.valueStorage[wrapperClass] = {
        wrapperClass,
        theme: base.theme,
        palette: base.palette as MlPalette & { keys: string[] }
      };

      val.palette.keys = Object.keys(base.palette);
    }

    this.setStyle(STYLE);

    const callbacks = this._callbacks as (() => void)[];
    forLen = callbacks.length;

    for (let i = 0; i < forLen; i++) {
      callbacks[i]();
    }

    this._callbacks = null;
  },

  setStyle(style): void {
    if (style.base === null) { return; }

    const storage = this.valueStorage as MlThemeValueStorage;
    if (storage === void 0) {
      this._callbacks.push(() => this.setStyle(style));
      return;
    }

    let entryStyle = style.base || '';

    const storageKeys = storage.keys;
    const storageLen = storageKeys.length;
    for (let i = 0; i < storageLen; i++) {
      entryStyle += this._createThemeStyle(style, storage[storageKeys[i]]);
    }

    insertStyleElement(entryStyle);

    style.base = null; style.theme = null; style.palette = null;
  },

  // @ts-ignore
  _createThemeStyle(style: MlThemeStyle, value: MlThemeValue): string {
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
};
