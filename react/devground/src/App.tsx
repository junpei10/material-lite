import React, { useEffect } from 'react';
import { MlPortalConfig, MlPortalInjector, MlPortalOutletService } from './material-lite/cdk/portal';
import MlPortalOutlet from './material-lite/cdk/portal/outlet';

function Test(props: { mlPortal?: MlPortalInjector }) {
  const portal = props.mlPortal!;

  portal.ref.afterAttached().subscribe(() => {
    console.log('test');
  });

  portal.ref.afterDetached().subscribe(() => {
    console.log('detached');
  })

  return <div>Test {portal.data}</div>;
}

const CONFIG: MlPortalConfig = {
  data: 'string',
  animation: {
    className: 'test',
    enter: 500,
    leave: 500
  }
};

function App() {

  useEffect(() => {
    setTimeout(() => {
      // @ts-ignore
      MlPortalOutletService.attach(<Test></Test>, 'example', CONFIG);
    }, 3000)
  }, []);

  return (
    <>
      <h1>DEVGROUND</h1>
      <MlPortalOutlet publicKey='example'></MlPortalOutlet>
    </>
  );
}

export default App;
