import './style.scss';

import React, {
  useEffect,
  useRef
} from 'react';
import MatRipple from '../Ripple';

interface MatButtonProps {
  onClick?: () => void;
  color?: string;
  children?: any;
}

const MatButton = (props: MatButtonProps) => {
  const ref = useRef(null);

  useEffect(() => {

  });

  return (
    <button onClick={props.onClick} className='Mat-button-lite Mbl-basic' ref={ref}>
      <span>{props.children}</span>
      <span className='Mat-button-lite-overlay'></span>
      <MatRipple color='black' />
    </button>
  )
}

export default MatButton;