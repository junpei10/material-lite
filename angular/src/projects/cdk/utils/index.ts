export * from './insert-style-element';
export * from './listen';
export * from './noop';
export * from './run-outside';

export type Class<T, A extends any[] = any[]> = new (...arg: A) => T;
