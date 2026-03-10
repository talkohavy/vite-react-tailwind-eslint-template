export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type * from './postMessageEvents';
export type * from './backgroundSync';
export type * from './route';
