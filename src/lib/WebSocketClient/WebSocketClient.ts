export class WebSocketClient {
  private ws: WebSocket | null = null;

  connect(url: string): void {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) throw new Error('URL is required');

    this.disconnect();

    this.ws = new WebSocket(trimmedUrl);
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
