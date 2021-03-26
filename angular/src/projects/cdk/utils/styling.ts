interface Styling {
  insert: (style: string) => void;
  setHeadElement: (headElement: HTMLHeadElement) => void;
}

export const styling: Styling = {
  insert(style: string): void {
    this._stackingStyle += style;
  },

  setHeadElement(headElement): void {
    const insert = this.insert = (style: string) => {
      headElement.insertAdjacentHTML('beforeend', '<style>' + style + '</style>');
    };

    const stackingStyle = this._stackingStyle as string;
    if (stackingStyle) {
      insert(stackingStyle);
      this._stackingStyle = null;
    }
  },

  // @ts-ignore
  _stackingStyle: '.ml-visually-hidden{border:0;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px;outline:0;-webkit-appearance:none;-moz-appearance:none}',
};
