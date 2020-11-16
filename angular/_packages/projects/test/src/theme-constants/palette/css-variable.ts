import { MlThemePalette } from '../../theming';

export const ML_CSS_VARIABLE_PALETTE: MlThemePalette = {
  primary: {
    color: 'var(--ml-primary)',
    contrast: 'var(--ml-primary-contrast)'
  },
  accent: {
    color: 'var(--ml-accent)',
    contrast: 'var(--ml-accent-contrast)'
  },
  warn: {
    color: 'var(--ml-warn)',
    contrast: 'var(--ml-warn-contrast)'
  }
} as const;
