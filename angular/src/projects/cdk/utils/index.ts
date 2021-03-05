export * from './insert-style-element';
export * from './listen';
export * from './noop';
export * from './divided-zone';
export * from './token.service';
export * from './animation';
export * from './container-resize-observer';
export * from './lifecycle';

export type Class<T, A extends any[] = any[]> = new (...arg: A) => T;
