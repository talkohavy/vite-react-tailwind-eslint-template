import type { HttpErrorConstructorProps, HttpMethod } from '../types';

export class HttpError extends Error {
  status: number;
  url: string;
  method: HttpMethod;
  requestBody: any;
  requestHeaders: any;
  responseHeaders: any;
  requestId: string;
  type: string;

  constructor(props: HttpErrorConstructorProps) {
    const { message, status, url, method, requestBody, requestHeaders, responseHeaders, requestId, type } = props;

    super(message);

    this.status = status;
    this.url = url;
    this.method = method;
    this.requestBody = requestBody;
    this.requestHeaders = requestHeaders;
    this.responseHeaders = responseHeaders;
    this.requestId = requestId;
    this.type = type;

    Object.defineProperty(this, 'name', { value: 'HttpError', enumerable: true });
    Object.defineProperty(this, 'message', { value: message, enumerable: true });
    Object.defineProperty(this, 'stack', { enumerable: true });
  }
}
