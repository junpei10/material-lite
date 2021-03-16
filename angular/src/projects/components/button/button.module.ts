import { NgModule } from '@angular/core';
import { MlThemeStyle, MlTheming } from '@material-lite/angular/core';
import { MlButtonComponent } from './button.component';

const STYLE: MlThemeStyle = {
  base: '.ml-button{display:inline-flex;position:relative;overflow:visible!important;justify-content:center;align-items:center;vertical-align:middle;cursor:pointer;font-weight:500;font-family:inherit;font-size:14px;border:0;outline:0;box-sizing:border-box}.ml-button:focus-visible .ml-button-overlay{opacity:.056}.ml-button a,a.ml-button{text-decoration:none}.ml-button a:link,a.ml-button:link{color:#3f51b5}.ml-button a:visited,a.ml-button:visited{color:#673ab7}.ml-simple-button{background-color:transparent}.ml-basic-button,.ml-flat-button,.ml-raised-button,.ml-stroked-button{min-width:4pc;height:36px;padding:0 1pc;border-radius:4px}.ml-fab,.ml-icon-button{height:2pc;width:2pc;padding:0;border-radius:50%}.ml-raised-button .ml-button-ripple{transition:box-shadow .28s cubic-bezier(0.4,0,0.2,1);box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)}.ml-raised-button:active .ml-button-ripple{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12)}.ml-stroked-button{padding:0 15px;border:1px solid currentColor}.ml-icon-button{height:40px;width:40px;font-size:24px}.ml-fab .ml-button-ripple{transition:box-shadow .28s cubic-bezier(0.4,0,0.2,1);box-shadow:0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12)}.ml-fab:active .ml-button-ripple{box-shadow:0 7px 8px -4px rgba(0,0,0,.2),0 9pt 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12)}.ml-anchor-button{padding:0}.ml-anchor-button a{display:inline-flex;justify-content:center;align-items:center;height:100%;width:100%;padding:0 1pc}.ml-disabled-button{pointer-events:none}.ml-disabled-button,.ml-disabled-button .ml-button-ripple{box-shadow:0 0 0 0 transparent!important}.ml-button-overlay,.ml-button-ripple{position:absolute!important;top:0;left:0;width:100%;height:100%;border-radius:inherit;pointer-events:none}.ml-button-overlay{display:none;background-color:currentColor;opacity:0}.ml-button-hover-action .ml-button-overlay{display:inline;transition:opacity .28s cubic-bezier(0.35,0,0.25,1)}.ml-button-hover-action:hover .ml-button-overlay{opacity:.056}',
  theme: (theme) => {
    const { text, secondaryContainer, disabledContainer, disabledText, divider } = theme;
    return (`.ml-button{color:${text}}.ml-filled-button{background-color:${secondaryContainer}}.ml-filled-button.ml-disabled-button{background-color:${disabledContainer}!important}.ml-stroked-button{border-color:${divider}!important}.ml-disabled-button{color:${disabledText}!important}`);
  },
  palette: (name, color, contrast) => (`.ml-simple-button.ml-button-${name}{color:${color}}.ml-filled-button.ml-button-${name}{background-color:${color};color:${contrast}}`)
};


@NgModule({
  exports: [MlButtonComponent],
  declarations: [MlButtonComponent],
})
export class MlButtonModule {
  constructor() { MlTheming.setStyle(STYLE); }
}
