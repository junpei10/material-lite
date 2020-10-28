import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import MatButton from './material-lite/Button/Button';

function App() {
  return (
    <>
      <Router>
        <Route path='/route'></Route>
        <div>
          <MatButton variant='raised' contrast='green' disabled />
          <span>Button</span>
        </div>
      </Router>
    </>
  );
}

export default App;
