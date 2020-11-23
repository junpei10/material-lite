import { NgModule } from '@angular/core';
import { MlRippleModule, MlThemeStyle, MlTheming } from '@material-lite/angular/core';
import { MlButtonComponent } from './button.component';

const STYLE: MlThemeStyle = {
  base: `
    .ml-button {
      display: inline-flex;
      position: relative;
      overflow: visible !important;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      font-weight: 500;
      font-family: inherit;
      font-size: 14px;

      border: none;
      outline: none;

      box-sizing: border-box;
    }

    .ml-button:focus-visible .ml-button-overlay {
      opacity: 0.056;
    }

    .ml-button a, a.ml-button {
      text-decoration: none;
    }
    .ml-button a:link, a.ml-button:link {
      color: #3F51B5;
    }
    .ml-button a:visited, a.ml-button:visited {
      color: #673AB7;
    }

    .ml-simple-button {
      background-color: transparent;
    }

    .ml-basic-button,
    .ml-raised-button,
    .ml-stroked-button,
    .ml-flat-button {
      min-width: 64px;
      min-height: 36px;
      padding: 0 16px;
      border-radius: 4px;
    }

    .ml-icon-button,
    .ml-fab {
      min-height: 32px;
      min-width: 32px;
      padding: 0;
      border-radius: 50%;
    }

    .ml-raised-button .ml-button-ripple {
      transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12);
    }
    .ml-raised-button:active .ml-button-ripple {
      box-shadow: 0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12);
    }

    .ml-stroked-button {
      padding: 0 15px;
      border: 1px solid currentColor;
    }

    .ml-icon-button {
      height: 40px;
      width: 40px;
      font-size: 24px;
    }

    .ml-fab .ml-button-ripple {
      transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12);
    }
    .ml-fab:active .ml-button-ripple {
      box-shadow: 0px 7px 8px -4px rgba(0,0,0,0.2), 0px 12px 17px 2px rgba(0,0,0,0.14), 0px 5px 22px 4px rgba(0,0,0,0.12);
    }

    .ml-link-button {
      padding: 0;
    }
    .ml-link-button a {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      height: 100%; width: 100%;
      padding: 0 16px;
    }

    .ml-disabled-button {
      pointer-events: none;
      box-shadow: 0 0 0 0 transparent !important;
    }
    .ml-disabled-button .ml-button-ripple {
      box-shadow: 0 0 0 0 transparent !important;
    }

    .ml-button-ripple, .ml-button-overlay {
      position: absolute !important;
      top: 0; left: 0;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      pointer-events: none;
    }

    .ml-button-overlay {
      display: none;
      background-color: currentColor;
      opacity: 0;
    }
    .ml-button-hover-action .ml-button-overlay {
      display: inline;
      transition: opacity 280ms cubic-bezier(0.35, 0, 0.25, 1);
    }
    .ml-button-hover-action:hover .ml-button-overlay {
      opacity: 0.056;
    }
  `,
  themeFactory: (theme, forEachPalette) => {
    const { text, secondaryContainer, disabledContainer, disabledText, divider } = theme;
    return `
      .ml-button {
        color: ${text};
      }
      .ml-filled-button {
        background-color: ${secondaryContainer};
      }
      .ml-filled-button.ml-disabled-button {
        background-color: ${disabledContainer} !important;
      }

      .ml-stroked-button {
        border-color: ${divider} !important;
      }

      .ml-disabled-button {
        color: ${disabledText} !important;
      }
    ` + forEachPalette((name, color, contrast) => (`
      .ml-simple-button.ml-button-${name} {
        color: ${color};
      }
      .ml-filled-button.ml-button-${name} {
        background-color: ${color};
        color: ${contrast};
      }
    `));
  }
};


@NgModule({
  imports: [MlRippleModule],
  exports: [MlButtonComponent],
  declarations: [MlButtonComponent],
})
export class MlButtonModule {
  constructor() { MlTheming.setStyle(STYLE); }
}
