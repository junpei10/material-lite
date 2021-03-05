import { Component } from 'react';

export interface MlRippleBinder {
  mlRipple?: boolean | '';
  overdrive?: {
    width?: number,
    height?: number
  } | boolean;

  color?: string;
  theme?: string;
  opacity?: number;
  radius?: number;
  duration?: {
    enter?: number,
    leave?: number
  } | number;

  trigger?: ListenTarget;
  triggerIsOutside?: boolean;

  centered?: boolean;
}

class MlRipple extends Component {

}

export default MlRipple;
