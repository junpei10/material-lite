import { TemplateRef } from '@angular/core';
import { ComponentType } from '../../utils/types';

export type MlPopupContent<T> = ComponentType<T> | TemplateRef<T>;
export type MlPopupContentType = 'component' | 'template';
export type MlPopupContentRef = {
  destroy: () => any;
  [key: string]: any;
};
export interface MlPopupContentData {
  type: MlPopupContentType;
  ref: MlPopupContentRef;
  rootElement: HTMLElement;
}

export interface MlPopupAnimationConfig {
  className?: string;
  enter?: number;
  leave?: number;
}
