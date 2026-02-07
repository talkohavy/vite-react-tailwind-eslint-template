export type WebSocketRetryOptions = {
  /**
   * Maximum number of reconnect attempts.
   *
   * @default 5
   */
  maxRetries?: number;
  /**
   * Delay in ms before each retry.
   *
   * @default 1000
   */
  retryDelayMs?: number;
};

export type WebSocketCloseEvent = {
  /**
   * should the client attempt to reconnect automatically.
   */
  shouldRetry: boolean;
};

export type WebSocketClientOptions = {
  onOpen?: () => void;
  onClose?: (event: WebSocketCloseEvent) => void;
  onError?: () => void;
  onMessage?: (event: MessageEvent<string | Blob>) => void;
  /**
   * Called when a reconnection attempt is made. Receives the current retry count.
   */
  onRetry?: (retryCount: number) => void;
  /**
   * Enable automatic reconnection on unexpected disconnect. Use defaults or provide custom options.
   */
  retryStrategy?: WebSocketRetryOptions | boolean;
};
