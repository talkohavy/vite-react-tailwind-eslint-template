import type { HttpMethodValues } from './logic/constants';

export type FetchOptions = {
  body?: any;
  headers?: HeadersInit;
};

export type ExecuteProps = {
  url: string;
  method: HttpMethodValues;
} & FetchOptions;

export type HttpResponse<T = any> = {
  data: T;
  requestInfo: {
    url: string;
    method: HttpMethodValues;
    body?: any;
    headers: HeadersInit;
    requestId: string;
  };
};

export type HttpErrorConstructorProps = {
  message: string;
  status: number;
  url: string;
  method: HttpMethodValues;
  requestBody: any;
  requestHeaders: any;
  responseHeaders: any;
  requestId: string;
  type: string;
};

export type ResponseError = {
  message: string;
  status: number;
  originalError?: any;
};
