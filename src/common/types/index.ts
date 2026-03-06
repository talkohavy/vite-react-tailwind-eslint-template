import type { LazyExoticComponent, ReactNode } from 'react';

export type Route = {
  to: string;
  text: string;
  activeNames: Array<string>;
  Component: (() => any) | LazyExoticComponent<() => ReactNode>;
  hideFromSidebar?: boolean;
  children?: Array<Route>;
};

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type * from './postMessageEvents';
export type * from './backgroundSync';
