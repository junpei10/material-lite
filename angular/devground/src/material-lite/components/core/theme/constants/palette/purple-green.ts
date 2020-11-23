import { MlThemePalette } from '../../theming';

export const ML_PURPLE_GREEN_PALETTE: MlThemePalette = {
  primary: {
    color: '#9c27b0',
    contrast: '#fff'
  },
  accent: {
    color: '#69f0ae',
    contrast: 'rgba(0,0,0,.87)'
  },
  warn: {
    color: '#f44336',
    contrast: '#fff'
  }
} as const;
