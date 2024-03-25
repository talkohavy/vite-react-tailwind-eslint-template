import type { MySocket } from '@luckylove-pkg/types';
import type { ActionCreatorWithPreparedPayload, PayloadAction } from '@reduxjs/toolkit';

declare type RestMethodNames = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

declare interface ApiRequest {
  /**
   * The method of the request. Options are: GET, POST, PUT, PATCH, DELETE.
   * @default "GET"
   */
  method: RestMethodNames;
  /**
   * The target URL of the request.
   */
  URL: string;
  /**
   * The required body object if the method is one of the following: POST,PUT,PATCH.
   */
  body?: object;
  /**
   * The config object of axios.
   */
  config?: object;
  /**
   * The onSuccess redux action for when a response is successful. Default is _null_.
   */
  onSuccess?: ActionCreatorWithPreparedPayload<[payload: any, config: any], any, string, never, never>;
  /**
   * The onFailure redux action for when a response is a failure. Default is _null_.
   */
  onFailure?: ActionCreatorWithPreparedPayload<[payload: { error: any }], { error: any }, string, never, never>;
  /**
   * **OPTIONAL**
   *
   * If upon a SUCCESS/FAILURE you find yourself in need of a `socket.emit()`,
   * you can pass a `socket` object when making the request, so that you'll have access to it when the response from the server comes back.
   */
  socket?: MySocket;
}

export type { ApiRequest, RestMethodNames };
