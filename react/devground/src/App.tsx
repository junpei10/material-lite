import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


const RipplePage = lazy(() => import('./views/Ripple'));
const ButtonPage = lazy(() => import('./views/Button'));

function App() {
  return (
    <>
      <Router>
        <Suspense fallback={<></>}>
          <Switch>
            <Route path='/ripple' component={RipplePage}></Route>
            <Route path='/button' component={ButtonPage}></Route>
          </Switch>
        </Suspense>
      </Router>
    </>
  );
}

export default App;
