import type { Message } from '@luckylove-pkg/types';
import type { AnyAction } from '@reduxjs/toolkit';

type ToastType = 'success' | 'error' | 'warning';

type RouterState = {
  location: { pathname: string };
};

type UserState = {
  isLogged: boolean;
  isLoading: boolean;
  data: any;
};

type SingleToastState = {
  isShowing: boolean;
  text: string;
  type: ToastFrom;
  hasChanged?: number;
  timeoutId?: any;
  from?: string;
};

type ToastState = {
  login: SingleToastState;
  register: SingleToastState;
};

type ModalsState = Record<string, boolean>;

declare type State = {
  router: RouterState;
  user: UserState;
  gallery: any;
  toast: ToastState;
  modals: ModalsState;
};

declare type GetStateFunction = () => State;

declare type ActionHandlerProps = {
  action: AnyAction;
  dispatch: any;
  getState: GetStateFunction;
};

export type {
  ActionHandlerProps,
  GetStateFunction,
  ModalsState,
  RouterState,
  SingleToastState,
  State,
  ToastState,
  ToastType,
  UserState,
};
