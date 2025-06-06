import type { LazyExoticComponent, ReactNode } from 'react';
import type { HttpMethodValues } from '../lib/HttpClient';

export type Route = {
  to: string;
  text: string;
  activeNames: Array<string>;
  Component: (() => any) | LazyExoticComponent<() => ReactNode>;
  hideFromSidebar?: boolean;
};

export type RequestDetails = {
  /**
   * @description
   * `url` should be without the BASE_URL!
   *
   * i.e. if the full url is "http://localhost:8000/users",
   * then you should pass in only "/users".
   *
   * The "http://localhost:8000" part is considered as BASE_URL, and is added automatically.
   */
  url: string;
  options: {
    method: HttpMethodValues;
    headers?: {
      [key: string]: string;
    };
    body?: Record<string, any>;
    [key: string]: any;
  };
};

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
