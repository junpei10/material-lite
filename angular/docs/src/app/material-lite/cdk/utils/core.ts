export type CoreDynamicConfig<T extends {[key: string]: any}> = { dynamic: T };

export type CoreConfig<T extends {[key: string]: any}> = T | CoreDynamicConfig<T>;

export function setCoreConfig(classRef: {[key: string]: any}, config: CoreConfig<any>): void {
  config.dynamic
    ? Object.defineProperty(classRef, '_config', { get: () => config.dynamic })
    : classRef._config = config;
}
