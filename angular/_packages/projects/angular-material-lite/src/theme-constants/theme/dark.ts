import { MlTheme } from '../../core/theming';

export const ML_DARK_THEME: MlTheme = {
  base: 'black',
  oppositeBase: 'white',

  background: '#212121',
  primaryContainer: '#303030',
  secondaryContainer: '#424242',
  tertiaryContainer: '#616161',
  disabledContainer: 'hsla(0,0%,100%,.12)',

  divider: 'rgba(255,255,255,.12)',
  elevation: 'black',
  scrollbar: 'rgba(255,255,255,.12)',

  text: '#fff',
  secondaryText: 'rgba(255,255,255,.7)',
  hintText: 'rgba(255,255,255,.5)',
  disabledText: 'hsla(0,0%,100%,.3)',
} as const;
