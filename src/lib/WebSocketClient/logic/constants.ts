import type { WebSocketRetryOptions } from '../WebSocketClient.interface';

export const DEFAULT_RETRY_OPTIONS: Required<WebSocketRetryOptions> = {
  maxRetries: 5,
  retryDelayMs: 1000,
};
