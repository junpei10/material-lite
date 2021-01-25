export * from './insert-style-element';
export * from './listen';
export * from './noop';
export * from './run-outside';
export * from './token.service';

export type Class<T, A extends any[] = any[]> = new (...arg: A) => T;
