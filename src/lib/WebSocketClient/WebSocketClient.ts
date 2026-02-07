import { DEFAULT_RETRY_OPTIONS } from './logic/constants';
import type { WebSocketClientOptions, WebSocketCloseEvent, WebSocketRetryOptions } from './WebSocketClient.interface';

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private intentionalDisconnect = false;
  private retryCount = 0;
  private retryTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private retryStrategy: Required<WebSocketRetryOptions> | null = null;

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

  connect(): void {
    this.disconnect();
    this.intentionalDisconnect = false;
    this.retryCount = 0;

    this.createConnection();
  }

  private createConnection(): void {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = this.onOpen ?? null;
    this.ws.onclose = this.handleWsClose.bind(this);
    this.ws.onerror = this.onError ?? null;
    this.ws.onmessage = this.onMessage ?? null;
  }

  disconnect(): void {
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

  getRetryCount(): number {
    return this.retryCount;
  }

  private handleWsClose(): void {
    this.ws = null;

    if (!this.retryStrategy) {
      this.onClose?.({ shouldRetry: false });
      return;
    }

    const { maxRetries, retryDelayMs } = this.retryStrategy;

    const shouldRetry = !this.intentionalDisconnect && this.retryCount < maxRetries;

    this.onClose?.({ shouldRetry });

    if (shouldRetry) {
      this.retryCount += 1;
      this.onRetry?.(this.retryCount);

      this.retryTimeoutId = setTimeout(() => {
        this.retryTimeoutId = null;
        this.createConnection();
      }, retryDelayMs);
    }
  }
}
