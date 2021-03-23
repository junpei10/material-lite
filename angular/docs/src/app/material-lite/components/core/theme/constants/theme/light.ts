import { MlTheme } from '../../theming';

export const ML_LIGHT_THEME: MlTheme = {
  base: 'white',
  oppositeBase: 'black',

  background: '#f5f5f5',
  primaryContainer: '#fafafa',
  secondaryContainer: 'white',
  tertiaryContainer: '#eee',
  disabledContainer: 'rgba(0,0,0,.12)',

  divider: 'rgba(0,0,0,.12)',
  elevation: 'black',
  scrollbar: 'rgba(0,0,0,.12)',

  icon: 'rgba(0,0,0,.54)',
  sliderMin: 'rgba(0,0,0,.87)',
  sliderOff: 'rgba(0,0,0,.26)',
  sliderOffActive: 'rgba(0,0,0,.38)',

  text: 'rgba(0,0,0,.87)',
  secondaryText: 'rgba(0,0,0,.54)',
  hintText: 'rgba(0,0,0,.38)',
  disabledText: 'rgba(0,0,0,.38)',
} as const;
