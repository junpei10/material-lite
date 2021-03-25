export type CoreDynamicConfig<T extends {[key: string]: any}> = { _dynamic: T };

export type CoreConfig<T extends {[key: string]: any}> = T | CoreDynamicConfig<T>;

export function setCoreConfig(classRef: {[key: string]: any}, config: CoreConfig<any>): void {
  config._dynamic
    ? Object.defineProperty(classRef, '_config', { get: () => config._dynamic })
    : classRef._config = config;
}
