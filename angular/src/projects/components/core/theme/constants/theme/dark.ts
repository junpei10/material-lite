import { MlTheme } from '../../theming';

export const ML_DARK_THEME: MlTheme = {
  base: '#000',
  oppositeBase: '#fff',
  background: '#303030',
  primaryContainer: '#212121',
  secondaryContainer: '#424242',
  tertiaryContainer: '#606060',
  disabledContainer: 'rgba(255,255,255,.16)',
  divider: 'rgba(255,255,255,.16)',
  scrollbar: 'rgba(255,255,255,.16)',
  elevation: '#000',
  icon: '#',
  sliderMin: '#fff',
  sliderOff: 'rgba(255,255,255,.4)',
  sliderOffActive: 'rgba(255,255,255,.4)',
  sliderThumb: 'rgba(255,255,255,.56)',
  text: '#fff',
  secondaryText: 'rgba(255,255,255,.72)',
  hintText: 'rgba(255,255,255,.64)',
  disabledText: 'rgba(255,255,255,.4)'
} as const;
