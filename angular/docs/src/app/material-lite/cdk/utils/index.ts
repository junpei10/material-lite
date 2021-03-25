export * from './styling';
export * from './listen';
export * from './noop';
export * from './run-outside-ng-zone';
export * from './token.service';
export * from './transition-classes';
export * from './lifecycle';
export * from './core';

export type Class<T, A extends any[] = any[]> = new (...arg: A) => T;

export type Falsy = false | undefined | null | '' | 0;

export interface MlDocument {
  head: HTMLHeadElement;
  createElement: (tagName: string, options?: ElementCreationOptions) => HTMLElement;
  createComment: (data: string) => Comment;
}


