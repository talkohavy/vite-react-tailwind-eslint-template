export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export enum HttpHeaders {
  REQUEST_ID = 'x-request-id',
  BROWSER_ID = 'x-browser-id',
  TAB_ID = 'x-tab-id',
}

export type FetchOptions = {
  body?: any;
  headers?: HeadersInit;
};

export type ExecuteProps = {
  url: string;
  method: HttpMethod;
} & FetchOptions;

export type HttpResponse<T = any> = {
  data: T;
  requestInfo: {
    url: string;
    method: HttpMethod;
    body?: any;
    headers: HeadersInit;
    requestId: string;
  };
};

export type HttpErrorConstructorProps = {
  message: string;
  status: number;
  url: string;
  method: HttpMethod;
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
