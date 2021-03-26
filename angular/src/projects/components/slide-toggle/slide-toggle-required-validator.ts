/**
 * @引用
 * `Angular material`のソースコードから抜粋
 */


import { Directive, forwardRef, Provider } from '@angular/core';
import { CheckboxRequiredValidator, NG_VALIDATORS } from '@angular/forms';

export const ML_SLIDE_TOGGLE_REQUIRED_VALIDATOR: Provider = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MlSlideToggleRequiredValidator),
  multi: true
};

@Directive({
  selector: `ml-slide-toggle[required][formControlName],
             ml-slide-toggle[required][formControl], ml-slide-toggle[required][ngModel]`,
  providers: [ML_SLIDE_TOGGLE_REQUIRED_VALIDATOR],
})
// tslint:disable-next-line:directive-class-suffix
export class MlSlideToggleRequiredValidator extends CheckboxRequiredValidator {}
