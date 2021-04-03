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

      if (this.rippleCore) {
        result
          ? this.rippleCore.teardown()
          : this.rippleCore.setup();
      }
    }
  };
}

mixinDisableRipple.prototype.id = 3;
