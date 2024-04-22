import type { MySocket } from '@luckylove-pkg/types';
import type { ActionCreatorWithPreparedPayload, PayloadAction } from '@reduxjs/toolkit';

export type ApiRequest = {
  dalMethodName: string;
  dalMethodProps: any;
  requestMetadata?: any;
  onSuccess?: OnSuccessAction;
  onFailure?: onFailureAction;
};
export type OnSuccessAction = ActionCreatorWithPreparedPayload<
  [payload: { response: any; requestMetadata?: any }],
  any
>;

export type onFailureAction = ActionCreatorWithPreparedPayload<[payload: { error: Error; requestMetadata?: any }], any>;
