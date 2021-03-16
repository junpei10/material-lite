export * from './insert-style-element';
export * from './listen';
export * from './noop';
export * from './divided-zone';
export * from './token.service';
export * from './animation';
export * from './lifecycle';
export * from './core';

export type Class<T, A extends any[] = any[]> = new (...arg: A) => T;

export type Falsy = false | undefined | null | '' | 0;

export interface MlDocument {
  createElement: (tagName: string, options?: ElementCreationOptions) => HTMLElement;
  createComment: (data: string) => Comment;
}
