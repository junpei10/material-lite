import { NgModule } from '@angular/core';
import { MlThemeStyle, MlTheming } from '../theme';
import { MlRippleDirective } from './ripple.directive';

const STYLE: MlThemeStyle = {
  base: '.ml-ripple{position:relative;overflow:hidden;user-select:none}.ml-ripple-element{will-change:opacity,transform;transform:scale(0);transition-property:opacity,transform;border-radius:50%}.ml-ripple-element,.ml-ripple-overdrive{transition-timing-function:cubic-bezier(0,0,.2,1);position:absolute;pointer-events:none}.ml-ripple-overdrive{will-change:opacity;opacity:0;transition-property:opacity;top:0;left:0;width:100%;height:100%;border-radius:0}'
};


@NgModule({
  declarations: [MlRippleDirective],
  exports: [MlRippleDirective]
})
export class MlRippleModule {
  constructor() {
    MlTheming.setStyle(STYLE);
  }
}
