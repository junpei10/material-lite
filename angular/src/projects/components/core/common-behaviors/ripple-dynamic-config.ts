import { CoreDynamicConfig } from '@material-lite/angular-cdk/utils';
import { MlRippleCoreConfig } from '../ripple';
import { NoConstructor } from './mixin';


export declare class CanRippleDynamicConfig {
  protected readonly _rippleDynamicConfig: CoreDynamicConfig<MlRippleCoreConfig>;
  rippleConfig: MlRippleCoreConfig;
}

export function mixinRippleDynamicConfig(base: NoConstructor<any>): NoConstructor<CanRippleDynamicConfig> {
  // @ts-ignore
  return class extends base {
    _rippleDynamicConfig: CoreDynamicConfig<MlRippleCoreConfig> = {
      _dynamic: {}
    };

    get rippleConfig(): MlRippleCoreConfig {
      return this._rippleDynamicConfig._dynamic;
    }
    set rippleConfig(config: MlRippleCoreConfig) {
      this._rippleDynamicConfig._dynamic = config;
    }
  };
}

mixinRippleDynamicConfig.prototype.id = 7;
