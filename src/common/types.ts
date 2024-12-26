import type { LazyExoticComponent, ReactNode } from 'react';

export type Route = {
  to: string;
  text: string;
  activeNames: Array<string>;
  Component: (() => any) | LazyExoticComponent<() => ReactNode>;
  hideFromSidebar?: boolean;
};
