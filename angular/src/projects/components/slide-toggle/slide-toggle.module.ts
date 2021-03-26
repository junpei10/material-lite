import { NgModule } from '@angular/core';
import { MlSlideToggleRequiredValidator } from './slide-toggle-required-validator';
import { MlSlideToggleComponent } from './slide-toggle.component';

// `Angular material`では、以下のようにModule化している
// @NgModule({
//   exports: [MlSlideToggleRequiredValidator],
//   declarations: [MlSlideToggleRequiredValidator],
// })
// export class MlSlideToggleRequiredValidatorModule {}

@NgModule({
  exports: [MlSlideToggleComponent, MlSlideToggleRequiredValidator],
  declarations: [MlSlideToggleComponent, MlSlideToggleRequiredValidator],
})
export class MlSlideToggleModule {}

