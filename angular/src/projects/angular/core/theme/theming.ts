import { insertStyleElement } from '@material-lite/angular-cdk/utils';

export type MlThemeKeys = [
  'base', 'oppositeBase',

  'background', 'primaryContainer', 'secondaryContainer', 'tertiaryContainer', 'disabledContainer',

  'divider', 'elevation', 'scrollbar',

  'text', 'secondaryText', 'hintText', 'disabledText',
];
export type MlTheme = Readonly<{
  [key in MlThemeKeys[number]]: string; } & {
  }>;

export type MlThemePalette = {
  [palette: string]: {
    color: string;
    contrast: string;
  }
};

export type MlThemeFactory = (theme: MlTheme, forEach: MlTheming['forEachPalette']) => string;
export type MlThemeStyle = { base: string, themeFactory?: MlThemeFactory };

export type MlTheming = {
  theme: MlTheme,
  palette: (MlThemePalette & { keys: string[] }),
  setStyle: (style: MlThemeStyle) => void,
  init: (theme: MlTheme, palette: MlThemePalette) => void;
  forEachPalette: (callbackFn: (name: string, color: string, contrast: string) => string) => string
};
export const MlTheming: MlTheming = {
  // @ts-ignore
  theme: undefined, palette: undefined,

  setStyle(style): void {
    if (!style.base) { return; }

    const factory = style.themeFactory;
    const theme = this.theme;

    let entry = style.base;
    if (factory && theme) { entry += factory(theme, this.forEachPalette.bind({ palette: this.palette })); }

    insertStyleElement(entry);

    // @ts-ignore
    style.base = null; style.themeFactory = null;
  },

  init(theme, palette): void {
    this.theme = theme;

    // @ts-ignore
    this.palette = palette;
    this.palette.keys = Object.keys(palette);

    const initialStyle =
      this.forEachPalette((name, color, contrast) => `.${name}-bg{background-color:${color}}.${name}-text{color:${color}}.${name}-contrast{color:${contrast}}`);

    insertStyleElement(initialStyle);

    // @ts-ignore: GC
    this.init = null;
  },

  forEachPalette(callbackFn: (name: string, color: string, contrast: string) => string): string {
    const paletteRef = this.palette as (MlThemePalette & { keys: string[] });

    const keys = paletteRef.keys;
    const length = keys.length;

    let returns: string = '';

    for (let i = 0; i < length; i++) {
      const key = keys[i];
      const content = paletteRef[key];
      returns += callbackFn(key, content.color, content.contrast);
    }

    return returns;
  }
};

