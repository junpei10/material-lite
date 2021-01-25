import React from 'react';
import ReactDOM from 'react-dom';
import { MlPopupOutputReturns } from './output-returns';
import { MlPopupOutletHandler as Handler, MlPopupOutletStatus } from './types';

let hasBeenOuted: undefined | true;

type Animation = {
  class: string;
  duration: number;
} | { [key: string]: string; duration: never; class: never };

const keydownEventsHandler: Handler<KeyboardEvent> = {};

const outletStatus: MlPopupOutletStatus = {};

export interface MlPopupOutletConfig {
  id?: string;
  animation?: {
    [key in 'enter' | 'leave']?: Animation
  }
  // addPanelClass?: string | string[]
}
export const mlPopupOutput = (
  content: JSX.Element,
  config: MlPopupOutletConfig = {}
): MlPopupOutputReturns => {
  const id = config.id ? config.id : 'root';

  let data = outletStatus[id];

  // outletElementが見つからなかったら、DOMを作成し、作成したDOMを変数へ再代入
  if (!data) {
    const outletRef = document.createElement('ml-popup-outlet');
    const backdropRef = document.createElement('ml-popup-backdrop');

    data = outletStatus[id] = {
      outletRef, backdropRef,
      contents: [],
      backdropClickHandler: {}
    }

    if (!hasBeenOuted) {
      hasBeenOuted = true;
      /**
       * <style type='css/test'>
       *  ml-popup-outlet {
       *    display: flex;
       *    position: absolute;
       *    top: 0;
       *    width: 100%;
       *    height: 100vh;
       *    pointer-events: none;
       *    opacity: 1;
       *    z-index: 16;
       *  }
       * </style>
       */
      document.head.insertAdjacentHTML(
        'beforeend',
        '<style>ml-popup-outlet{display:flex;position:absolute;top:0;width:100%;height:100vh;pointer-events:none;opacity:1;z-index:16;}</style>'
      );
    }

    outletRef.appendChild(backdropRef);
    document.getElementById(id)!.appendChild(outletRef);
  }

  const index = data.contents.length;

  const cloneContent = React.cloneElement(content, { className: 'yyy' });
  data.contents.push(cloneContent);

  console.log(data);

  ReactDOM.render(
    React.createElement(React.Fragment, null, ...data.contents),
    data.outletRef
  );

  return new MlPopupOutputReturns(id, index, data, keydownEventsHandler);
};
