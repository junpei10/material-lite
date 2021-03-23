import { Falsy } from '@material-lite/angular-cdk/utils';
import { MlRippleCore } from '../ripple';
import { NoConstructor } from './mixin';

export declare abstract class CanDisableRipple {
  abstract rippleCore: MlRippleCore;
  readonly rippleIsDisabled: boolean;
  set disableRipple(isDisabled: boolean | Falsy);
}

export function mixinDisableRipple(base: NoConstructor<any>): NoConstructor<CanDisableRipple> {
  return class extends base {
    rippleCore: MlRippleCore;
    rippleIsDisabled: boolean;

    set disableRipple(isDisabled: boolean | Falsy) {
      const result = this.rippleIsDisabled =
        isDisabled || isDisabled === '';

      result
        ? this.rippleCore.setTrigger(null)
        : this.rippleCore.setTrigger('current');
    }
  };
}

mixinDisableRipple.prototype.id = 3;
