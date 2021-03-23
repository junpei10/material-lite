const head = document.head;

export function insertStyleElement(style: string): void {
  head.insertAdjacentHTML('beforeend', '<style>' + style + '</style>');
}

// common styles
insertStyleElement(`
  .ml-top-0 {
    top:0;
  }
  .ml-right-0 {
    right:0;
  }
  .ml-left-0 {
    left:0;
  }
  .ml-bottom-0 {
    bottom:0;
  }

  .ml-visually-hidden{
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
    outline: 0;
    -webkit-appearance: none;
    -moz-appearance: none;
  }
`);
