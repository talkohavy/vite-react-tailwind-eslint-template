import type { WebSocketClientOptions } from './WebSocketClient.interface';

export class WebSocketClient {
  private ws: WebSocket | null = null;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: () => void;
  onMessage?: (event: MessageEvent<string | Blob>) => void;

  constructor(url: string, options?: WebSocketClientOptions) {
    const { onOpen, onClose, onError, onMessage } = options ?? {};

    const trimmedUrl = url.trim();

    if (!trimmedUrl) throw new Error('URL is required');

    this.url = trimmedUrl;

    this.onOpen = onOpen;
    this.onClose = onClose;
    this.onError = onError;
    this.onMessage = onMessage;
  }

  private readonly url: string;

  connect(): void {
    this.disconnect();

    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => this.onOpen?.();
    this.ws.onclose = () => this.onClose?.();
    this.ws.onerror = () => this.onError?.();
    this.ws.onmessage = (event) => this.onMessage?.(event);
  }

  disconnect(): void {
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
}
