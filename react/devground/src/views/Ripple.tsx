import React from 'react';
import './Ripple.scss';
import Ripple from '../material-lite/Ripple/Ripple';

const RipplePage = () => {
  return (
    <>

      <h1>Ripple Page</h1>
      <div className='ex-container'>
        <Ripple color="black"></Ripple>
      </div>

    </>
  )
}
export default RipplePage;