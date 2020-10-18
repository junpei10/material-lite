import React, {
  useState
} from "react";
import './App.scss';
import MatRipple from './material-lite/Ripple';
import MatButton from './material-lite/Button';

function App() {
  const [target, setTarget] = useState<any>(undefined);
  const [disabled, setDisabled] = useState<boolean>(false);
  const changeTarget = () => {
    console.log('change');
    setTarget(target === undefined ? window : undefined);
  }
  const changeDisabled = () => {
    console.log('disabled', !disabled);
    setDisabled(!disabled);
  }

  return (
    <>
      <header className="App-header">
        <MatRipple target={target} color='white' disabled={disabled}></MatRipple>
      </header>
      <MatButton onClick={changeTarget}>Toggle target</MatButton>
      <MatButton onClick={changeDisabled}>Toggle disabled</MatButton>
    </>
  );
}

export default App;
