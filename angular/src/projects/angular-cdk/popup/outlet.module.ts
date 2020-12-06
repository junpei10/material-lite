import { NgModule } from '@angular/core';
import { MlPortalModule } from '@material-lite/angular-cdk/portal';
import { insertStyleElement } from '@material-lite/angular-cdk/utils';
import { MlPopupOutletDirective } from './outlet.directive';

let STYLE: string | null = '.ml-popup-outlet{display:flex;position:absolute;top:0;left:0;width:100%;height:100vh;pointer-events:none;opacity:1;z-index:1}.ml-popup-content{pointer-events:auto}ml-popup-backdrop{display:block;position:absolute;top:0;pointer-events:none;height:100%;width:100%;background-color:#000;transition-property:opacity;transition-timing-function:cubic-bezier(.25,.8,.25,1)}ml-popup-backdrop.ml-active{will-change:transition;opacity:.32;pointer-events:auto}ml-popup-backdrop:not(.ml-active){opacity:0!important}';

@NgModule({
  exports: [MlPopupOutletDirective],
  declarations: [MlPopupOutletDirective],
  imports: [MlPortalModule],
})
export class MlPopupModule {
  constructor() {
    if (STYLE) {
      insertStyleElement(STYLE);
      STYLE = null;
    }
  }
}
