import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import MatCard from '../material-lite/Card/Card';
import MatRipple from '../material-lite/core/Ripple/Ripple';
import './Ripple.scss';
import { mlPopupOutput } from '../material-lite/core/PopupOutlet/output';

const RipplePage = () => {
  const click = () => {
    mlPopupOutput(<MatCard className='xxx'>span span</MatCard>);
  }

  useEffect(() => {
    return () => console.log('Remove');
  }, []);

  return (
    <>
      <button onClick={click}>Click</button>
      <MatCard className="xxx">
        <Link to='/button'>Button</Link>
        <MatRipple wrapped />
        <span>Ripple</span>
      </MatCard>
    </>
  )
}
export default RipplePage;