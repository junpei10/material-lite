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

const head = document.head;
function noop(): string { return ''; }

export type MlThemeFactory = (theme: MlTheme, themePalette: MlThemePalette, forEach: MlTheming['forEachPalette']) => string;
export type MlThemeStyle = { base: string, themeFactory?: MlThemeFactory };

export type MlTheming = {
  theme: MlTheme | undefined,
  palette: (MlThemePalette & { keys: string[] }) | undefined,
  // setStyle: (component: any, style: string, createThemeStyle?: MlCreateThemeStyle) => void;
  setStyle: (style: MlThemeStyle) => void,
  init: (theme: MlTheme, palette: MlThemePalette) => void;
  forEachPalette: (callbackFn: (paletteName: string, color: string, contrast: string) => string) => string
};
export const MlTheming: MlTheming = {
  theme: undefined,
  palette: undefined,

  setStyle(style): void {
    if (!style.base) { return; }

    const themeFactory = style.themeFactory || noop;
    const { theme, palette } = this;

    head.insertAdjacentHTML('beforeend',
      '<style>' + style.base + (theme ? themeFactory(theme, palette as any, this.forEachPalette.bind({ palette })) : '') + '</style>'
    );

    // @ts-ignore
    style.base = null; style.themeFactory = null;
  },

  // nonDestructiveSetStyle(): void {},

  init(theme, palette): void {
    this.theme = theme;
    this.palette = {
      keys: Object.keys(palette) as any,
      ...palette
    };
    head.insertAdjacentHTML('beforeend',
      '<style>' +
      this.forEachPalette((paletteName, color, contrast) => {
        const styleHead = '.' + paletteName;
        return (`
          ${styleHead}-bg {
            background-color: ${color};
          }
          ${styleHead}-text {
            color: ${color};
          }
          ${styleHead}-contrast {
            color: ${contrast};
          }
        `);
      }) +
      '</style>'
    );
    // @ts-ignore: GC
    this.init = null;
  },

  forEachPalette(callbackFn: (paletteName: string, color: string, contrast: string) => string): string {
    const themePaletteRef = this.palette as (MlThemePalette & { keys: string[] });

    const keys = themePaletteRef.keys;
    const length = keys.length;

    let returns: string = '';

    for (let i = 0; i < length; i++) {
      const key = keys[i];
      const content = themePaletteRef[key];
      returns += callbackFn(key, content.color, content.contrast);
    }

    return returns;
  }
};

