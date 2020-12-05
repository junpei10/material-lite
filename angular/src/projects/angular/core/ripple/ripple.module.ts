import { NgModule } from '@angular/core';
import { MlThemeStyle, MlTheming } from '../theme';
import { MlRippleDirective } from './ripple.directive';

const STYLE: MlThemeStyle = {
  base: '.ml-ripple{position:relative;overflow:hidden;user-select:none}.ml-ripple-element{will-change:opacity,transform;transform:scale(0);transition-property:opacity,transform;transition-timing-function:cubic-bezier(0,0,.2,1);position:absolute;border-radius:50%;pointer-events:none}.ml-immediate-ripple{will-change:opacity;opacity:0;transition-property:opacity;transition-timing-function:cubic-bezier(0,0,.2,1);position:absolute;top:0;left:0;width:100%;height:100%;border-radius:0;pointer-events:none}ml-ripple-outlet{width:100%;height:100%;position:absolute;top:0;left:0;overflow:hidden;pointer-events:none}'
};

@NgModule({
  exports: [MlRippleDirective],
  declarations: [MlRippleDirective],
})
export class MlRippleModule {
  constructor() {
    MlTheming.setStyle(STYLE);
  }
}
