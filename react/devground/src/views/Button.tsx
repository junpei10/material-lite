import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MatButton, { MatButtonVariant } from '../material-lite/Button/Button';
import './Button.scss';

const ButtonPage = () => {
  const [variant, setVariant] = useState<MatButtonVariant>('basic');

  const toggleVariant = () => {
    switch (variant) {
      case 'basic':
        setVariant('raised');
        break;
      case 'raised':
        setVariant('stroked');
        break;
      case 'stroked':
        setVariant('flat');
        break;
      case 'flat':
        setVariant('icon');
        break;
      case 'icon':
        setVariant('fab');
        break;
      case 'fab':
        setVariant('basic');
        break;
    }
  }

  return (
    <>
      <div className='ButtonPage-playground'>
        <button>
          <MatButton variant={variant} />
          <span>Button</span>
        </button>
        <button onClick={toggleVariant}><MatButton />Toggle</button>
      </div>

      <div className='ButtonPage-list'>
        <button><MatButton inlineLink /><Link to='ripple'>Ripple</Link></button>
        <button><MatButton variant='raised' />RAISED</button>
        <button><MatButton variant='stroked' />STROKED</button>
        <button><MatButton variant='flat' />FLAT</button>
        <button><MatButton variant='icon' />I</button>
        <button><MatButton variant='fab' />FAB</button>
      </div>

    </>
  )
}
export default ButtonPage;