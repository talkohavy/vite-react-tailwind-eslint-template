import { DEFAULT_RETRY_OPTIONS } from './logic/constants';
import type { WebSocketClientOptions, WebSocketCloseEvent, WebSocketRetryOptions } from './WebSocketClient.interface';

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private connectionGeneration = 0;
  private intentionalDisconnect = false;
  private retryCount = 0;
  private retryTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private retryStrategy: Required<WebSocketRetryOptions> | null = null;
  private pendingConnect: { resolve: () => void; reject: (reason: Error) => void } | null = null;

  onOpen?: () => void;
  onClose?: (event: WebSocketCloseEvent) => void;
  onError?: (err: any) => void;
  onMessage?: (event: MessageEvent<string | Blob>) => void;
  onRetry?: (retryCount: number) => void;

  constructor(url: string, options?: WebSocketClientOptions) {
    const { onOpen, onClose, onError, onMessage, onRetry, retryStrategy } = options ?? {};

    const trimmedUrl = url.trim();

    if (!trimmedUrl) throw new Error('URL is required');

    this.url = trimmedUrl;

    this.onOpen = onOpen;
    this.onClose = onClose;
    this.onError = onError;
    this.onMessage = onMessage;
    this.onRetry = onRetry;

    if (retryStrategy) {
      this.retryStrategy =
        typeof retryStrategy === 'object' ? { ...DEFAULT_RETRY_OPTIONS, ...retryStrategy } : DEFAULT_RETRY_OPTIONS;
    }
  }

  private readonly url: string;

  /**
   * Opens a connection and resolves when the socket reaches OPEN.
   * Rejects if disconnected, superseded by another connect(), or retries are exhausted without success.
   * @throws {Error} If the connection is superseded by a new connect() call.
   */
  connect(): Promise<void> {
    this.rejectPendingConnectIfExists(new Error('Connection superseded by a new connect() call'));
    this.disconnect();
    this.intentionalDisconnect = false;
    this.retryCount = 0;

    return new Promise((resolve, reject) => {
      this.pendingConnect = { resolve, reject };
      this.createConnection();
    });
  }

  private rejectPendingConnectIfExists(reason: Error): void {
    if (!this.pendingConnect) return;

    this.pendingConnect.reject(reason);
    this.pendingConnect = null;
  }

  private fulfillPendingConnectIfExists(): void {
    if (!this.pendingConnect) return;

    this.pendingConnect.resolve();
    this.pendingConnect = null;
  }

  /**
   * createConnection uses connectionGeneration (incremented mod 100),
   * so that stale async events from superseded sockets are ignored.
   */
  private createConnection(): void {
    this.connectionGeneration = (this.connectionGeneration + 1) % 10000;
    const generation = this.connectionGeneration;
    const ws = new WebSocket(this.url);
    this.ws = ws;

    ws.onopen = () => {
      if (generation !== this.connectionGeneration) {
        console.log('ignoring onopen of superseded socket');
        return;
      }

      this.onOpen?.();
      this.fulfillPendingConnectIfExists();
    };
    ws.onclose = () => {
      if (generation !== this.connectionGeneration) {
        console.log('ignoring onclose of superseded socket');
        return;
      }

      this.handleWsClose();
    };
    ws.onerror = (event) => {
      if (generation !== this.connectionGeneration) {
        console.log('ignoring onerror of superseded socket');
        return;
      }

      this.onError?.(event);
    };
    ws.onmessage = (event) => {
      if (generation !== this.connectionGeneration) {
        console.log('ignoring onmessage of superseded socket');
        return;
      }

      this.onMessage?.(event);
    };
  }

  disconnect(): void {
    this.rejectPendingConnectIfExists(new Error('WebSocket disconnected'));
    this.intentionalDisconnect = true;

    if (this.retryTimeoutId !== null) {
      clearTimeout(this.retryTimeoutId);
      this.retryTimeoutId = null;
    }

    if (!this.ws) return;

    this.ws.close();
    this.ws = null;
  }

  send(data: string): void {
    if (!(this.ws && this.ws.readyState === WebSocket.OPEN)) return;

    this.ws.send(data);
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  getSocket(): WebSocket | null {
    return this.ws;
  }

  getConnectionStatus() {
    return this.ws?.readyState ?? WebSocket.CLOSED;
  }

  getRetryCount(): number {
    return this.retryCount;
  }

  private handleWsClose(): void {
    this.ws = null;

    if (this.intentionalDisconnect) {
      this.onClose?.({ shouldRetry: false });
      this.rejectPendingConnectIfExists(new Error('WebSocket disconnected'));
      return;
    }

    if (!this.retryStrategy) {
      this.onClose?.({ shouldRetry: false });
      this.rejectPendingConnectIfExists(new Error('WebSocket connection failed'));
      return;
    }

    const { maxRetries, retryDelayMs } = this.retryStrategy;

    const shouldRetry = this.retryCount < maxRetries;

    this.onClose?.({ shouldRetry });

    if (shouldRetry) {
      this.retryCount += 1;
      this.onRetry?.(this.retryCount);

      this.retryTimeoutId = setTimeout(() => {
        this.retryTimeoutId = null;
        this.createConnection();
      }, retryDelayMs);
    } else {
      this.rejectPendingConnectIfExists(new Error('WebSocket connection failed after maximum retries'));
    }
  }
}
