import { MlTheme } from '../../theming';

export const ML_CSS_VARIABLE_THEME: MlTheme = {
  base: 'var(--ml-base)',
  oppositeBase: 'var(--ml-opposite-base)',

  background: 'var(--ml-background)',
  primaryContainer: 'var(--ml-primary-container)',
  secondaryContainer: 'var(--ml-secondary-container)',
  tertiaryContainer: 'var(--ml-tertiary-container)',
  disabledContainer: 'var(--ml-disabled-container)',

  divider: 'var(--ml-divider)',
  elevation: 'var(--ml-elevation)',
  scrollbar: 'var(--ml-scrollbar)',

  icon: 'var(--ml-icon)',
  sliderMin: 'var(--ml-slider-min)',
  sliderOff: 'var(--ml-slider-off)',
  sliderOffActive: 'var(--ml-slider-off-active)',

  text: 'var(--ml-text)',
  secondaryText: 'var(--ml-secondary-text)',
  hintText: 'var(--ml-hint-text)',
  disabledText: 'var(--ml-disabled-text)'
} as const;
