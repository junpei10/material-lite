import { MlThemePalette } from '../../theming';

export const ML_DEEPPURPLE_AMBER_PALETTE: MlThemePalette = {
  primary: {
    color: '#673ab7',
    contrast: '#fff'
  },
  accent: {
    color: '#ffd740',
    contrast: 'rgba(0,0,0,.87)'
  },
  warn: {
    color: '#f44336',
    contrast: '#fff'
  }
} as const;
