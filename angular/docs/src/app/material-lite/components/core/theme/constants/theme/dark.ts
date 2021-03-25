import { MlTheme } from '../../theming';

export const ML_DARK_THEME: MlTheme = {
  base: 'black',
  oppositeBase: 'white',

  background: '#303030',
  primaryContainer: '#212121',
  secondaryContainer: '#424242',
  tertiaryContainer: '#616161',
  disabledContainer: 'hsla(0,0%,100%,.12)',

  divider: 'hsla(0,0%,100%,.12)',
  elevation: 'black',
  scrollbar: 'hsla(0,0%,100%,.12)',

  icon: 'white',
  sliderMin: 'white',
  sliderOff: 'rgba(255,255,255,.3)',
  sliderOffActive: 'rgba(255,255,255,.3)',

  text: '#fff',
  secondaryText: 'rgba(255,255,255,.7)',
  hintText: 'rgba(255,255,255,.5)',
  disabledText: 'hsla(0,0%,100%,.3)',
} as const;
