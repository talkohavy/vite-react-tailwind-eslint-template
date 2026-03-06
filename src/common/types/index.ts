import type { ComponentType, LazyExoticComponent, ReactNode } from 'react';

/** Props for route components. Layout routes receive children (v5 nested Switch). */
export type RouteLayoutProps = { children?: ReactNode };

export type Route = {
  to: string;
  text?: string;
  activeNames?: Array<string>;
  Component: ComponentType<RouteLayoutProps> | LazyExoticComponent<ComponentType<RouteLayoutProps>>;
  hideFromSidebar?: boolean;
  children?: Array<Route>;
};

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type * from './postMessageEvents';
export type * from './backgroundSync';
