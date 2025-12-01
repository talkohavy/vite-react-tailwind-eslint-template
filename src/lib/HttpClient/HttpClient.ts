import type { ExecuteProps, FetchOptions, HttpResponse, ResponseError } from './types';
import { uuid } from '../../common/utils/uuid';
import { sessionManager } from '../SessionManager';
import { HttpHeaders, HttpMethod } from './logic/constants';
import { HttpError } from './logic/HttpError';

export let httpClient: HttpClient;

export class HttpClient {
  abortControllers: Map<string, AbortController>;

  constructor(protected _baseUrl?: string) {
    this.abortControllers = new Map();
  }

  set baseUrl(url: string) {
    this.baseUrl = url;
  }

  /**
   * @description
   * `url` should be without the BASE_URL!
   *
   * i.e. if the full url is "http://localhost:8000/users",
   * then you should pass in only "/users".
   *
   * The "http://localhost:8000" part is considered as BASE_URL, and is added automatically.
   */
  public get<ResponseDto = any>(url: string, options?: FetchOptions) {
    return this.execute<ResponseDto>({ url, method: HttpMethod.GET, ...options });
  }

  /**
   * @description
   * `url` should be without the BASE_URL!
   *
   * i.e. if the full url is "http://localhost:8000/users",
   * then you should pass in only "/users".
   *
   * The "http://localhost:8000" part is considered as BASE_URL, and is added automatically.
   */
  public post<ResponseDto = any>(url: string, options?: FetchOptions) {
    return this.execute<ResponseDto>({ url, method: HttpMethod.POST, ...options });
  }

  public put<ResponseDto = any>(url: string, options?: FetchOptions) {
    return this.execute<ResponseDto>({ url, method: HttpMethod.PUT, ...options });
  }

  public patch<ResponseDto = any>(url: string, options?: FetchOptions) {
    return this.execute<ResponseDto>({ url, method: HttpMethod.PATCH, ...options });
  }

  public delete<ResponseDto = any>(url: string, options?: FetchOptions) {
    return this.execute<ResponseDto>({ url, method: HttpMethod.DELETE, ...options });
  }

  protected async execute<ResponseDto = any>(props: ExecuteProps): Promise<HttpResponse<ResponseDto>> {
    const { url, method, body, headers: additionalHeaders } = props;

    const requestId = uuid();
    const signal = this.addAbortControllerToList(requestId);
    const fullTargetUrl = `${this._baseUrl}${url}`;
    const headers = new Headers(additionalHeaders);

    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    headers.set(HttpHeaders.REQUEST_ID, requestId);

    if (sessionManager) {
      const { localStorageId, sessionStorageId } = sessionManager.getSessionIds();
      headers.set(HttpHeaders.BROWSER_ID, localStorageId!);
      headers.set(HttpHeaders.TAB_ID, sessionStorageId!);
    }

    const requestInfo = {
      url: fullTargetUrl,
      method,
      body,
      headers,
      requestId,
    };

    try {
      const response = await fetch(fullTargetUrl, {
        body: JSON.stringify(body),
        headers,
        method,
        credentials: 'include' as RequestCredentials,
        signal,
      });

      this.removeAbortControllerFromList(requestId);

      const { error, data } = await this.handleServerResponse(response);

      if (error) {
        const { status, url, headers: responseHeaders, type } = response;

        throw new HttpError({
          message: error.message,
          status,
          url,
          method,
          requestBody: body,
          requestHeaders: headers,
          responseHeaders,
          requestId,
          type,
        });
      }

      return { data, requestInfo };
    } catch (error: any) {
      this.removeAbortControllerFromList(requestId);

      throw error;
    }
  }

  abortRequestById(requestId: string) {
    const controller = this.abortControllers.get(requestId);

    if (controller) {
      controller.abort();
      this.abortControllers.delete(requestId);
    }
  }

  abortAllRequests() {
    for (const controller of this.abortControllers.values()) {
      controller.abort();
    }

    this.abortControllers.clear();
  }

  private async handleServerResponse(responseRaw: any): Promise<{ data?: any; error?: ResponseError }> {
    try {
      const parsedBody = await this.parseResponseBody(responseRaw);

      if (!responseRaw.ok) return this.handleNotOk(responseRaw.status, parsedBody);

      return { data: parsedBody };
    } catch (error) {
      return {
        error: {
          message: 'Failed to process response',
          status: responseRaw.status,
          originalError: error,
        },
      };
    }
  }

  private async parseResponseBody(responseRaw: any): Promise<{ data?: any; error?: any }> {
    const responseText = await responseRaw.text();
    let parsedBody: any;

    try {
      // Only try to parse as JSON if there's content
      parsedBody = responseText ? JSON.parse(responseText) : null;
    } catch {
      // If we can't parse as JSON, use the raw text
      parsedBody = { message: responseText || 'No response body' };
    }

    return parsedBody;
  }

  private handleNotOk(statusCode: number, parsedBody: any): { error: ResponseError } {
    const errorMessage =
      parsedBody?.message || parsedBody?.error || (typeof parsedBody === 'string' ? parsedBody : 'Request failed');

    return { error: { message: errorMessage, status: statusCode } };
  }

  private addAbortControllerToList(requestId: string) {
    const abortController = new AbortController();
    this.abortControllers.set(requestId, abortController);

    return abortController.signal;
  }

  private removeAbortControllerFromList(requestId: string) {
    this.abortControllers.delete(requestId);
  }
}

export function initHttpClient(apiGatewayUrl: string) {
  httpClient = new HttpClient(apiGatewayUrl);
}
