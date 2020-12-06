import { insertStyleElement } from '@material-lite/angular-cdk/utils';

export type MlThemeKeys = [
  'base', 'oppositeBase',

  'background', 'primaryContainer', 'secondaryContainer', 'tertiaryContainer', 'disabledContainer',

  'divider', 'elevation', 'scrollbar',

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

export interface MlThemingType {
  value: { keys: string[] } & {
    [key: string]: {
      wrapperClass: string;
      theme: MlTheme,
      palette: MlPalette & { keys: string[] },
    }
  };

  init(themes: { theme: MlTheme, palette: MlPalette, wrapperClass?: string | null }[]): void;

  setStyle(style: MlThemeStyle): void;
}

export const MlTheming: MlThemingType = {
  // @ts-ignore
  value: {
    keys: []
  },

  init(themes): void {
    const len = themes.length;

    for (let i = 0; i < len; i++) {
      const argValue = themes[i];
      const argWc = argValue.wrapperClass || null!;
      const valRef = this.value;

      if (valRef[argWc]) { return; }

      this.value.keys.push(argWc);
      const val = this.value[argWc] = {
        wrapperClass: argWc,
        theme: argValue.theme,
        palette: argValue.palette as MlPalette & { keys: string[] }
      };
      val.palette.keys = Object.keys(argValue.palette);
    }

    this.setStyle({
      palette: (name, color, contrast) => {
        const head = '.ml-' + name;
        return `${head}{background-color:${color};color:${contrast}}${head}-bg{background-color:${color}}${head}-color{color:${color}}${head}-contrast{color:${contrast}}`;
      }
    });
  },

  setStyle(style): void {
    if (style.base === null) { return; }

    let returns = style.base || '';

    const valRef = this.value;
    const valKeys = valRef.keys;
    const valLen = valKeys.length;
    for (let index = 0; index < valLen; index++) {
      const val = valRef[valKeys[index]];
      let entryStyle = style.theme?.(val.theme) || '';

      if (style.palette) {
        const pltRef = val.palette;
        const pltKeys = pltRef.keys;
        const pltLen = pltKeys.length;
        for (let i = 0; i < pltLen; i++) {
          const pltName = pltKeys[i];
          const plt = pltRef[pltName];
          entryStyle += style.palette(pltName, plt.color, plt.contrast);
        }
      }

      if (val.wrapperClass) {
        const wc = '.' + val.wrapperClass;

        entryStyle = wc + ' ' + entryStyle.replace(/\}\s*\./g, `}${wc} .`).replace(/\,\s*\./g, `,${wc} .`);
      }
      returns += entryStyle;
    }

    insertStyleElement(returns);

    // @ts-ignore
    style.base = null; style.theme = null; style.palette = null;
  },
};
