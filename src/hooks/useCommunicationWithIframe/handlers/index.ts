import { PostMessageTypes, type PostMessageTypeValues } from '../logic/constants';
import { requestOriginHandler } from './requestOriginHandler';

export const allMessageHandlers: Record<PostMessageTypeValues, (props: any) => any> = {
  [PostMessageTypes.RequestOrigin]: requestOriginHandler,
};
